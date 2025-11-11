import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTalking, setIsTalking] = useState(true); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const videoRef = useRef(null); // video 태그 ref

    // 전달받은 캐릭터 정보 및 고대비 모드
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };
    const isHighContrast = location.state?.isHighContrast || false;

    // isTalking 상태에 따라 video 재생/정지
    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking && !isUserTalking) {
            // AI가 말할 때: 재생
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            // AI 말 안할 때 또는 사용자 말할 때: 정지하고 처음으로
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isTalking, isUserTalking]);

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
        setIsTalking(false);
        setTimeout(() => {
            navigate('/app/home'); // MainPage로 돌아가기
        }, 300);
    };

    return (
        <Flex
            minH="100vh"
            direction="column"
            align="center"
            justify="center"
            bg={isHighContrast ? '#000000' : '#FFFFFF'}
            p={6}
            gap={8}
        >
            {/* 카드 형태의 깔끔한 디자인 */}
            <Box
                bg={isHighContrast ? '#000000' : 'white'}
                borderRadius="20px"
                boxShadow={
                    isHighContrast
                        ? '0 0 0 4px white, 0 20px 60px rgba(255,255,255,0.5)'
                        : '0 10px 40px rgba(33, 150, 243, 0.15)'
                }
                p={{ base: 8, md: 12 }}
                w="full"
                maxW="600px"
                border={isHighContrast ? '4px solid white' : 'none'}
            >
                <VStack spacing={8} align="stretch">
                    {/* 캐릭터 영역 */}
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        w="100%"
                        h="400px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* video 태그로 mp4 재생 제어 */}
                        <Box
                            as="video"
                            ref={videoRef}
                            src={
                                character.characterType === 'dabok'
                                    ? `/video/dabok_${isHighContrast ? 'black' : 'white'}.mp4`
                                    : '/video/dajeong.mp4'
                            }
                            loop
                            muted
                            playsInline
                            w="100%"
                            h="100%"
                            objectFit="contain"
                            onError={(e) => {
                                console.error('Video 로드 실패:', e.target.src);
                            }}
                        />
                    </MotionBox>

                    {/* 현재 자막 */}
                    <AnimatePresence mode="wait">
                        <MotionText
                            key={currentSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            fontSize="xl"
                            fontWeight="600"
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            textAlign="center"
                            bg={isHighContrast ? 'rgba(255, 255, 255, 0.1)' : '#F5F7FA'}
                            px={6}
                            py={4}
                            borderRadius="15px"
                            minH="80px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="full"
                            border={isHighContrast ? '2px solid white' : 'none'}
                        >
                            {currentSubtitle}
                        </MotionText>
                    </AnimatePresence>

                    {/* 통화 종료 버튼 */}
                    <Button
                        w="full"
                        size="lg"
                        bg={isHighContrast ? '#FFD700' : '#F44336'}
                        color={isHighContrast ? '#000000' : 'white'}
                        onClick={handleEndCall}
                        fontSize="xl"
                        fontWeight="700"
                        height="60px"
                        borderRadius="15px"
                        border={isHighContrast ? '3px solid white' : 'none'}
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
