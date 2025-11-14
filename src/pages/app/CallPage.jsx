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

// 상태 정의
const STATES = {
    IDLE: 'idle', // 대기 중
    RECORDING: 'recording', // 🎤 녹음 중...
    SILENCE_DETECTING: 'silence_detecting', // ⏸️ 침묵 감지 중...
    SENDING: 'sending', // 📤 전송 중...
    AI_THINKING: 'ai_thinking', // 🤖 AI 생각 중...
    AI_SPEAKING: 'ai_speaking', // 🤖 AI 말하는 중
};

// 상태별 표시 텍스트
const STATE_LABELS = {
    [STATES.IDLE]: '대기 중',
    [STATES.RECORDING]: '🎤 녹음 중...',
    [STATES.SILENCE_DETECTING]: '⏸️ 침묵 감지 중...',
    [STATES.SENDING]: '📤 전송 중...',
    [STATES.AI_THINKING]: '🤖 AI 생각 중...',
    [STATES.AI_SPEAKING]: '🤖 AI 말하는 중',
};

// 음성 감지 설정
const VOICE_CONFIG = {
    VOICE_THRESHOLD: 0.01, // 음성으로 인식할 최소 볼륨
    SILENCE_THRESHOLD: 0.005, // 침묵으로 인식할 최대 볼륨
    SILENCE_DURATION: 1000, // 침묵 지속 시간 (ms)
    SAMPLE_RATE: 16000, // 샘플링 레이트
};

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { fontSizeLevel, setFontSizeLevel, isHighContrast, toggleHighContrast, fs, callBtnH } = useAppSettings();

    // 상태 관리
    const [state, setState] = useState(STATES.IDLE);
    const [currentSubtitle, setCurrentSubtitle] = useState('안녕하세요! 무엇을 도와드릴까요?');

    // Refs
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const silenceTimerRef = useRef(null);
    const audioElementRef = useRef(null);

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    useEffect(() => {
        if (location.state) {
            const { character, politeness } = location.state;
            // 통화 시작 API 호출
            startCall(character, politeness);
        }
    }, [location.state]);

    // 비디오 재생 제어
    useEffect(() => {
        if (!videoRef.current) return;

        if (state === STATES.AI_SPEAKING) {
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            videoRef.current.pause();
        }
    }, [state]);

    // 마이크 초기화 및 음성 감지 시작
    useEffect(() => {
        let animationFrameId;

        const initMicrophone = async () => {
            try {
                // 마이크 접근
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: VOICE_CONFIG.SAMPLE_RATE,
                    },
                });
                mediaStreamRef.current = stream;

                // AudioContext 생성
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: VOICE_CONFIG.SAMPLE_RATE,
                });
                const audioContext = audioContextRef.current;

                // Analyser 생성 (음성 레벨 감지)
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                // MediaRecorder 생성
                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus',
                });

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    sendAudioToServer();
                };

                // 음성 레벨 감지 루프
                const detectVoice = () => {
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    analyser.getByteTimeDomainData(dataArray);

                    // 음성 레벨 계산 (RMS)
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        const normalized = (dataArray[i] - 128) / 128;
                        sum += normalized * normalized;
                    }
                    const rms = Math.sqrt(sum / bufferLength);

                    // 상태별 처리
                    if (state === STATES.IDLE) {
                        // 대기 중: 음성 감지 시 녹음 시작
                        if (rms > VOICE_CONFIG.VOICE_THRESHOLD) {
                            startRecording();
                        }
                    } else if (state === STATES.RECORDING) {
                        // 녹음 중: 침묵 감지
                        if (rms < VOICE_CONFIG.SILENCE_THRESHOLD) {
                            startSilenceDetection();
                        } else {
                            // 음성이 다시 감지되면 침묵 타이머 취소
                            if (silenceTimerRef.current) {
                                clearTimeout(silenceTimerRef.current);
                                silenceTimerRef.current = null;
                                setState(STATES.RECORDING);
                            }
                        }
                    } else if (state === STATES.SILENCE_DETECTING) {
                        // 침묵 감지 중: 음성이 다시 감지되면 녹음으로 복귀
                        if (rms > VOICE_CONFIG.VOICE_THRESHOLD) {
                            if (silenceTimerRef.current) {
                                clearTimeout(silenceTimerRef.current);
                                silenceTimerRef.current = null;
                            }
                            setState(STATES.RECORDING);
                        }
                    }

                    animationFrameId = requestAnimationFrame(detectVoice);
                };

                detectVoice();
            } catch (error) {
                console.error('마이크 접근 실패:', error);
                setCurrentSubtitle('마이크 접근 권한이 필요합니다.');
            }
        };

        initMicrophone();

        return () => {
            // Cleanup
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, [state]);

    // 녹음 시작
    const startRecording = () => {
        console.log('🎤 녹음 시작');
        setState(STATES.RECORDING);
        setCurrentSubtitle('듣고 있습니다...');

        audioChunksRef.current = [];
        mediaRecorderRef.current.start();

        // "start" 메시지 전송
        const socket = getAiSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'start' }));
        }
    };

    // 침묵 감지 시작
    const startSilenceDetection = () => {
        if (state !== STATES.RECORDING) return;
        if (silenceTimerRef.current) return;

        setState(STATES.SILENCE_DETECTING);

        silenceTimerRef.current = setTimeout(() => {
            console.log('⏸️ 침묵 지속 -> 녹음 종료');
            stopRecording();
        }, VOICE_CONFIG.SILENCE_DURATION);
    };

    // 녹음 종료 및 전송
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            setState(STATES.SENDING);
            setCurrentSubtitle('전송 중...');
            mediaRecorderRef.current.stop();
        }

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    // 오디오 서버로 전송
    const sendAudioToServer = async () => {
        console.log('📤 오디오 전송');

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        audioChunksRef.current = [];

        const socket = getAiSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            // "stop" 메시지 전송
            socket.send(JSON.stringify({ type: 'stop' }));

            // 오디오 Blob 전송
            socket.send(audioBlob);

            setState(STATES.AI_THINKING);
            setCurrentSubtitle('AI가 생각 중입니다...');
        }
    };

    // WebSocket 메시지 처리
    useEffect(() => {
        const socket = getAiSocket();
        if (!socket) return;

        socket.onmessage = async (event) => {
            const data = event.data;

            // 🎧 오디오 Blob 메시지 처리
            if (data instanceof Blob) {
                console.log('🎵 AI 오디오 Blob 수신:', data);
                playAiAudio(data);
                return;
            }

            // 📝 JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                console.log('📩 AI JSON 메시지 수신:', msg);

                if (msg.type === 'ended') {
                    // AI가 응답을 완료했음을 알림
                    console.log('✅ AI 응답 완료');
                } else if (msg.message) {
                    // 자막 표시
                    setCurrentSubtitle(msg.message);
                }
            } catch (err) {
                console.warn('⚠ JSON 파싱 실패 메시지:', data);
            }
        };
    }, []);

    // AI 오디오 재생
    const playAiAudio = async (audioBlob) => {
        setState(STATES.AI_SPEAKING);
        setCurrentSubtitle('AI가 말하는 중...');

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;

        audio.onended = () => {
            console.log('🔇 AI 오디오 재생 완료 -> 대기 중');
            setState(STATES.IDLE);
            setCurrentSubtitle('말씀해주세요!');
            URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = (e) => {
            console.error('오디오 재생 실패:', e);
            setState(STATES.IDLE);
            setCurrentSubtitle('오디오 재생 오류가 발생했습니다.');
            URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
    };

    const handleEndCall = () => {
        // 오디오 재생 중이면 중지
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current = null;
        }

        // 녹음 중이면 중지
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        endCall();
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
                            </MotionText>
                        </AnimatePresence>
                    </Box>

                    {/* <Box
                        bg="white"
                        borderRadius="10px"
                        p={3}
                        h="200px"
                        overflowY="auto"
                        mt={4}
                        boxShadow="0 0 10px rgba(0,0,0,0.1)"
                    >
                        {aiMessages.map((m, idx) => (
                            <Text key={idx} color="black" mb={2}>
                                👉 {m.message || JSON.stringify(m)}
                            </Text>
                        ))}
                    </Box> */}

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
