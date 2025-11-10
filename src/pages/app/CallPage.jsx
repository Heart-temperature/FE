import React, { useState, useEffect } from 'react';
import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedCharacter } from '../../components/ui';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTalking, setIsTalking] = useState(true); // 통화 중이므로 기본 true
    const [currentSubtitle, setCurrentSubtitle] = useState('');

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
            index++;
        }, 4000); // 4초마다 자막 변경

        // 첫 자막 즉시 표시
        setCurrentSubtitle(testSubtitles[0]);

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
                    <AnimatedCharacter
                        alt={character.name}
                        isTalking={isTalking}
                        characterType={character.characterType}
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
