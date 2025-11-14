import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box, Image, Divider, IconButton, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMicrophone, FaStop } from 'react-icons/fa';

import DajeongLogo from '../../assets/image.png';
import DabokVideo from '../../video/dabok.webm';
import DajeongVideo from '../../video/dajeung.webm';
import useAppSettings from '../../hooks/useAppSettings';
import useAudioRecorder from '../../hooks/useAudioRecorder';

import { endCall, startCall } from '../../api/callAPI';
import { getAiSocket } from '../../api/aiSocket';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const { fontSizeLevel, setFontSizeLevel, isHighContrast, toggleHighContrast, fs, callBtnH } = useAppSettings();

    const [isTalking, setIsTalking] = useState(false); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [userText, setUserText] = useState(''); // 사용자 음성인식 텍스트
    const [aiText, setAiText] = useState(''); // AI 응답 텍스트
    const [isCallActive, setIsCallActive] = useState(false); // 통화 활성화 상태

    const videoRef = useRef(null); // video 태그 ref
    const audioRef = useRef(null); // TTS 오디오 재생용 ref

    // 오디오 녹음 훅
    const { isRecording, error: recordError, toggleRecording } = useAudioRecorder();

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
            setIsCallActive(true);
            setCurrentSubtitle('통화가 시작되었습니다. 마이크 버튼을 눌러 말씀해주세요.');
        }
    }, [location.state]);

    // isTalking 상태에 따라 video 재생/정지
    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking && !isUserTalking) {
            // AI가 말할 때: 재생

            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            // AI 말 안할 때: 정지 (멈춘 자리 유지)

            videoRef.current.pause();
        }
    }, [isTalking, isUserTalking]);

    useEffect(() => {
        const socket = getAiSocket();
        if (!socket) return;

        socket.onmessage = async (event) => {
            const data = event.data;

            // 🎧 1) 오디오 Blob/ArrayBuffer 메시지 처리 (TTS)
            if (data instanceof Blob || data instanceof ArrayBuffer) {
                console.log('🎵 AI 오디오 수신:', data);
                handleTTSAudio(data);
                return;
            }

            // 📝 2) JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                console.log('📩 AI JSON 메시지 수신:', msg);
                handleWebSocketMessage(msg);
            } catch (err) {
                console.warn('⚠ JSON 파싱 실패 메시지:', data);
            }
        };

        // 에러 및 연결 종료 처리
        socket.onerror = (error) => {
            console.error('❌ WebSocket 오류:', error);
            toast({
                title: 'WebSocket 오류',
                description: '서버 연결에 문제가 발생했습니다.',
                status: 'error',
                duration: 3000,
            });
        };

        socket.onclose = () => {
            console.log('🔌 WebSocket 연결 종료');
            setIsCallActive(false);
        };

        return () => {
            // cleanup
        };
    }, [toast]);

    // WebSocket 메시지 처리 함수
    const handleWebSocketMessage = (msg) => {
        const { type, text, message } = msg;

        switch (type) {
            case 'stt_result':
                // STT 결과 (사용자 음성인식 결과)
                console.log('👤 사용자 발화:', text);
                setUserText(text);
                setCurrentSubtitle(`나: ${text}`);
                setIsUserTalking(false);
                break;

            case 'stt_status':
                // STT 처리 중
                console.log('🎤 STT 처리:', message);
                setCurrentSubtitle(message || 'STT 처리 중...');
                break;

            case 'tts_start':
                // TTS 시작 (AI 응답 텍스트)
                console.log('🤖 AI 응답:', text);
                setAiText(text);
                setCurrentSubtitle(text);
                setIsTalking(true);
                break;

            case 'tts_end':
                // TTS 종료
                console.log('🔊 TTS 재생 완료');
                setIsTalking(false);
                setCurrentSubtitle('마이크 버튼을 눌러 말씀해주세요.');
                break;

            case 'ready':
                // 녹음 준비 완료
                if (msg.event === 'start') {
                    console.log('✅ 녹음 준비 완료');
                    setIsUserTalking(true);
                    setCurrentSubtitle('듣고 있습니다...');
                }
                break;

            case 'error':
                // 에러 메시지
                console.error('❌ 서버 오류:', message);
                toast({
                    title: '오류 발생',
                    description: message || '알 수 없는 오류가 발생했습니다.',
                    status: 'error',
                    duration: 3000,
                });
                setIsTalking(false);
                setIsUserTalking(false);
                break;

            case 'call_summary':
                // 통화 요약
                console.log('📊 통화 요약:', msg);
                break;

            case 'auto_disconnect':
                // 자동 종료
                console.log('⚠️ 자동 종료:', message);
                toast({
                    title: '통화 종료',
                    description: message || '통화가 자동으로 종료되었습니다.',
                    status: 'warning',
                    duration: 3000,
                });
                handleEndCall();
                break;

            default:
                console.log('📨 기타 메시지:', msg);
        }
    };

    // TTS 오디오 재생 처리
    const handleTTSAudio = async (audioData) => {
        try {
            // Blob 또는 ArrayBuffer를 Blob으로 변환
            const blob = audioData instanceof Blob ? audioData : new Blob([audioData], { type: 'audio/wav' });

            // Blob URL 생성
            const url = URL.createObjectURL(blob);

            // 오디오 재생
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onplay = () => {
                console.log('🔊 TTS 오디오 재생 시작');
                setIsTalking(true);
            };

            audio.onended = () => {
                console.log('✅ TTS 오디오 재생 완료');
                setIsTalking(false);
                URL.revokeObjectURL(url);
            };

            audio.onerror = (e) => {
                console.error('❌ TTS 오디오 재생 오류:', e);
                setIsTalking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.error('❌ TTS 오디오 처리 오류:', error);
            setIsTalking(false);
        }
    };

    // 녹음 에러 처리
    useEffect(() => {
        if (recordError) {
            toast({
                title: '녹음 오류',
                description: recordError,
                status: 'error',
                duration: 3000,
            });
        }
    }, [recordError, toast]);

    // 녹음 버튼 클릭 핸들러
    const handleRecordClick = async () => {
        const socket = getAiSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            toast({
                title: 'WebSocket 연결 안 됨',
                description: '서버에 연결되지 않았습니다.',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (isTalking) {
            toast({
                title: 'AI가 말하는 중',
                description: 'AI가 말을 마칠 때까지 기다려주세요.',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        try {
            await toggleRecording(socket);
        } catch (error) {
            console.error('녹음 토글 오류:', error);
        }
    };

    // 통화 종료 핸들러
    const handleEndCall = () => {
        // 녹음 중이면 중지
        if (isRecording) {
            const socket = getAiSocket();
            if (socket) {
                toggleRecording(socket);
            }
        }

        // TTS 오디오 중지
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // 통화 종료 API 호출
        endCall();
        setIsTalking(false);
        setIsCallActive(false);
        navigate('/app/home'); // MainPage로 돌아가기
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

                    {/* 녹음 버튼 */}
                    <Flex justifyContent="center" mt={4}>
                        <IconButton
                            icon={isRecording ? <FaStop /> : <FaMicrophone />}
                            onClick={handleRecordClick}
                            size="lg"
                            w="80px"
                            h="80px"
                            borderRadius="50%"
                            bg={
                                isRecording
                                    ? '#F44336'
                                    : isHighContrast
                                    ? '#FFD700'
                                    : character.color || '#2196F3'
                            }
                            color={isHighContrast ? '#000000' : 'white'}
                            border={isHighContrast ? '3px solid white' : 'none'}
                            boxShadow={
                                isRecording
                                    ? '0 0 20px rgba(244, 67, 54, 0.6)'
                                    : '0 4px 14px rgba(33, 150, 243, 0.3)'
                            }
                            _hover={{
                                transform: 'scale(1.1)',
                                boxShadow: isRecording
                                    ? '0 0 30px rgba(244, 67, 54, 0.8)'
                                    : '0 6px 20px rgba(33, 150, 243, 0.5)',
                            }}
                            _active={{
                                transform: 'scale(0.95)',
                            }}
                            transition="all 0.2s"
                            animation={isRecording ? 'pulse 1.5s infinite' : 'none'}
                            aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
                            isDisabled={!isCallActive || isTalking}
                        />
                    </Flex>

                    {/* 녹음 상태 표시 */}
                    {isRecording && (
                        <MotionText
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            fontSize="sm"
                            color={isHighContrast ? '#FFFFFF' : '#F44336'}
                            textAlign="center"
                            mt={2}
                            fontWeight="600"
                        >
                            🔴 녹음 중...
                        </MotionText>
                    )}

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
