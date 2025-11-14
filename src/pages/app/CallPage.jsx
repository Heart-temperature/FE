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
    const [currentSubtitle, setCurrentSubtitle] = useState('통화 연결 중...');
    const [aiMessages, setAiMessages] = useState([]);

    const videoRef = useRef(null); // video 태그 ref
    const mediaRecorderRef = useRef(null); // 마이크 녹음기 ref
    const audioStreamRef = useRef(null); // 오디오 스트림 ref

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    // 통화 시작 시 API 호출 및 마이크 시작
    useEffect(() => {
        if (location.state) {
            const { character, politeness } = location.state;
            // 통화 시작 API 호출
            startCall(character, politeness);
            // 마이크 시작
            startMicrophone();
        }

        // 컴포넌트 언마운트 시 정리
        return () => {
            stopMicrophone();
        };
    }, [location.state]);

    // 마이크 시작 함수
    const startMicrophone = async () => {
        try {
            // 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // MediaRecorder 생성
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });
            mediaRecorderRef.current = mediaRecorder;

            // 오디오 데이터가 준비되면 서버로 전송
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const socket = getAiSocket();
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(event.data);
                        console.log('🎤 사용자 오디오 전송:', event.data.size, 'bytes');
                    }
                }
            };

            // 100ms마다 오디오 청크 전송
            mediaRecorder.start(100);
            console.log('🎤 마이크 녹음 시작');
        } catch (error) {
            console.error('❌ 마이크 권한 요청 실패:', error);
            alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
        }
    };

    // 마이크 중지 함수
    const stopMicrophone = () => {
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

    // WebSocket 메시지 수신 처리
    useEffect(() => {
        const socket = getAiSocket();
        if (!socket) return;

        socket.onmessage = async (event) => {
            const data = event.data;

            // 오디오 Blob 메시지 처리
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

            // JSON 텍스트 메시지 처리
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
        // 마이크 중지
        stopMicrophone();
        // 통화 종료 API 호출
        endCall();
        setIsTalking(false);
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
