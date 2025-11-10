import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, VStack, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedCharacter } from '../../components/ui';

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTalking, setIsTalking] = useState(true); // 통화 중이므로 기본 true
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [subtitleHistory, setSubtitleHistory] = useState([]);

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    // 테스트용 자막 시뮬레이션
    useEffect(() => {
        const testSubtitles = [
            '안녕하세요! 오늘 기분이 어떠세요?',
            '오늘 날씨가 참 좋네요.',
            '무슨 이야기를 나누고 싶으세요?',
            '편하게 말씀해 주세요.',
            '잘 듣고 있습니다.',
        ];

        let index = 0;
        const interval = setInterval(() => {
            const subtitle = testSubtitles[index % testSubtitles.length];
            setCurrentSubtitle(subtitle);
            setSubtitleHistory((prev) => [
                ...prev.slice(-4), // 최근 5개만 유지
                { id: Date.now(), text: subtitle },
            ]);
            index++;
        }, 4000); // 4초마다 자막 변경

        // 첫 자막 즉시 표시
        setCurrentSubtitle(testSubtitles[0]);
        setSubtitleHistory([{ id: Date.now(), text: testSubtitles[0] }]);

        return () => clearInterval(interval);
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
            justify="space-between"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
        >
            {/* 상단 헤더 */}
            <Flex w="full" maxW="600px" justify="space-between" align="center" pt={4}>
                <Text fontSize="2xl" fontWeight="700" color="white">
                    {character.name}
                </Text>
                <IconButton
                    icon={<CloseIcon />}
                    aria-label="통화 종료"
                    onClick={handleEndCall}
                    colorScheme="red"
                    borderRadius="full"
                    size="lg"
                />
            </Flex>

            {/* 캐릭터 영역 */}
            <VStack flex="1" justify="center" spacing={8} w="full" maxW="600px">
                <MotionBox
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    w="320px"
                    h="320px"
                    borderRadius="full"
                    bg="white"
                    border={`8px solid ${character.color}`}
                    boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <AnimatedCharacter
                        alt={character.name}
                        isTalking={isTalking}
                        characterType={character.characterType}
                    />
                </MotionBox>

                {/* 현재 자막 (크게) */}
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
                    >
                        {currentSubtitle}
                    </MotionText>
                </AnimatePresence>
            </VStack>

            {/* 하단 자막 히스토리 */}
            <Box w="full" maxW="600px" pb={4}>
                <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="600" color="whiteAlpha.700" mb={2}>
                        대화 내용
                    </Text>
                    <Box
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="15px"
                        p={4}
                        maxH="200px"
                        overflowY="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '10px',
                            },
                        }}
                    >
                        <VStack spacing={2} align="stretch">
                            {subtitleHistory.map((item) => (
                                <MotionBox
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Text fontSize="md" color="white" fontWeight="500">
                                        {item.text}
                                    </Text>
                                </MotionBox>
                            ))}
                        </VStack>
                    </Box>
                </VStack>

                {/* 통화 종료 버튼 */}
                <Button
                    w="full"
                    mt={4}
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
            </Box>
        </Flex>
    );
}
