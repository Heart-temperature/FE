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

    const [isTalking, setIsTalking] = useState(true); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [aiMessages, setAiMessages] = useState([]);

    const videoRef = useRef(null); // video 태그 ref

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
                // TODO: 오디오 재생 처리
                return;
            }

            // 📝 2) JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                console.log('📩 AI JSON 메시지 수신:', msg);

                setAiMessages((prev) => [...prev, msg]);
            } catch (err) {
                console.warn('⚠ JSON 파싱 실패 메시지:', data);
            }
        };
    }, []);

    // 테스트용 AI 음성 및 자막 시뮬레이션
    useEffect(() => {
        const testSubtitles = [
            { text: '안녕하세요! 오늘 기분이 어떠세요?', duration: 3000, aiTalking: true },

            { text: '(사용자 응답 대기 중...)', duration: 2000, aiTalking: false },

            { text: '오늘 날씨가 참 좋네요.', duration: 2500, aiTalking: true },

            { text: '(사용자 응답 대기 중...)', duration: 2000, aiTalking: false },

            { text: '무슨 이야기를 나누고 싶으세요?', duration: 3000, aiTalking: true },

            { text: '(사용자 응답 대기 중...)', duration: 2000, aiTalking: false },
        ];

        let index = 0;

        const showNextSubtitle = () => {
            const current = testSubtitles[index % testSubtitles.length];

            setCurrentSubtitle(current.text);

            setIsTalking(current.aiTalking);

            index++;

            setTimeout(showNextSubtitle, current.duration);
        };

        // 첫 자막 즉시 표시

        showNextSubtitle();

        return () => {
            index = testSubtitles.length; // cleanup
        };
    }, []);

    const handleEndCall = () => {
        endCall();
        setIsTalking(false);
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

                    <Box
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
