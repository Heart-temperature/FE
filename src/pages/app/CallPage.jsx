import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box, Progress } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import DabokVideo from '../../video/dabok.webm';
import DajeongVideo from '../../video/dajeung.webm';
import useAppSettings from '../../hooks/useAppSettings';

import { endCall, startCall } from '../../api/callAPI';
import { getAiSocket, connectAiSocket, closeAiSocket } from '../../api/aiSocket';
import useWebSocketHandler from '../../hooks/useWebSocketHandler';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

// 한국어 조사 처리 헬퍼 함수: 이름 끝에 받침이 있으면 "이", 없으면 "가"
const getKoreanParticle = (name) => {
    if (!name || name === '사용자') return '가';
    const lastChar = name[name.length - 1];
    const lastCharCode = lastChar.charCodeAt(0);
    // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
    if (lastCharCode >= 0xAC00 && lastCharCode <= 0xD7A3) {
        const hasFinalConsonant = (lastCharCode - 0xAC00) % 28 !== 0;
        return hasFinalConsonant ? '이' : '가';
    }
    return '가'; // 한글이 아니면 기본값
};

// 사용자가 말하는 중 애니메이션 컴포넌트
const AnimatedSpeakingText = ({ userName }) => {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '.';
            });
        }, 500); // 0.5초마다 변경

        return () => clearInterval(interval);
    }, []);

    const particle = getKoreanParticle(userName);
    const displayName = userName || '사용자';

    return (
        <Box as="span" display="inline-block" textAlign="center" w="100%">
            {displayName}{particle} 말하는 중{dots}
        </Box>
    );
};

