import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box, Image, Divider } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

import DajeongLogo from '../../assets/image.png';
import DabokVideo from '../../video/dabok.webm';
import DajeongVideo from '../../video/dajeung.webm';
import useAppSettings from '../../hooks/useAppSettings';

import { endCall, startCall } from '../../api/callAPI';
import { getAiSocket } from '../../api/aiSocket';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { fontSizeLevel, setFontSizeLevel, isHighContrast, toggleHighContrast, fs, callBtnH } = useAppSettings();

    const [isTalking, setIsTalking] = useState(false); // AI가 말하는 중
    const [isUserSpeaking, setIsUserSpeaking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('통화 연결 중...');
    const [aiMessages, setAiMessages] = useState([]);

    const videoRef = useRef(null); // video 태그 ref
    const audioStreamRef = useRef(null); // 오디오 스트림 ref
    const audioContextRef = useRef(null); // AudioContext ref
    const analyserRef = useRef(null); // AnalyserNode ref
    const processorRef = useRef(null); // ScriptProcessorNode ref
    const audioBufferRef = useRef([]); // 오디오 버퍼
    const silenceStartTimeRef = useRef(null); // 침묵 시작 시간
    const vadStateRef = useRef('idle'); // VAD 상태: idle, speaking, silence
    const aiSpeakingRef = useRef(false); // AI 말하는 중 (VAD 비활성화)
    const audioChunkCountRef = useRef(0); // 오디오 청크 카운터
    const rmsLogIntervalRef = useRef(0); // RMS 로깅 간격 카운터

    // VAD 설정
    const VAD_THRESHOLD = 0.005; // 음성 감지 임계값 (더 민감하게 조정)
    const SILENCE_DURATION = 1500; // 침묵 지속 시간 (ms) - 1.5초 침묵이면 전송
    const MIN_AUDIO_LENGTH = 10; // 최소 오디오 크기 (노이즈 필터링)

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    // 통화 시작 시 API 호출 및 마이크 시작
    useEffect(() => {
        let isInitialized = false;

        const initCall = async () => {
            if (location.state && !isInitialized) {
                isInitialized = true;
                const { character, politeness } = location.state;

                console.log('='.repeat(50));
                console.log('🎬 통화 초기화 시작');
                console.log('='.repeat(50));

                // 통화 시작 API 호출 (WebSocket 연결 포함)
                await startCall(character, politeness);

                // WebSocket 메시지 핸들러 등록
                setupWebSocketHandler();

                // 마이크 시작
                startMicrophone();

                console.log('='.repeat(50));
                console.log('✅ 통화 초기화 완료');
                console.log('='.repeat(50));
            }
        };

        initCall();

        // 컴포넌트 언마운트 시 정리
        return () => {
            stopMicrophone();
        };
    }, []); // 빈 배열로 변경 - 한 번만 실행

    // 마이크 시작 함수 (VAD 포함)
    const startMicrophone = async () => {
        try {
            console.log('🎤 마이크 권한 요청 중...');

            // 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // AudioContext 생성
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            // 오디오 소스 생성
            const source = audioContext.createMediaStreamSource(stream);

            // AnalyserNode 생성 (볼륨 분석용)
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            // ScriptProcessorNode 생성 (오디오 데이터 처리용)
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            // 오디오 처리
            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // 볼륨 계산 (RMS)
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);

                // RMS 값을 주기적으로 로깅 (50번에 한 번)
                rmsLogIntervalRef.current++;
                if (rmsLogIntervalRef.current % 50 === 0) {
                    console.log(`📊 RMS: ${rms.toFixed(6)} | 임계값: ${VAD_THRESHOLD} | AI 말하는 중: ${aiSpeakingRef.current} | VAD 상태: ${vadStateRef.current}`);
                }

                // AI가 말하는 중이면 VAD 비활성화
                if (aiSpeakingRef.current) {
                    // 침묵 시작 시간 초기화
                    if (silenceStartTimeRef.current !== null) {
                        console.log('🤖 AI 말하는 중 - VAD 비활성화');
                        silenceStartTimeRef.current = null;
                        vadStateRef.current = 'idle';
                        setIsUserSpeaking(false);
                    }
                    return;
                }

                const now = Date.now();

                // VAD 로직
                if (rms > VAD_THRESHOLD) {
                    // 음성 감지
                    if (vadStateRef.current === 'idle') {
                        console.log('='.repeat(50));
                        console.log('🎤 음성 감지 시작');
                        console.log('   RMS 값:', rms.toFixed(4));
                        console.log('   임계값:', VAD_THRESHOLD);
                        vadStateRef.current = 'speaking';
                        setIsUserSpeaking(true);
                        audioBufferRef.current = []; // 버퍼 초기화
                        audioChunkCountRef.current = 0;
                    }

                    // 침묵 시작 시간 초기화 (음성이 다시 감지됨)
                    if (silenceStartTimeRef.current !== null) {
                        silenceStartTimeRef.current = null;
                        if (vadStateRef.current === 'silence') {
                            console.log('🎤 침묵 중단 - 다시 말하기 시작');
                            vadStateRef.current = 'speaking';
                        }
                    }

                    // 오디오 데이터를 버퍼에 저장
                    const int16Data = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }
                    audioBufferRef.current.push(int16Data);
                    audioChunkCountRef.current++;

                    // 첫 번째 청크 또는 50번째마다 로그
                    if (audioChunkCountRef.current === 1 || audioChunkCountRef.current % 50 === 0) {
                        console.log(`🔊 오디오 청크 수집: ${int16Data.length} samples (청크 #${audioChunkCountRef.current})`);
                    }
                } else {
                    // 침묵 감지
                    if (vadStateRef.current === 'speaking') {
                        // 침묵 시작 시간 기록
                        if (silenceStartTimeRef.current === null) {
                            silenceStartTimeRef.current = now;
                            vadStateRef.current = 'silence';
                            console.log('🔇 침묵 감지 시작');
                            console.log('   RMS 값:', rms.toFixed(4));
                            console.log('   대기 시간:', SILENCE_DURATION, 'ms');
                        }
                    }

                    // 침묵이 지속되는지 확인
                    if (vadStateRef.current === 'silence' && silenceStartTimeRef.current !== null) {
                        const silenceDuration = now - silenceStartTimeRef.current;

                        // 침묵 지속 시간 체크 (100ms마다 로그)
                        if (silenceDuration % 500 < 100) {
                            console.log(`⏱️ 침묵 지속: ${silenceDuration}ms / ${SILENCE_DURATION}ms`);
                        }

                        if (silenceDuration >= SILENCE_DURATION) {
                            console.log('='.repeat(50));
                            console.log('📤 침묵 지속 시간 초과 - 오디오 전송');
                            console.log('   침묵 지속:', silenceDuration, 'ms');
                            console.log('   수집된 청크:', audioChunkCountRef.current);
                            sendAudioBuffer();

                            // 상태 초기화
                            vadStateRef.current = 'idle';
                            setIsUserSpeaking(false);
                            audioBufferRef.current = [];
                            audioChunkCountRef.current = 0;
                            silenceStartTimeRef.current = null;
                        }
                    }
                }
            };

            // 연결
            source.connect(analyser);
            analyser.connect(processor);
            processor.connect(audioContext.destination);

            console.log('='.repeat(50));
            console.log('✅ 마이크 시작 완료 (VAD 활성화)');
            console.log('   임계값:', VAD_THRESHOLD);
            console.log('   침묵 지속 시간:', SILENCE_DURATION, 'ms');
            console.log('='.repeat(50));
        } catch (error) {
            console.error('❌ 마이크 권한 요청 실패:', error);
            alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
        }
    };

    // 오디오 버퍼 전송
    const sendAudioBuffer = () => {
        if (audioBufferRef.current.length === 0) {
            console.log('⚠️ 전송할 오디오 없음 (버퍼 비어있음)');
            return;
        }

        const socket = getAiSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket 연결 안 됨');
            console.error('   상태:', socket ? socket.readyState : 'null');
            return;
        }

        try {
            // 버퍼를 하나의 ArrayBuffer로 합치기
            const totalLength = audioBufferRef.current.reduce((acc, arr) => acc + arr.length, 0);
            const mergedBuffer = new Int16Array(totalLength);
            let offset = 0;
            for (const buffer of audioBufferRef.current) {
                mergedBuffer.set(buffer, offset);
                offset += buffer.length;
            }

            // 너무 작은 데이터는 무시 (노이즈)
            if (mergedBuffer.length < MIN_AUDIO_LENGTH) {
                console.log('⚠️ 오디오 크기가 너무 작음 (노이즈로 판단):', mergedBuffer.length, 'samples');
                return;
            }

            // Blob으로 변환하여 전송
            const blob = new Blob([mergedBuffer.buffer], { type: 'audio/webm' });

            console.log('='.repeat(50));
            console.log('📤 AI 서버로 오디오 전송');
            console.log('   크기:', blob.size, 'bytes');
            console.log('   샘플 수:', mergedBuffer.length);
            console.log('   청크 수:', audioBufferRef.current.length);

            socket.send(blob);

            console.log('✅ 오디오 전송 완료');
            console.log('='.repeat(50));
        } catch (error) {
            console.error('❌ 오디오 전송 실패:', error);
        }
    };

    // 마이크 중지 함수
    const stopMicrophone = () => {
        console.log('='.repeat(50));
        console.log('🎤 마이크 중지 시작...');

        // 침묵 시작 시간 초기화
        silenceStartTimeRef.current = null;

        // ScriptProcessor 정리
        if (processorRef.current) {
            try {
                processorRef.current.disconnect();
                processorRef.current.onaudioprocess = null;
                processorRef.current = null;
                console.log('   ✓ ScriptProcessor 정리');
            } catch (e) {
                console.warn('   ⚠️ ScriptProcessor 정리 중 오류:', e);
            }
        }

        // Analyser 정리
        if (analyserRef.current) {
            try {
                analyserRef.current.disconnect();
                analyserRef.current = null;
                console.log('   ✓ Analyser 정리');
            } catch (e) {
                console.warn('   ⚠️ Analyser 정리 중 오류:', e);
            }
        }

        // AudioContext 정리
        if (audioContextRef.current) {
            try {
                audioContextRef.current.close();
                audioContextRef.current = null;
                console.log('   ✓ AudioContext 정리');
            } catch (e) {
                console.warn('   ⚠️ AudioContext 정리 중 오류:', e);
            }
        }

        // 오디오 스트림 정리
        if (audioStreamRef.current) {
            try {
                audioStreamRef.current.getTracks().forEach((track) => track.stop());
                audioStreamRef.current = null;
                console.log('   ✓ 오디오 스트림 정리');
            } catch (e) {
                console.warn('   ⚠️ 오디오 스트림 정리 중 오류:', e);
            }
        }

        // 상태 초기화
        vadStateRef.current = 'idle';
        audioBufferRef.current = [];
        audioChunkCountRef.current = 0;
        rmsLogIntervalRef.current = 0;
        setIsUserSpeaking(false);

        console.log('✅ 마이크 중지 완료');
        console.log('='.repeat(50));
    };

    // isTalking 상태에 따라 video 재생/정지
    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking) {
            // AI가 말할 때: 재생
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            // AI 말 안할 때: 정지
            videoRef.current.pause();
        }
    }, [isTalking]);

    // WebSocket 메시지 핸들러 설정
    const setupWebSocketHandler = () => {
        const socket = getAiSocket();
        if (!socket) {
            console.error('❌ WebSocket이 없습니다. 핸들러 등록 실패');
            return;
        }

        console.log('='.repeat(50));
        console.log('📡 WebSocket 메시지 핸들러 등록');
        console.log('   WebSocket 상태:', socket.readyState, '(1=OPEN)');
        console.log('='.repeat(50));

        socket.onmessage = async (event) => {
            const data = event.data;
            console.log('📨 WebSocket 메시지 수신 (타입:', typeof data, ')');

            // 오디오 Blob 메시지 처리
            if (data instanceof Blob) {
                console.log('='.repeat(50));
                console.log('📥 AI 오디오 Blob 수신');
                console.log('   크기:', data.size, 'bytes');

                // 너무 작은 데이터는 무시
                if (data.size < MIN_AUDIO_LENGTH) {
                    console.log('⚠️ 오디오 크기가 너무 작음 (무시)');
                    return;
                }

                // 오디오 재생
                const audioUrl = URL.createObjectURL(data);
                const audio = new Audio(audioUrl);

                // AI가 말하기 시작
                setIsTalking(true);
                aiSpeakingRef.current = true; // VAD 비활성화
                console.log('🔊 AI 말하기 시작 (VAD 비활성화)');

                audio.onloadedmetadata = () => {
                    console.log('🎵 오디오 메타데이터 로드 완료');
                    console.log('   재생 시간:', audio.duration, '초');
                };

                audio.onplay = () => {
                    console.log('▶️ 오디오 재생 시작됨');
                };

                audio.onplaying = () => {
                    console.log('▶️ 오디오 재생 중...');
                };

                audio.onpause = () => {
                    console.log('⏸️ 오디오 일시정지');
                };

                audio.onended = () => {
                    // AI가 말하기 종료
                    setIsTalking(false);
                    aiSpeakingRef.current = false; // VAD 재활성화
                    URL.revokeObjectURL(audioUrl);
                    console.log('✅ AI 말하기 종료 (VAD 재활성화)');
                    console.log('='.repeat(50));
                };

                audio.onerror = (error) => {
                    console.error('❌ 오디오 재생 실패:', error);
                    console.error('   에러 코드:', audio.error?.code);
                    console.error('   에러 메시지:', audio.error?.message);
                    setIsTalking(false);
                    aiSpeakingRef.current = false;
                    URL.revokeObjectURL(audioUrl);
                };

                try {
                    const playPromise = audio.play();
                    console.log('🔊 audio.play() 호출됨');
                    await playPromise;
                    console.log('✅ audio.play() Promise 완료');
                } catch (error) {
                    console.error('❌ audio.play() 실패:', error);
                    console.error('   에러 이름:', error.name);
                    console.error('   에러 메시지:', error.message);
                    setIsTalking(false);
                    aiSpeakingRef.current = false;
                }

                return;
            }

            // JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                const msgType = msg.type || 'unknown';
                console.log('📩 AI JSON 메시지 수신:', msgType, msg);

                setAiMessages((prev) => [...prev, msg]);

                // 자막 업데이트
                if (msg.message || msg.text) {
                    setCurrentSubtitle(msg.message || msg.text);
                    console.log('   자막 업데이트:', msg.message || msg.text);
                }
            } catch (err) {
                console.warn('⚠️ JSON 파싱 실패:', data);
            }
        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket 에러:', error);
        };

        socket.onclose = (event) => {
            console.log('🔌 WebSocket 연결 종료');
            console.log('   코드:', event.code);
            console.log('   이유:', event.reason);
        };
    };

    const handleEndCall = () => {
        console.log('📞 통화 종료 요청');

        // 마이크 중지
        stopMicrophone();

        // 통화 종료 API 호출
        endCall();
        setIsTalking(false);

        console.log('✅ 통화 종료 완료');
        navigate('/app/home');
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3}>
            {/* 메인 로그인 카드 */}
            <Box p={{ base: 5, md: 14 }} w="full" maxW="530px">
                <VStack spacing={6} align="stretch">
                    {/* 캐릭터 영역 */}
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
                        borderRadius="15px"
                    >
                        {/* video 태그로 webm 재생 제어 */}
                        <Box
                            as="video"
                            ref={videoRef}
                            src={character.characterType === 'dabok' ? DabokVideo : DajeongVideo}
                            loop
                            muted
                            playsInline
                            w="100%"
                            h="70%"
                            objectFit="cover"
                            onError={(e) => {
                                console.error('Video 로드 실패:', e.target.src);
                            }}
                        />
                    </MotionBox>

                    {/* 현재 자막 */}
                    <Box mt={2}>
                        <AnimatePresence mode="wait">
                            <MotionText
                                key={currentSubtitle}
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
                            >
                                {currentSubtitle}
                                {isUserSpeaking && ' 🎤'}
                            </MotionText>
                        </AnimatePresence>
                    </Box>

                    {/* 통화 종료 버튼 */}
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
                    >
                        통화 종료
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}
