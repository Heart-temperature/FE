import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

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

    const [isTalking, setIsTalking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [currentSubtitle, setCurrentSubtitle] = useState('통화 연결 중...');
    const [aiMessages, setAiMessages] = useState([]);
    const [debugRms, setDebugRms] = useState(0);
    const [vadStatus, setVadStatus] = useState('대기 중');

    const videoRef = useRef(null);
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
    const isCallStartedRef = useRef(false);
    const isRecordingRef = useRef(false);
    const recordingStartTimeRef = useRef(null);

    // VAD 설정
    const VAD_THRESHOLD = 0.0001; // 0.00005 → 0.0001 (중간값)
    const SILENCE_DURATION = 1500; // 1000ms → 1500ms (1.5초)
    const MIN_RECORDING_TIME = 500; // 300ms → 500ms (0.5초)
    const MIN_AUDIO_CHUNKS = 3; // 1 → 3 (최소 3개 청크)

    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    useEffect(() => {
        const initCall = async () => {
            if (isCallStartedRef.current) {
                console.log('⚠️ 통화가 이미 시작되었습니다. 중복 호출 방지');
                return;
            }

            if (location.state) {
                isCallStartedRef.current = true;
                const { character, politeness } = location.state;

                console.log('='.repeat(50));
                console.log('🎬 통화 초기화 시작');
                console.log('='.repeat(50));

                await startCall(character, politeness);
                setupWebSocketHandler();
                startMicrophone();

                console.log('✅ 통화 초기화 완료');
                console.log('='.repeat(50));
            }
        };

        initCall();

        return () => {
            console.log('🧹 CallPage cleanup 시작');
            stopMicrophone();
        };
    }, []);

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
            gainNode.gain.value = 2.0; // 3.0 → 2.0 (조금 낮춤)
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

                // UI에 RMS 표시
                setDebugRms(rms);

                // 로깅 (10번마다 - 더 자주)
                rmsLogIntervalRef.current++;
                if (rmsLogIntervalRef.current % 10 === 0) {
                    console.log(
                        `📊 RMS: ${rms.toFixed(7)} | 임계값: ${VAD_THRESHOLD} | AI: ${aiSpeakingRef.current} | VAD: ${
                            vadStateRef.current
                        } | 녹음: ${isRecordingRef.current} | 청크: ${audioChunkCountRef.current}`
                    );
                }

                // AI가 말하는 중이면 VAD 비활성화
                if (aiSpeakingRef.current) {
                    if (vadStateRef.current !== 'idle') {
                        console.log('🤖 AI 말하는 중 - VAD 비활성화');
                        vadStateRef.current = 'idle';
                        silenceStartTimeRef.current = null;
                        setIsUserSpeaking(false);
                        setVadStatus('AI 말하는 중');

                        if (isRecordingRef.current) {
                            console.log('🛑 AI 말하는 중 - 녹음 강제 종료');
                            sendStopMessage();
                            audioBufferRef.current = [];
                            audioChunkCountRef.current = 0;
                            recordingStartTimeRef.current = null;
                        }
                    }
                    return;
                }

                const now = Date.now();

                if (rms > VAD_THRESHOLD) {
                    // 음성 감지
                    if (vadStateRef.current === 'idle') {
                        console.log('='.repeat(50));
                        console.log('🎤 음성 감지 시작!');
                        console.log('   RMS 값:', rms.toFixed(7));
                        console.log('   임계값:', VAD_THRESHOLD);
                        console.log('='.repeat(50));

                        sendStartMessage();

                        vadStateRef.current = 'speaking';
                        setIsUserSpeaking(true);
                        setVadStatus('🎤 녹음 중...');
                        audioBufferRef.current = [];
                        audioChunkCountRef.current = 0;
                        recordingStartTimeRef.current = now;
                    }

                    // 침묵에서 다시 음성 감지
                    if (silenceStartTimeRef.current !== null) {
                        const wasSilent = vadStateRef.current === 'silence';
                        const interruptedSilenceDuration = now - silenceStartTimeRef.current;
                        silenceStartTimeRef.current = null;

                        if (wasSilent) {
                            console.log(`🎤 침묵 중단 (${interruptedSilenceDuration}ms 만에) - 계속 녹음`);
                            vadStateRef.current = 'speaking';
                            setVadStatus('🎤 녹음 중...');
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

                    // ✅ 실시간 전송 (HTML 예제처럼)
                    if (isRecordingRef.current) {
                        const socket = getAiSocket();
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(int16Data.buffer);
                        }
                    }

                    // 로컬 버퍼에도 저장 (디버깅/로그용)
                    audioBufferRef.current.push(int16Data);
                    audioChunkCountRef.current++;

                    if (audioChunkCountRef.current === 1 || audioChunkCountRef.current % 10 === 0) {
                        console.log(`🔊 청크 실시간 전송 중: ${audioChunkCountRef.current}개`);
                    }
                } else {
                    // 침묵 감지
                    if (vadStateRef.current === 'speaking') {
                        if (silenceStartTimeRef.current === null) {
                            silenceStartTimeRef.current = now;
                            vadStateRef.current = 'silence';
                            console.log('='.repeat(50));
                            console.log('🔇 침묵 감지 - 대기 시작');
                            console.log('   현재 녹음 상태:', isRecordingRef.current);
                            console.log('   현재 청크 수:', audioChunkCountRef.current);
                            console.log('   녹음 시작 시간:', recordingStartTimeRef.current);
                            console.log('='.repeat(50));
                            setVadStatus('⏸️ 침묵 감지 중...');
                        }
                    }

                    // 침묵 지속 시간 체크
                    if (vadStateRef.current === 'silence' && silenceStartTimeRef.current !== null) {
                        const silenceDuration = now - silenceStartTimeRef.current;

                        // 100ms마다 로그 (더 자주)
                        if (Math.floor(silenceDuration / 100) !== Math.floor((silenceDuration - 50) / 100)) {
                            console.log(
                                `⏱️ 침묵 ${silenceDuration}ms / ${SILENCE_DURATION}ms (청크: ${audioChunkCountRef.current}, 녹음중: ${isRecordingRef.current})`
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
                            console.log('   녹음 상태:', isRecordingRef.current);
                            console.log('   최소 조건: 녹음', MIN_RECORDING_TIME, 'ms, 청크', MIN_AUDIO_CHUNKS, '개');
                            console.log('   조건 체크:');
                            console.log(
                                '     - isRecording:',
                                isRecordingRef.current,
                                isRecordingRef.current ? '✅' : '❌'
                            );
                            console.log(
                                '     - recordingDuration >= MIN:',
                                recordingDuration >= MIN_RECORDING_TIME,
                                recordingDuration >= MIN_RECORDING_TIME ? '✅' : '❌'
                            );
                            console.log(
                                '     - chunkCount >= MIN:',
                                audioChunkCountRef.current >= MIN_AUDIO_CHUNKS,
                                audioChunkCountRef.current >= MIN_AUDIO_CHUNKS ? '✅' : '❌'
                            );
                            console.log('='.repeat(50));

                            // 최소 녹음 시간 및 청크 수 체크
                            if (
                                isRecordingRef.current &&
                                recordingDuration >= MIN_RECORDING_TIME &&
                                audioChunkCountRef.current >= MIN_AUDIO_CHUNKS
                            ) {
                                console.log('✅ 모든 조건 만족 - 녹음 종료, 서버로 전송');
                                sendStopMessage();
                                setVadStatus('📤 전송 중...');
                            } else {
                                console.log('⚠️ 조건 미충족 - 녹음이 너무 짧거나 데이터 없음');
                                isRecordingRef.current = false;
                                setVadStatus('⚠️ 너무 짧음 (다시 말씀해주세요)');

                                // 2초 후 상태 복구
                                setTimeout(() => {
                                    if (vadStateRef.current === 'idle') {
                                        setVadStatus('대기 중');
                                    }
                                }, 2000);
                            }

                            vadStateRef.current = 'idle';
                            setIsUserSpeaking(false);
                            audioBufferRef.current = [];
                            audioChunkCountRef.current = 0;
                            silenceStartTimeRef.current = null;
                            recordingStartTimeRef.current = null;
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
            console.log('   샘플레이트:', audioContext.sampleRate, 'Hz');
            console.log('   VAD 임계값:', VAD_THRESHOLD, '(높음 - 명확한 음성만)');
            console.log('   침묵 시간:', SILENCE_DURATION, 'ms (짧음 - 빠른 응답)');
            console.log('   최소 녹음 시간:', MIN_RECORDING_TIME, 'ms');
            console.log('   최소 청크 수:', MIN_AUDIO_CHUNKS);
            console.log('   마이크 게인:', gainNode.gain.value, 'x');
            console.log('   전송 방식: 실시간 스트리밍 (청크마다 즉시 전송)');
            console.log('='.repeat(50));

            setVadStatus('대기 중');
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
            console.log('   녹음 상태를 true로 변경');
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
            console.log('   총 전송된 청크 수:', audioBufferRef.current.length);
            console.log(
                '   총 샘플 수:',
                audioBufferRef.current.reduce((sum, chunk) => sum + chunk.length, 0)
            );

            // stop 메시지만 전송 (오디오는 이미 실시간으로 전송됨)
            const stopMsg = {
                type: 'stop',
            };
            socket.send(JSON.stringify(stopMsg));
            console.log('   ✅ stop JSON 전송 완료');

            isRecordingRef.current = false;
            console.log('   녹음 상태를 false로 변경');
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
        setVadStatus('종료됨');

        console.log('✅ 마이크 중지 완료');
        console.log('='.repeat(50));
    };

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

    const setupWebSocketHandler = () => {
        const socket = getAiSocket();
        if (!socket) {
            console.error('❌ WebSocket이 없습니다. 핸들러 등록 실패');
            return;
        }

        console.log('='.repeat(50));
        console.log('📡 WebSocket 메시지 핸들러 등록');
        console.log('='.repeat(50));

        socket.onmessage = async (event) => {
            const data = event.data;

            if (data instanceof Blob) {
                console.log('='.repeat(50));
                console.log('📥 AI 오디오 Blob 수신');
                console.log('   크기:', data.size, 'bytes');

                if (data.size < 100) {
                    console.log('⚠️ 오디오 크기가 너무 작음');
                    return;
                }

                const audioUrl = URL.createObjectURL(data);
                const audio = new Audio(audioUrl);

                setIsTalking(true);
                aiSpeakingRef.current = true;
                setVadStatus('🤖 AI 말하는 중');
                console.log('🔊 AI 말하기 시작');

                audio.onended = () => {
                    setIsTalking(false);
                    aiSpeakingRef.current = false;
                    setVadStatus('대기 중');
                    URL.revokeObjectURL(audioUrl);
                    console.log('✅ AI 말하기 종료');
                    console.log('='.repeat(50));
                };

                audio.onerror = (error) => {
                    console.error('❌ 오디오 재생 실패:', error);
                    setIsTalking(false);
                    aiSpeakingRef.current = false;
                    setVadStatus('대기 중');
                    URL.revokeObjectURL(audioUrl);
                };

                try {
                    await audio.play();
                    console.log('✅ 오디오 재생 시작');
                } catch (error) {
                    console.error('❌ audio.play() 실패:', error);
                    setIsTalking(false);
                    aiSpeakingRef.current = false;
                    setVadStatus('대기 중');
                }

                return;
            }

            try {
                const msg = JSON.parse(data);
                const msgType = msg.type || 'unknown';
                console.log('📩 AI JSON 메시지 수신:', msgType, msg);

                setAiMessages((prev) => [...prev, msg]);

                if (msg.type === 'ready' && msg.event === 'start') {
                    console.log('✅ 백엔드 녹음 준비 완료');
                } else if (msg.type === 'ended' && msg.event === 'stop') {
                    console.log('✅ 백엔드 녹음 종료 - AI 응답 대기');
                    setVadStatus('🤖 AI 생각 중...');
                } else if (msg.type === 'tts_start' && msg.text) {
                    setCurrentSubtitle(msg.text);
                    console.log('   자막:', msg.text);
                } else if (msg.type === 'tts_end') {
                    console.log('   TTS 종료');
                } else if (msg.type === 'stt_status') {
                    if (msg.message) {
                        setCurrentSubtitle(msg.message);
                        console.log('   STT:', msg.message);
                    }
                } else if (msg.type === 'status') {
                    if (msg.message) {
                        setCurrentSubtitle(msg.message);
                        console.log('   상태:', msg.message);
                    }
                } else if (msg.type === 'error') {
                    console.error('❌ 서버 에러:', msg.message);
                    setCurrentSubtitle(msg.message || '오류가 발생했습니다');
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
        };
    };

    const handleEndCall = () => {
        console.log('📞 통화 종료 요청');
        stopMicrophone();
        endCall();
        setIsTalking(false);
        console.log('✅ 통화 종료 완료');
        navigate('/app/home');
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
                        borderRadius="15px"
                    >
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
                        />
                    </MotionBox>

                    {/* 음성 감지 상태 표시 */}
                    <Box
                        bg={
                            vadStatus.includes('녹음')
                                ? 'red.500'
                                : vadStatus.includes('침묵')
                                ? 'orange.400'
                                : vadStatus.includes('AI')
                                ? 'blue.500'
                                : vadStatus.includes('전송')
                                ? 'green.500'
                                : vadStatus.includes('오류') || vadStatus.includes('짧음')
                                ? 'red.600'
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
                        <Text fontSize="sm" mt={1}>
                            RMS: {debugRms.toFixed(7)} | 임계값: {VAD_THRESHOLD}
                        </Text>
                    </Box>

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
                            </MotionText>
                        </AnimatePresence>
                    </Box>

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
