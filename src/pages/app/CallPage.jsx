import React, { useState, useEffect } from 'react';
import { Button, Flex, Text, VStack, Box, Image } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import DabokImage from '../../components/common/img1.png';
import DajeongImage from '../../components/common/img2.png';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTalking, setIsTalking] = useState(true); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [gifKey, setGifKey] = useState(0); // gif 강제 리로드용

    // 전달받은 캐릭터 정보 및 고대비 모드
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };
    const isHighContrast = location.state?.isHighContrast || false;

    // isTalking이 true로 변경될 때마다 gif 강제 리로드
    useEffect(() => {
        if (isTalking && !isUserTalking) {
            setGifKey((prev) => prev + 1);
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
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
            gap={8}
        >
            {/* 캐릭터 영역 - 테두리 없이 */}
            <VStack spacing={8} w="full" maxW="600px" align="center">
                <MotionBox
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    w="400px"
                    h="400px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* AI가 말하는 중일 때만 gif 표시, 아니면 정적 이미지 */}
                    {isTalking && !isUserTalking ? (
                        character.characterType === 'dabok' ? (
                            <Image
                                key={`gif-dabok-${isHighContrast ? 'black' : 'white'}-${gifKey}`}
                                src={`/video/dabok_${isHighContrast ? 'black' : 'white'}.gif`}
                                alt={`${character.name} 말하는 중`}
                                w="100%"
                                h="100%"
                                objectFit="contain"
                                onError={(e) => {
                                    console.error('GIF 로드 실패:', `/video/dabok_${isHighContrast ? 'black' : 'white'}.gif`);
                                }}
                            />
                        ) : (
                            <Image
                                key={`gif-dajeong-${gifKey}`}
                                src="/video/dajeong.gif"
                                alt={`${character.name} 말하는 중`}
                                w="100%"
                                h="100%"
                                objectFit="contain"
                                onError={(e) => {
                                    console.error('GIF 로드 실패: /video/dajeong.gif');
                                }}
                            />
                        )
                    ) : (
                        <Image
                            src={character.characterType === 'dabok' ? DabokImage : DajeongImage}
                            alt={character.name}
                            w="100%"
                            h="100%"
                            objectFit="contain"
                        />
                    )}
                </MotionBox>

                {/* 현재 자막 */}
                <AnimatePresence mode="wait">
                    <MotionText
                        key={currentSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        fontSize="2xl"
                        fontWeight="600"
                        color="white"
                        textAlign="center"
                        bg="rgba(0, 0, 0, 0.3)"
                        px={6}
                        py={4}
                        borderRadius="20px"
                        minH="80px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="full"
                    >
                        {currentSubtitle}
                    </MotionText>
                </AnimatePresence>

                {/* 통화 종료 버튼 */}
                <Button
                    w="full"
                    size="lg"
                    colorScheme="red"
                    onClick={handleEndCall}
                    fontSize="xl"
                    fontWeight="700"
                    height="60px"
                    borderRadius="15px"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)',
                    }}
                    _active={{
                        transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                >
                    통화 종료
                </Button>
            </VStack>
        </Flex>
    );
}