// AI 답변 생성 중 프로그레스 바 컴포넌트
const AIThinkingProgress = ({ isHighContrast, characterName }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 프로그레스 바가 0에서 100까지 반복적으로 증가
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 0; // 100% 도달 시 다시 0으로
                }
                return prev + 2; // 2%씩 증가
            });
        }, 50); // 50ms마다 업데이트 (부드러운 애니메이션)

        return () => clearInterval(interval);
    }, []);

    const thinkingText = characterName ? `${characterName}가 생각 중이에요...` : '답변을 만들고 있어요...';

    return (
        <VStack spacing={3} w="100%" py={2}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" color={isHighContrast ? '#FFFFFF' : '#000000'}>
                {thinkingText}
            </Text>
            <Progress
                value={progress}
                size="lg"
                colorScheme="blue"
                borderRadius="full"
                w="100%"
                hasStripe
                isAnimated
            />
        </VStack>
    );
};

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isHighContrast, fs, callBtnH } = useAppSettings();

    const [isTalking, setIsTalking] = useState(false);
    const [_isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [aiSubtitle, setAiSubtitle] = useState('통화 연결 중...'); // AI 자막 (메인)
    const [userSubtitle, setUserSubtitle] = useState(''); // 사용자 말한 내용 (디버깅용, 하단 표시)
    const [_aiMessages, setAiMessages] = useState([]);
    const [vadStatus, setVadStatus] = useState(''); // 빈 문자열로 시작 (음성 인식 시작 전에는 표시 안 함)
    const [isCallEnded, setIsCallEnded] = useState(false); // 통화 종료 상태
    const [userName, setUserName] = useState('사용자'); // 사용자 이름 (기본값: "사용자")
    const isFirstTtsRef = useRef(true); // 첫 TTS인지 추적

    const videoRef = useRef(null);
    const pendingTranscriptionRef = useRef(null); // TTS 재생 중에 온 transcription 저장
    const audioStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const processorRef = useRef(null);
    const audioBufferRef = useRef([]);
    const silenceStartTimeRef = useRef(null);
    const vadStateRef = useRef('idle');
    const aiSpeakingRef = useRef(false);
    const audioChunkCountRef = useRef(0);
    const rmsLogIntervalRef = useRef(0);
    const consecutiveVoiceFramesRef = useRef(0); // 연속 음성 프레임 카운트 (노이즈 필터링)
    const rmsHistoryRef = useRef([]); // RMS 히스토리 (평균 계산용)
    const isCallStartedRef = useRef(false);
    const isRecordingRef = useRef(false);
    const recordingStartTimeRef = useRef(null);
    const isWaitingForEndTtsRef = useRef(false); // 통화 종료 TTS 대기 중인지 추적
    const isInitializingRef = useRef(false); // 통화 초기화 중인지 추적 (중복 실행 방지)
    const initCallPromiseRef = useRef(null); // initCall Promise 추적 (중복 실행 방지)
    const startCallExecutedRef = useRef(false); // startCall 실행 여부 추적 (중복 방지)

    // VAD 설정 (사람 음성만 감지하도록 엄격한 조건)
    const VAD_THRESHOLD = 0.005; // 노이즈 필터링을 위해 임계값 대폭 상향 (기존: 0.002)
    const SILENCE_DURATION = 2000; // 할머니 할아버지를 위해 침묵 시간을 3초로 설정
    const MIN_RECORDING_TIME = 1000; // 최소 녹음 시간을 2초로 증가 (노이즈로 인한 잘못된 전송 방지)
    const MIN_AUDIO_CHUNKS = 20; // 최소 청크 수 증가 (기존: 20) - 더 많은 데이터 필요
    const MIN_RMS_FOR_START = 0.008; // 녹음 시작을 위한 최소 RMS 값 (사람 음성만 감지하도록 높게 설정)
    const MIN_CONSECUTIVE_FRAMES = 8; // 연속 프레임 수 증가 (기존: 5) - 더 엄격한 조건
    const MIN_RMS_AVERAGE = 0.006; // 연속 프레임의 평균 RMS 값 (일시적 노이즈 필터링)

    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    useEffect(() => {
        console.log('📄 CallPage 마운트/업데이트');
        console.log('   location.state:', location.state);
        console.log('   location.pathname:', location.pathname);
        
        // 중복 실행 방지 (초기화 중이거나 이미 시작된 경우, 또는 이미 실행 중인 Promise가 있는 경우)
        if (isInitializingRef.current || isCallStartedRef.current || initCallPromiseRef.current) {
            console.log('⚠️ 통화 초기화 중이거나 이미 시작되었습니다. 중복 호출 방지');
            console.log('   isInitializingRef:', isInitializingRef.current);
            console.log('   isCallStartedRef:', isCallStartedRef.current);
            console.log('   initCallPromiseRef:', !!initCallPromiseRef.current);
            return;
        }

        let isCancelled = false; // 취소 플래그 (cleanup에서만 설정)

        const initCall = async () => {
            // Promise 추적 시작
            initCallPromiseRef.current = Promise.resolve();
            // location.state가 없으면 여러 번 확인 (navigate 완료 대기)
            if (!location.state || !location.state.character) {
                console.log('⏳ location.state 대기 중... (navigate 완료 대기)');
                
                // 최대 1초 동안 100ms 간격으로 확인 (총 10번)
                for (let i = 0; i < 10; i++) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (isCancelled) return; // 취소되었으면 중단
                    if (location.state && location.state.character) {
                        console.log(`✅ location.state 확인됨 (${(i + 1) * 100}ms 후)`);
                        break;
                    }
                }
                
                // 취소되었으면 중단
                if (isCancelled) return;
                
                // 다시 확인해도 없으면 홈으로 리다이렉션
                if (!location.state || !location.state.character) {
                    console.warn('⚠️ location.state가 없습니다. 홈으로 이동합니다.');
                    console.warn('   location.state:', location.state);
                    navigate('/app/home');
                    return;
                }
            }

            // 취소되었으면 중단
            if (isCancelled) return;

            // 초기화 시작 플래그 설정
            isInitializingRef.current = true;

            // 통화 시작 시 모든 상태 초기화
            console.log('='.repeat(50));
            console.log('🎬 통화 초기화 시작 (상태 초기화)');
            console.log('='.repeat(50));
            
            // 모든 상태 초기화 (startCallExecutedRef는 리셋하지 않음 - 중복 방지용)
            isCallStartedRef.current = false; // 통화 시작 플래그 리셋
            isRecordingRef.current = false;
            recordingStartTimeRef.current = null;
            isWaitingForEndTtsRef.current = false;
            vadStateRef.current = 'idle';
            silenceStartTimeRef.current = null;
            audioBufferRef.current = [];
            audioChunkCountRef.current = 0;
            consecutiveVoiceFramesRef.current = 0;
            rmsHistoryRef.current = [];
            aiSpeakingRef.current = false;
            pendingTranscriptionRef.current = null;
            isFirstTtsRef.current = true; // 첫 TTS 플래그 리셋
            // startCallExecutedRef는 리셋하지 않음 (중복 호출 방지)
            setVadStatus('');
            setAiSubtitle('통화 연결 중...');
            setUserSubtitle('');
            setIsTalking(false);
            setIsUserSpeaking(false);

            // location.state 확인 (이미 위에서 확인했지만 다시 확인)
            if (location.state && location.state.character) {
                const { character, politeness } = location.state;
                console.log('✅ location.state 확인됨:', { character, politeness });

                // 통화 시작 (WebSocket 연결 포함 - startCall에서 자동 연결)
                try {
                    // 취소되었으면 중단
                    if (isCancelled) {
                        isInitializingRef.current = false;
                        return;
                    }

                    // 통화 재시작 시 기존 WebSocket을 완전히 끊고 새로 연결
                    console.log('🔌 WebSocket 완전히 재연결 중...');
                    
                    // 기존 소켓 완전히 정리
                    let aiSocket = getAiSocket();
                    if (aiSocket) {
                        console.log('   기존 소켓 정리 중...');
                        console.log('   기존 소켓 상태:', aiSocket.readyState);
                        
                        try {
                            // 핸들러 완전히 제거
                            if (aiSocket._handlerRegistered) {
                                console.log('   기존 핸들러 제거 중...');
                                delete aiSocket._handlerRegistered;
                            }
                            // 모든 이벤트 핸들러 제거
                            aiSocket.onmessage = null;
                            aiSocket.onerror = null;
                            aiSocket.onclose = null;
                            aiSocket.onopen = null;
                            
                            // 소켓 닫기
                            if (aiSocket.readyState === WebSocket.OPEN || aiSocket.readyState === WebSocket.CONNECTING) {
                                console.log('   기존 소켓 닫기 중...');
                                aiSocket.close();
                            }
                        } catch (e) {
                            console.warn('   기존 소켓 정리 중 오류:', e);
                        }
                    }
                    
                    // aiSocket.js의 전역 변수도 초기화 (완전히 끊기)
                    closeAiSocket();
                    // 소켓이 완전히 닫힐 때까지 잠시 대기
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    // 새로 연결 (무조건 새 연결)
                    console.log('   새 WebSocket 연결 시도...');
                    await connectAiSocket();
                    console.log('   ✅ WebSocket 새 연결 완료');
                    
                    // 연결 확인
                    aiSocket = getAiSocket();
                    if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
                        throw new Error('WebSocket 연결 실패');
                    }
                    console.log('   ✅ WebSocket 연결 상태 확인:', aiSocket.readyState);
                    
                    // 취소되었으면 중단 (하지만 startCall은 호출해야 함)
                    if (isCancelled) {
                        console.log('⚠️ WebSocket 연결 후 취소됨 - 하지만 startCall은 호출');
                    }

                    // startCall은 반드시 호출 (취소되었어도 호출 후 정리)
                    // 중복 실행 방지 (전역적으로 체크)
                    if (startCallExecutedRef.current) {
                        console.warn('⚠️ startCall이 이미 실행되었습니다. 중복 호출 방지');
                        // 이미 실행 중이면 여기서 중단
                        if (isCancelled) {
                            isInitializingRef.current = false;
                        }
                        return;
                    }
                    
                    // 사용자 정보 가져오기 (callInfo API 호출)
                    try {
                        const token = localStorage.getItem('userToken');
                        if (token) {
                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/webkit';
                            const response = await axios.get(`${API_BASE_URL}/call/callInfo`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true',
                                },
                            });
                            const data = response.data;
                            if (data.user_info && data.user_info.name) {
                                setUserName(data.user_info.name);
                                console.log('✅ 사용자 이름 설정:', data.user_info.name);
                            }
                        }
                    } catch (error) {
                        console.warn('⚠️ 사용자 정보 가져오기 실패 (기본값 사용):', error);
                    }
                    
                    console.log('📞 startCall 호출 시작...');
                    startCallExecutedRef.current = true; // 실행 플래그 설정 (전역적으로 설정)
                    
                    try {
                        await startCall(character, politeness);
                        console.log('✅ startCall 호출 완료');
                    } catch (error) {
                        console.error('❌ startCall 호출 실패:', error);
                        // 에러 발생 시에도 플래그는 유지 (중복 호출 방지)
                        throw error;
                    }
                    
                    // startCall 후에는 반드시 마이크와 핸들러를 설정해야 함 (AI 서버가 TTS를 보내기 때문)
                    // 취소되었어도 통화는 시작되었으므로 핸들러와 마이크는 설정해야 함
                    
                    // 통화 시작 성공 후 플래그 설정
                    isCallStartedRef.current = true;
                    isInitializingRef.current = false; // 초기화 완료
                    
                    // WebSocket 연결이 성공한 후에만 핸들러 설정 (TTS 수신을 위해 필수)
                    aiSocket = getAiSocket();
                    if (aiSocket && aiSocket.readyState === WebSocket.OPEN) {
                        console.log('📡 WebSocket 핸들러 설정 중...');
                        setupWebSocketHandler();
                        console.log('✅ WebSocket 핸들러 설정 완료');
                    } else {
                        console.error('❌ WebSocket이 연결되지 않아 핸들러 설정 실패');
                        throw new Error('WebSocket 연결이 없습니다');
                    }
                    
                    // 마이크 시작 (사용자 음성 입력을 위해 필수)
                    console.log('🎤 마이크 시작 중...');
                    startMicrophone();
                    console.log('✅ 마이크 시작 완료');

                    console.log('✅ 통화 초기화 완료');
                    console.log('='.repeat(50));
                } catch (error) {
                    console.error('❌ 통화 시작 실패:', error);
                    // 통화 시작 실패 시 상태 초기화
                    if (!isCancelled) {
                        isCallStartedRef.current = false;
                        isInitializingRef.current = false; // 초기화 실패
                        // 통화 시작 실패 시 홈으로 이동
                        navigate('/app/home');
                    }
                }
            } else {
                // location.state가 여전히 없으면 홈으로 리다이렉션
                if (!isCancelled) {
                    console.warn('⚠️ location.state가 없습니다. 홈으로 이동합니다.');
                    isInitializingRef.current = false;
                    navigate('/app/home');
                }
            }
            
            // Promise 추적 종료
            initCallPromiseRef.current = null;
            // startCallExecutedRef는 cleanup에서만 리셋 (React StrictMode 대응)
            // initCall 완료 시에는 리셋하지 않음
        };

        // Promise 추적 시작
        initCallPromiseRef.current = initCall();

        return () => {
            console.log('🧹 CallPage cleanup 시작');
            isCancelled = true; // 취소 플래그 설정
            
            // cleanup 시 상태 리셋 (다음 통화 시작을 위해)
            // React StrictMode의 double-invoke는 isCancelled 플래그로 처리
            // 하지만 실제 언마운트가 아닌 경우(StrictMode)에는 플래그를 유지해야 함
            // 따라서 cleanup에서는 마이크만 중지하고, 플래그는 다음 마운트에서 체크
            
            // 마이크만 중지
            if (isRecordingRef.current) {
                stopMicrophone();
            }
            
            // 실제 언마운트인 경우에만 플래그 리셋 (location.pathname 변경 감지)
            // React StrictMode의 cleanup은 무시하고, 실제 언마운트 시에만 리셋
            // 이는 다음 useEffect 실행에서 location.pathname이 변경되었는지로 판단
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.state]);

    const startMicrophone = async () => {
        try {
            console.log('🎤 마이크 권한 요청 중...');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            audioStreamRef.current = stream;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            console.log('🔊 AudioContext 샘플레이트:', audioContext.sampleRate, 'Hz');

            const source = audioContext.createMediaStreamSource(stream);

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 2.0;
            console.log('🔊 마이크 게인 설정:', gainNode.gain.value, 'x');

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // RMS 계산
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);


                if (aiSpeakingRef.current) {
                    if (vadStateRef.current !== 'idle') {
                        console.log('🤖 AI 말하는 중 - VAD 비활성화 및 녹음 중지');
                        vadStateRef.current = 'idle';
                        silenceStartTimeRef.current = null;
                        setIsUserSpeaking(false);
                        setVadStatus(''); // TTS 재생 중에는 상태 표시 안 함

                        if (isRecordingRef.current) {
                            console.log('🛑 AI 말하는 중 - 녹음 강제 종료');
                            sendStopMessage();
                            audioBufferRef.current = [];
                            audioChunkCountRef.current = 0;
                            recordingStartTimeRef.current = null;
                        }
                    }
                    // TTS 재생 중에는 오디오 처리 자체를 하지 않음
                    return;
                }

                const now = Date.now();

                if (rms > VAD_THRESHOLD) {
                    // RMS 히스토리에 추가 (최근 10개만 유지)
                    rmsHistoryRef.current.push(rms);
                    if (rmsHistoryRef.current.length > 10) {
                        rmsHistoryRef.current.shift();
                    }

                    // 연속 음성 프레임 카운트 증가 (더 엄격한 조건)
                    if (rms > MIN_RMS_FOR_START) {
                        consecutiveVoiceFramesRef.current++;
                    } else {
                        consecutiveVoiceFramesRef.current = 0;
                        rmsHistoryRef.current = []; // 조건 미충족 시 히스토리 리셋
                    }

                    // 음성 감지 시작 (idle 상태에서만, 그리고 충분히 강한 음성이 연속으로 감지될 때)
                    if (vadStateRef.current === 'idle') {
                        // 평균 RMS 계산 (일시적 노이즈 필터링)
                        const avgRms = rmsHistoryRef.current.length > 0
                            ? rmsHistoryRef.current.reduce((a, b) => a + b, 0) / rmsHistoryRef.current.length
                            : 0;

                        // 최소 RMS 값, 연속 프레임, 평균 RMS 체크로 노이즈 필터링 강화
                        if (
                            rms >= MIN_RMS_FOR_START &&
                            consecutiveVoiceFramesRef.current >= MIN_CONSECUTIVE_FRAMES &&
                            avgRms >= MIN_RMS_AVERAGE
                        ) {
                            console.log('='.repeat(50));
                            console.log('🎤 음성 감지 시작! (사람 음성 감지)');
                            console.log('   현재 RMS 값:', rms.toFixed(7));
                            console.log('   평균 RMS 값:', avgRms.toFixed(7));
                            console.log('   임계값:', VAD_THRESHOLD);
                            console.log('   최소 RMS:', MIN_RMS_FOR_START);
                            console.log('   최소 평균 RMS:', MIN_RMS_AVERAGE);
                            console.log('   연속 프레임:', consecutiveVoiceFramesRef.current);
                            console.log('='.repeat(50));

                            sendStartMessage();

                            vadStateRef.current = 'speaking';
                            setIsUserSpeaking(true);
                            // 한국어 조사 처리
                            const particle = getKoreanParticle(userName);
                            setVadStatus(`${userName}${particle} 말하는 중`); // 음성 인식 시작 시에만 상태 표시
                            audioBufferRef.current = [];
                            audioChunkCountRef.current = 0;
                            recordingStartTimeRef.current = now;
                            consecutiveVoiceFramesRef.current = 0; // 리셋
                            rmsHistoryRef.current = []; // 리셋
                        }
                    }

                    // 침묵에서 다시 음성 감지
                    if (silenceStartTimeRef.current !== null) {
                        const wasSilent = vadStateRef.current === 'silence';
                        const interruptedSilenceDuration = now - silenceStartTimeRef.current;
                        silenceStartTimeRef.current = null;

                        if (wasSilent) {
                            console.log(`🎤 침묵 중단 (${interruptedSilenceDuration}ms 만에) - 계속 녹음`);
                            vadStateRef.current = 'speaking';
                            // 한국어 조사 처리
                            const particle = getKoreanParticle(userName);
                            setVadStatus(`${userName}${particle} 말하는 중`); // 사용자가 다시 말하기 시작
                        }
                    }

                    // PCM16 변환 (16kHz 다운샘플링)
                    const downsampleRatio = Math.round(audioContext.sampleRate / 16000);
                    const downsampledLength = Math.floor(inputData.length / downsampleRatio);
                    const downsampledData = new Float32Array(downsampledLength);

                    for (let i = 0; i < downsampledLength; i++) {
                        downsampledData[i] = inputData[i * downsampleRatio];
                    }

                    const int16Data = new Int16Array(downsampledLength);
                    for (let i = 0; i < downsampledLength; i++) {
                        const s = Math.max(-1, Math.min(1, downsampledData[i]));
                        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                    }

                    // 오디오 청크를 버퍼에만 저장 (침묵 시간이 지나 stop 메시지 전송 시 한 번에 전송)
                    // TTS 재생 중이면 오디오 청크 버퍼에 저장하지 않음
                    if (isRecordingRef.current && !aiSpeakingRef.current) {
                        audioBufferRef.current.push(int16Data);
                        audioChunkCountRef.current++;

                        if (audioChunkCountRef.current === 1 || audioChunkCountRef.current % 10 === 0) {
                            console.log(`🔊 청크 버퍼링 중: ${audioChunkCountRef.current}개 (아직 전송 안 함)`);
                        }
                    } else if (aiSpeakingRef.current && isRecordingRef.current) {
                        // TTS 재생 중에는 오디오 청크 버퍼 비우기
                        audioBufferRef.current = [];
                        audioChunkCountRef.current = 0;
                    }
                } else {
                    // 침묵 감지 (RMS가 임계값 이하)
                    consecutiveVoiceFramesRef.current = 0; // 침묵 시 리셋
                    rmsHistoryRef.current = []; // RMS 히스토리도 리셋
                    
                    if (vadStateRef.current === 'speaking') {
                        if (silenceStartTimeRef.current === null) {
                            silenceStartTimeRef.current = now;
                            vadStateRef.current = 'silence';
                            console.log('='.repeat(50));
                            console.log('🔇 침묵 감지 - 대기 시작');
                            console.log('   현재 녹음 상태:', isRecordingRef.current);
                            console.log('   현재 청크 수:', audioChunkCountRef.current);
                            console.log('='.repeat(50));
                            // "말 안하는 중" 상태는 표시하지 않음
                            setVadStatus('');
                        }
                    }

                    // 침묵 지속 시간 체크
                    if (vadStateRef.current === 'silence' && silenceStartTimeRef.current !== null) {
                        const silenceDuration = now - silenceStartTimeRef.current;

                        // 100ms마다 로그
                        if (Math.floor(silenceDuration / 100) !== Math.floor((silenceDuration - 50) / 100)) {
                            console.log(
                                `⏱️ 침묵 ${silenceDuration}ms / ${SILENCE_DURATION}ms (청크: ${audioChunkCountRef.current})`
                            );
                        }

                        if (silenceDuration >= SILENCE_DURATION) {
                            // 녹음 시간 체크
                            const recordingDuration = recordingStartTimeRef.current
                                ? now - recordingStartTimeRef.current
                                : 0;

                            console.log('='.repeat(50));
                            console.log('📤 침묵 지속 - 녹음 종료 판단');
                            console.log('   침묵 시간:', silenceDuration, 'ms');
                            console.log('   녹음 시간:', recordingDuration, 'ms');
                            console.log('   청크 수:', audioChunkCountRef.current);
                            console.log('='.repeat(50));

                            // 최소 녹음 시간 및 청크 수 체크
                            if (
                                isRecordingRef.current &&
                                recordingDuration >= MIN_RECORDING_TIME &&
                                audioChunkCountRef.current >= MIN_AUDIO_CHUNKS
                            ) {
                                console.log('✅ 모든 조건 만족 - 녹음 종료, 서버로 전송');
                                // 캐릭터별 "생각 중" 프로그레스 바 표시 (오디오 전송 전에 표시)
                                const thinkingMessage = `${character.name}가 생각 중이에요`;
                                setVadStatus(thinkingMessage);
                                sendStopMessage();
                            } else {
                                console.log('⚠️ 조건 미충족 - 녹음이 너무 짧거나 데이터 없음');
                                isRecordingRef.current = false;
                                // 조건 미충족 시 상태 초기화 (표시 안 함)
                                setVadStatus('');

                                setTimeout(() => {
                                    if (vadStateRef.current === 'idle') {
                                        setVadStatus(''); // idle 상태에서는 상태 표시 안 함
                                    }
                                }, 2000);
                            }

                            vadStateRef.current = 'idle';
                            setIsUserSpeaking(false);
                            // audioBufferRef는 sendStopMessage에서 사용하므로 여기서 비우지 않음
                            // audioChunkCountRef도 sendStopMessage에서 사용하므로 여기서 리셋하지 않음
                            silenceStartTimeRef.current = null;
                            recordingStartTimeRef.current = null;
                            consecutiveVoiceFramesRef.current = 0; // 리셋
                            rmsHistoryRef.current = []; // RMS 히스토리 리셋
                            // 캐릭터별 "생각 중" 프로그레스 바는 유지 (AI 오디오 수신 전까지)
                            // setVadStatus('')는 하지 않음
                        }
                    }
                }
            };

            source.connect(gainNode);
            gainNode.connect(analyser);
            analyser.connect(processor);
            processor.connect(audioContext.destination);

            console.log('='.repeat(50));
            console.log('✅ 마이크 시작 완료 (실시간 스트리밍 방식)');
            console.log('   VAD 임계값:', VAD_THRESHOLD, '(사람 음성만 감지)');
            console.log('   최소 RMS (녹음 시작):', MIN_RMS_FOR_START);
            console.log('   최소 평균 RMS:', MIN_RMS_AVERAGE);
            console.log('   연속 프레임 수:', MIN_CONSECUTIVE_FRAMES);
            console.log('   침묵 시간:', SILENCE_DURATION, 'ms', `(${SILENCE_DURATION / 1000}초)`);
            console.log('   최소 녹음 시간:', MIN_RECORDING_TIME, 'ms');
            console.log('   최소 청크 수:', MIN_AUDIO_CHUNKS);
            console.log('='.repeat(50));

            setVadStatus(''); // 마이크 시작 시에는 상태 표시 안 함
        } catch (error) {
            console.error('❌ 마이크 권한 요청 실패:', error);
            alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
            setVadStatus('❌ 마이크 오류');
        }
    };

    const sendStartMessage = () => {
        const socket = getAiSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket 연결 안 됨');
            return;
        }

        if (isRecordingRef.current) {
            console.log('⚠️ 이미 녹음 중 - start 전송 스킵');
            return;
        }

        try {
            const startMsg = {
                type: 'start',
                lang: 'ko',
            };
            socket.send(JSON.stringify(startMsg));
            isRecordingRef.current = true;
            console.log('📤 START 메시지 전송 완료:', startMsg);
        } catch (error) {
            console.error('❌ 시작 메시지 전송 실패:', error);
        }
    };

    const sendStopMessage = () => {
        const socket = getAiSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket 연결 안 됨');
            return;
        }

        if (!isRecordingRef.current) {
            console.log('⚠️ 녹음 중이 아님 - stop 전송 스킵');
            return;
        }

        try {
            console.log('='.repeat(50));
            console.log('📤 STOP 메시지 전송');
            console.log('   버퍼에 쌓인 청크 수:', audioBufferRef.current.length);

            // 프로그레스 바는 이미 "✅ 모든 조건 만족" 로그 시점에 표시됨

            // 버퍼에 쌓인 모든 오디오 청크를 서버로 전송
            if (audioBufferRef.current.length > 0) {
                console.log('📤 오디오 청크 전송 시작...');
                audioBufferRef.current.forEach((chunk, index) => {
                    try {
                        socket.send(chunk.buffer);
                        if (index === 0 || (index + 1) % 10 === 0 || index === audioBufferRef.current.length - 1) {
                            console.log(`   📤 청크 전송: ${index + 1}/${audioBufferRef.current.length}`);
                        }
                    } catch (error) {
                        console.error(`❌ 청크 ${index + 1} 전송 실패:`, error);
                    }
                });
                console.log('✅ 모든 오디오 청크 전송 완료');
            } else {
                console.log('⚠️ 전송할 오디오 청크가 없음');
            }

            // stop 메시지 전송
            const stopMsg = {
                type: 'stop',
            };
            socket.send(JSON.stringify(stopMsg));
            console.log('   ✅ stop JSON 전송 완료');

            isRecordingRef.current = false;
            console.log('='.repeat(50));
        } catch (error) {
            console.error('❌ 종료 메시지 전송 실패:', error);
        }
    };

    const stopMicrophone = () => {
        console.log('='.repeat(50));
        console.log('🎤 마이크 중지 시작...');

        if (isRecordingRef.current) {
            sendStopMessage();
        }

        silenceStartTimeRef.current = null;
        recordingStartTimeRef.current = null;

        if (processorRef.current) {
            try {
                processorRef.current.disconnect();
                processorRef.current.onaudioprocess = null;
                processorRef.current = null;
            } catch (e) {
                console.warn('   ⚠️ ScriptProcessor 정리 중 오류:', e);
            }
        }

        if (analyserRef.current) {
            try {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            } catch (e) {
                console.warn('   ⚠️ Analyser 정리 중 오류:', e);
            }
        }

        if (audioContextRef.current) {
            try {
                audioContextRef.current.close();
                audioContextRef.current = null;
            } catch (e) {
                console.warn('   ⚠️ AudioContext 정리 중 오류:', e);
            }
        }

        if (audioStreamRef.current) {
            try {
                audioStreamRef.current.getTracks().forEach((track) => track.stop());
                audioStreamRef.current = null;
            } catch (e) {
                console.warn('   ⚠️ 오디오 스트림 정리 중 오류:', e);
            }
        }

        vadStateRef.current = 'idle';
        audioBufferRef.current = [];
        audioChunkCountRef.current = 0;
        rmsLogIntervalRef.current = 0;
        isRecordingRef.current = false;
        setIsUserSpeaking(false);
        setVadStatus(''); // 종료됨 상태는 버튼 텍스트로 표시

        console.log('✅ 마이크 중지 완료');
        console.log('='.repeat(50));
    };

    // WebSocket 핸들러 훅
    const { setupWebSocketHandler, setNormalFinish, hasReceivedCallSummary, startEndingCall } = useWebSocketHandler({
        onAudioReceived: () => {
            // AI 오디오 수신 시 "생각 중" 프로그레스 바 숨김 (오디오 수신 전까지 프로그레스 바 표시)
            if (vadStatus.includes('가 생각 중이에요')) {
                setVadStatus('');
            }
        },
        onTtsAudioStart: () => {
            setIsTalking(true);
            aiSpeakingRef.current = true;
            
            // TTS 재생 시작 시 "생각 중" 프로그레스 바 숨김 (TTS가 재생 중이면 프로그레스 바 표시 안 함)
            if (vadStatus.includes('가 생각 중이에요')) {
                setVadStatus('');
            }
            
            // 첫 TTS 오디오가 실제로 재생될 때만 자막 업데이트 (TTS 오디오 재생 전까지 "통화 거는 중..." 유지)
            if (isFirstTtsRef.current) {
                console.log('🎬 첫 TTS 오디오 재생 시작 - 자막은 TTS 텍스트로 업데이트 (pendingTranscriptionRef에서)');
                isFirstTtsRef.current = false; // 첫 TTS 플래그 해제
                // pendingTranscriptionRef에 저장된 첫 TTS 텍스트가 있으면 표시
                if (pendingTranscriptionRef.current && pendingTranscriptionRef.current.assistantText) {
                    setAiSubtitle(pendingTranscriptionRef.current.assistantText);
                    pendingTranscriptionRef.current = null;
                }
            }
            
            // TTS 재생 시작 시 진행 중인 녹음이 있으면 중지하고 버퍼 비우기
            if (isRecordingRef.current) {
                console.log('🛑 TTS 재생 시작 - 진행 중인 녹음 중지');
                sendStopMessage();
            }
            // TTS 재생 중에는 오디오 청크 버퍼 비우기
            audioBufferRef.current = [];
            audioChunkCountRef.current = 0;
            recordingStartTimeRef.current = null;
            vadStateRef.current = 'idle';
            setIsUserSpeaking(false);
        },
        onTtsAudioEnd: () => {
            setIsTalking(false);
            aiSpeakingRef.current = false;
            setVadStatus(''); // AI 말 끝나면 상태 초기화 (사용자가 말하기 시작할 때까지 표시 안 함)
            
            // TTS 재생 완료 후 대기 중인 transcription 자막 업데이트
            if (pendingTranscriptionRef.current) {
                const { assistantText } = pendingTranscriptionRef.current;
                setAiSubtitle(assistantText || '');
                pendingTranscriptionRef.current = null;
            }
            
            // 통화 종료 TTS가 끝났으면 홈으로 이동
            if (isWaitingForEndTtsRef.current) {
                console.log('✅ 통화 종료 TTS 재생 완료 - 홈으로 이동');
                isWaitingForEndTtsRef.current = false;
                isCallStartedRef.current = false; // 상태 초기화
                
                // 통화 요약을 아직 받지 못한 경우 잠시 대기 후 이동
                if (!hasReceivedCallSummary()) {
                    console.log('⏳ 통화 요약 대기 중...');
                    setTimeout(() => {
                        navigate('/app/home');
                    }, 2000); // 2초 대기
                } else {
                    navigate('/app/home');
                }
            }
        },
        onTtsEnd: () => {
            // TTS 종료 메시지 수신 (오디오 재생 종료와 별개)
            // 통화 종료 TTS인 경우 확인
            if (isWaitingForEndTtsRef.current) {
                console.log('✅ TTS 종료 메시지 수신 (통화 종료)');
            }
        },
        onTtsAudioError: () => {
            setIsTalking(false);
            aiSpeakingRef.current = false;
            setVadStatus(''); // 에러 시 상태 초기화
            
            // 통화 종료 중 오디오 에러 발생 시에도 이동
            if (isWaitingForEndTtsRef.current) {
                console.warn('⚠️ 통화 종료 TTS 오디오 에러 - 홈으로 이동');
                isWaitingForEndTtsRef.current = false;
                isCallStartedRef.current = false; // 상태 초기화
                
                if (!hasReceivedCallSummary()) {
                    console.log('⏳ 통화 요약 대기 중...');
                    setTimeout(() => {
                        navigate('/app/home');
                    }, 2000);
                } else {
                    navigate('/app/home');
                }
            }
        },
        onReadyStart: () => {
            // 녹음 준비 완료
        },
        onEndedStop: () => {
            // 백엔드에서 녹음 종료 확인 (프로그레스 바는 sendStopMessage에서 이미 표시됨)
            // 여기서는 추가 작업 없음
        },
        onTtsStart: (text) => {
            // tts_start 메시지는 TTS 오디오 재생 전에 오지만,
            // 첫 TTS인 경우 오디오가 실제로 재생될 때까지 "통화 거는 중..."을 유지해야 함
            // TTS 시작 메시지를 받았지만 아직 오디오가 재생되지 않았으므로 프로그레스 바는 유지
            if (isFirstTtsRef.current) {
                // 첫 TTS인 경우 pendingTranscriptionRef에 저장 (onTtsAudioStart에서 표시)
                console.log('📝 첫 TTS 텍스트 수신 (오디오 재생 전) - "통화 거는 중..." 유지');
                pendingTranscriptionRef.current = { assistantText: text, userText: null };
                // 자막은 업데이트하지 않음 ("통화 거는 중..." 유지)
            } else {
                // 첫 TTS가 아닌 경우 즉시 자막 업데이트
                setAiSubtitle(text);
            }
            // 프로그레스 바는 onTtsAudioStart에서 숨김 (오디오 실제 재생 시작 시)
        },
        onTranscription: ({ userText, assistantText }) => {
            // transcription은 TTS 생성 전에 보내지므로, TTS 재생 중이면 나중에 업데이트
            // 캐릭터별 "생각 중" 프로그레스 바는 TTS 재생 시작 전까지 유지 (onTtsAudioStart에서 숨김)
            if (aiSpeakingRef.current) {
                // TTS 재생 중이면 대기
                pendingTranscriptionRef.current = { userText, assistantText };
            } else {
                // TTS 재생 중이 아니면 즉시 자막 업데이트
                setAiSubtitle(assistantText || '');
            }
            // 사용자 말한 내용은 디버깅용으로 하단에 표시
            if (userText) {
                setUserSubtitle(`👤 ${userName}: ${userText}`);
            }
        },
        onSttStatus: (message) => {
            // STT 상태는 사용자 말한 내용으로 표시 (디버깅용)
            if (message && !message.includes('음성 인식 중') && !message.includes('너무 짧')) {
                setUserSubtitle(`👤 ${userName}: ${message}`);
            }
        },
        onStatus: (message) => {
            // 상태 메시지는 첫 TTS 오디오 재생 전까지만 표시
            // 첫 TTS 오디오가 재생되면 더 이상 상태 메시지를 표시하지 않음
            if (isFirstTtsRef.current) {
                // 첫 TTS 전까지만 "통화 거는 중..." 표시
                if (message === '통화 거는 중...' || message === '통화가 시작되었습니다.') {
                    if (aiSubtitle === '통화 연결 중...' || aiSubtitle === '통화 거는 중...' || !aiSubtitle) {
                        setAiSubtitle(message);
                    }
                }
            }
            // 첫 TTS 이후에는 상태 메시지를 표시하지 않음 (TTS 자막이 우선)
        },
        onError: (message) => {
            setAiSubtitle(message || '오류가 발생했습니다');
        },
        onAutoDisconnect: () => {
            console.log('⚠️ 30초 침묵으로 인한 자동 종료 - 즉시 홈으로 이동');
            // 강제 종료이므로 즉시 홈으로 리다이렉션
            stopMicrophone(); // 마이크 중지
            isCallStartedRef.current = false;
            isInitializingRef.current = false;
            initCallPromiseRef.current = null;
            startCallExecutedRef.current = false; // startCall 실행 플래그 리셋
            // 즉시 리다이렉션 (call_summary는 백그라운드에서 처리)
            navigate('/app/home');
        },
        onAutoDisconnectComplete: () => {
            // 이미 onAutoDisconnect에서 리다이렉션했으므로 여기서는 처리하지 않음
            console.log('✅ 강제 종료 처리 완료');
        },
        onClose: () => {
            console.log('🔌 WebSocket 연결 종료 감지 - 즉시 홈으로 이동');
            // WebSocket 연결이 끊겼을 때 즉시 홈으로 이동
            stopMicrophone(); // 마이크 중지
            // 상태 초기화
            isCallStartedRef.current = false;
            isInitializingRef.current = false;
            initCallPromiseRef.current = null;
            startCallExecutedRef.current = false; // startCall 실행 플래그 리셋
            // 즉시 리다이렉션
            navigate('/app/home');
        },
        onSocketError: (error) => {
            console.error('❌ WebSocket 오류 발생 - 즉시 홈으로 이동:', error);
            // WebSocket 오류 발생 시 즉시 홈으로 이동
            stopMicrophone(); // 마이크 중지
            // 상태 초기화
            isCallStartedRef.current = false;
            isInitializingRef.current = false;
            initCallPromiseRef.current = null;
            startCallExecutedRef.current = false; // startCall 실행 플래그 리셋
            // 즉시 리다이렉션
            navigate('/app/home');
        },
        onMessage: (msg) => {
            setAiMessages((prev) => [...prev, msg]);
        },
    });

    // WebSocket 핸들러는 initCall에서 통화 시작 후 직접 호출됨

    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking) {
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isTalking]);

    const handleEndCall = () => {
        console.log('📞 통화 종료 요청 (정상 종료)');
        setNormalFinish(true); // 사용자가 직접 종료 버튼을 누른 경우 정상 종료
        
        // 통화 종료 상태 설정
        setIsCallEnded(true);
        
        // 모든 오디오 중지 및 통화 종료 플래그 설정 (현재 재생 중인 TTS 모두 중지)
        startEndingCall(); // 이 함수에서 stopAllAudios() 호출됨
        
        stopMicrophone();
        endCall();
        setIsTalking(false);
        
        // 통화 종료 시 모든 플래그 리셋 (다음 통화 시작을 위해)
        isCallStartedRef.current = false;
        isInitializingRef.current = false;
        initCallPromiseRef.current = null;
        startCallExecutedRef.current = false; // startCall 실행 플래그 리셋
        
        // 통화 종료 TTS 대기 플래그 설정 (마지막 TTS 재생 후 리다이렉션)
        isWaitingForEndTtsRef.current = true;
        console.log('⏳ 통화 종료 TTS 재생 대기 중... (현재 재생 중인 TTS 모두 중지됨)');
        
        // 최대 대기 시간 설정 (10초 후 강제 이동 - 안전장치)
        setTimeout(() => {
            if (isWaitingForEndTtsRef.current) {
                console.warn('⚠️ 통화 종료 TTS 대기 시간 초과 - 강제 이동');
                isWaitingForEndTtsRef.current = false;
                isCallStartedRef.current = false; // 상태 초기화
                
                if (!hasReceivedCallSummary()) {
                    console.log('⏳ 통화 요약 대기 중...');
                    setTimeout(() => {
                        navigate('/app/home');
                    }, 2000);
                } else {
                    navigate('/app/home');
                }
            }
        }, 10000); // 10초 타임아웃
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3}>
            <Box p={{ base: 5, md: 14 }} w="full" maxW="530px">
                <VStack spacing={6} align="stretch">
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        w="100%"
                        h="450px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                        borderRadius="10px"
                    >
                        <Box
                            as="video"
                            ref={videoRef}
                            src={character.characterType === 'dabok' ? DabokVideo : DajeongVideo}
                            loop
                            muted
                            playsInline
                            w="100%"
                            h="90%"
                            objectFit="cover"
                        />
                    </MotionBox>

                    {/* 음성 감지 상태 표시 (음성 인식 중일 때만 표시) */}
                    {vadStatus && (
                        <Box textAlign="center">
                            {vadStatus.includes('AI 생각') || vadStatus.includes('가 생각 중이에요') ? (
                                <AIThinkingProgress isHighContrast={isHighContrast} characterName={character.name} />
                            ) : vadStatus.includes('이 말하는 중') || vadStatus.includes('가 말하는 중') ? (
                                <Text fontSize="2xl" fontWeight="bold" color={isHighContrast ? '#FFFFFF' : '#000000'}>
                                    <AnimatedSpeakingText userName={userName} />
                                </Text>
                            ) : (
                                // "말 안하는 중"은 표시하지 않음, 다른 상태만 표시
                                !vadStatus.includes('말 안하는 중') && (
                                    <Box
                                        bg={
                                            vadStatus.includes('다정이가 말하는 중')
                                                ? 'blue.500'
                                                : vadStatus.includes('전송')
                                                ? 'green.500'
                                                : 'gray.400'
                                        }
                                        color="white"
                                        px={6}
                                        py={4}
                                        borderRadius="15px"
                                        textAlign="center"
                                    >
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {vadStatus}
                                        </Text>
                                    </Box>
                                )
                            )}
                        </Box>
                    )}

                    {/* AI 자막 (메인) */}
                    <Box mt={2}>
                        <AnimatePresence mode="wait">
                            <MotionText
                                key={aiSubtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                fontSize={fs}
                                fontWeight="700"
                                color={isHighContrast ? '#FFFFFF' : '#000000'}
                                textAlign="center"
                                py={5}
                                borderRadius="15px"
                                minH="90px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                w="full"
                                whiteSpace="pre-line"
                            >
                                {aiSubtitle}
                            </MotionText>
                        </AnimatePresence>
                    </Box>

                    {/* 사용자 말한 내용 (디버깅용, 하단) */}
                    {userSubtitle && (
                        <Box
                            mt={2}
                            bg={isHighContrast ? '#333333' : '#f0f0f0'}
                            px={4}
                            py={3}
                            borderRadius="10px"
                            borderLeft="4px solid"
                            borderColor="gray.400"
                        >
                            <Text fontSize="sm" color={isHighContrast ? '#CCCCCC' : '#666666'}>
                                {userSubtitle}
                            </Text>
                        </Box>
                    )}

                    <Button
                        w="full"
                        bg={isHighContrast ? '#FFD700' : '#F44336'}
                        color={isHighContrast ? '#000000' : 'white'}
                        onClick={handleEndCall}
                        fontSize={fs}
                        fontWeight="700"
                        height={callBtnH}
                        borderRadius="15px"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        boxShadow="0 4px 14px rgba(244, 67, 54, 0.3)"
                        mt={2}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#D32F2F',
                            transform: 'translateY(-2px)',
                            boxShadow: isHighContrast
                                ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                : '0 6px 20px rgba(244, 67, 54, 0.4)',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#C62828',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                        isDisabled={isCallEnded}
                    >
                        {isCallEnded ? '종료됨' : '통화 종료'}
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}

