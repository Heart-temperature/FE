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
    const [currentSubtitle, setCurrentSubtitle] = useState('통화 연결 중...');
    const [aiMessages, setAiMessages] = useState([]);

    const videoRef = useRef(null); // video 태그 ref
    const mediaRecorderRef = useRef(null); // MediaRecorder ref
    const audioStreamRef = useRef(null); // 오디오 스트림 ref

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',

        characterType: 'dajeong',

        color: '#2196F3',
    };

    // 통화 시작 시 마이크 권한 요청 및 녹음 시작
    useEffect(() => {
        if (location.state) {
            const { character, politeness } = location.state;
            // 통화 시작 API 호출
            startCall(character, politeness);

            // 마이크 권한 요청 및 녹음 시작
            startMicrophoneRecording();
        }

        // 컴포넌트 언마운트 시 녹음 중지
        return () => {
            stopMicrophoneRecording();
        };
    }, [location.state]);

    // 마이크 녹음 시작 함수
    const startMicrophoneRecording = async () => {
        try {
            // 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // MediaRecorder 생성
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });
            mediaRecorderRef.current = mediaRecorder;

            // 오디오 데이터 수집 및 전송
            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    const socket = getAiSocket();
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        // 오디오 Blob를 WebSocket으로 전송
                        socket.send(event.data);
                        console.log('🎤 사용자 오디오 전송:', event.data.size, 'bytes');
                    }
                }
            };

            // 100ms마다 오디오 청크 수집
            mediaRecorder.start(100);
            console.log('🎤 마이크 녹음 시작');
        } catch (error) {
            console.error('❌ 마이크 권한 요청 실패:', error);
            alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
        }
    };

    // 마이크 녹음 중지 함수
    const stopMicrophoneRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            console.log('🎤 마이크 녹음 중지');
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }
    };

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

            // 🎧 1) 오디오 Blob 메시지 처리
            if (data instanceof Blob) {
                console.log('🎵 AI 오디오 Blob 수신:', data);

                // 오디오 재생
                const audioUrl = URL.createObjectURL(data);
                const audio = new Audio(audioUrl);

                // AI가 말하기 시작
                setIsTalking(true);

                audio.onended = () => {
                    // AI가 말하기 종료
                    setIsTalking(false);
                    URL.revokeObjectURL(audioUrl);
                    console.log('🎵 AI 오디오 재생 종료');
                };

                audio.onerror = (error) => {
                    console.error('❌ 오디오 재생 실패:', error);
                    setIsTalking(false);
                    URL.revokeObjectURL(audioUrl);
                };

                try {
                    await audio.play();
                    console.log('🎵 AI 오디오 재생 시작');
                } catch (error) {
                    console.error('❌ 오디오 재생 실패:', error);
                    setIsTalking(false);
                }

                return;
            }

            // 📝 2) JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                console.log('📩 AI JSON 메시지 수신:', msg);

                setAiMessages((prev) => [...prev, msg]);

                // 자막 업데이트
                if (msg.message || msg.text) {
                    setCurrentSubtitle(msg.message || msg.text);
                }
            } catch (err) {
                console.warn('⚠ JSON 파싱 실패 메시지:', data);
            }
        };
    }, []);

    const handleEndCall = () => {
        // 마이크 녹음 중지
        stopMicrophoneRecording();

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
                            bg={isRecording ? '#F44336' : isHighContrast ? '#FFD700' : character.color || '#2196F3'}
                            color={isHighContrast ? '#000000' : 'white'}
                            border={isHighContrast ? '3px solid white' : 'none'}
                            boxShadow={
                                isRecording ? '0 0 20px rgba(244, 67, 54, 0.6)' : '0 4px 14px rgba(33, 150, 243, 0.3)'
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
