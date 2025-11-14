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

    const [isTalking, setIsTalking] = useState(false); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [aiMessages, setAiMessages] = useState([]);
    const [isListening, setIsListening] = useState(false); // 음성 인식 활성 상태

    const videoRef = useRef(null); // video 태그 ref
    const recognitionRef = useRef(null); // SpeechRecognition 인스턴스
    const isRecognitionActive = useRef(false); // 음성 인식 활성 여부 추적

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    // 음성 인식 초기화
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('이 브라우저는 음성 인식을 지원하지 않습니다.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => {
            console.log('🎤 음성 인식 시작');
            isRecognitionActive.current = true;
            setIsListening(true);
            setIsUserTalking(true);
        };

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript;
                console.log('📝 인식된 텍스트:', transcript);

                // 자막 표시
                setCurrentSubtitle(`나: ${transcript}`);

                // AI 서버로 전송
                const socket = getAiSocket();
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const payload = {
                        type: 'user_speech',
                        text: transcript,
                    };
                    socket.send(JSON.stringify(payload));
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('❌ 음성 인식 오류:', event.error);

            // no-speech 에러는 무시 (사용자가 말하지 않은 경우)
            if (event.error === 'no-speech') {
                return;
            }

            // aborted 에러는 정상 종료로 처리
            if (event.error === 'aborted') {
                return;
            }

            isRecognitionActive.current = false;
            setIsListening(false);
            setIsUserTalking(false);
        };

        recognition.onend = () => {
            console.log('🛑 음성 인식 종료');

            // 자동 재시작 (continuous 모드 유지)
            if (isRecognitionActive.current) {
                try {
                    recognition.start();
                } catch (error) {
                    console.warn('음성 인식 재시작 실패:', error);
                }
            } else {
                setIsListening(false);
                setIsUserTalking(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                isRecognitionActive.current = false;
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    console.warn('음성 인식 정리 실패:', error);
                }
            }
        };
    }, []);

    useEffect(() => {
        if (location.state) {
            const { character, politeness } = location.state;
            // 통화 시작 API 호출
            startCall(character, politeness);

            // 통화 시작 시 음성 인식 자동 시작
            setTimeout(() => {
                startSpeechRecognition();
            }, 1000);
        }
    }, [location.state]);

    // isTalking 상태에 따라 video 재생/정지
    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking) {
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isTalking, isUserTalking]);

    // 음성 인식 시작 함수
    const startSpeechRecognition = () => {
        if (!recognitionRef.current) {
            console.warn('음성 인식이 초기화되지 않았습니다.');
            return;
        }

        if (isRecognitionActive.current) {
            console.log('음성 인식이 이미 실행 중입니다.');
            return;
        }

        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error('음성 인식 시작 실패:', error);
        }
    };

    // 음성 인식 중지 함수
    const stopSpeechRecognition = () => {
        if (!recognitionRef.current) return;

        isRecognitionActive.current = false;
        try {
            recognitionRef.current.stop();
        } catch (error) {
            console.warn('음성 인식 중지 실패:', error);
        }
    };

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

                // AI 응답이 왔을 때 자막 표시
                if (msg.message || msg.text) {
                    const aiText = msg.message || msg.text;
                    setCurrentSubtitle(`${character.name}: ${aiText}`);
                    setIsTalking(true);

                    // AI가 말하는 동안 음성 인식 일시 중지
                    if (isRecognitionActive.current) {
                        stopSpeechRecognition();
                    }

                    // AI 응답이 끝나면 다시 음성 인식 시작 (예: 3초 후)
                    setTimeout(() => {
                        setIsTalking(false);
                        startSpeechRecognition();
                    }, aiText.length * 100); // 텍스트 길이에 비례한 시간
                }
            } catch (err) {
                console.warn('⚠️ JSON 파싱 실패:', data);
            }
        };
    }, [character.name]);

    const handleEndCall = () => {
        // 음성 인식 중지
        stopSpeechRecognition();

        // 통화 종료
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
