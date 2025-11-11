import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Center, VStack, Text, HStack, Flex } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoCharacter } from '../../components/ui/VideoCharacter';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [speaking, setSpeaking] = useState(false);
    const ttsRef = useRef(null);

    // MainPage에서 전달받은 선택된 모델 정보
    const selectedModel = location.state?.selectedModel || { id: 1, name: '다정이' };

    // 비디오 파일 경로 - 다복이용
    const videoSrc = '/videos/daboki.mp4';

    // 통화 종료 핸들러
    const handleEndCall = () => {
        try {
            window.speechSynthesis?.cancel();
        } catch (error) {
            console.error('TTS 중지 실패:', error);
        }
        setSpeaking(false);
        navigate('/app/home');
    };

    // 컴포넌트 마운트 시 자동으로 인사말 재생
    useEffect(() => {
        const timer = setTimeout(() => {
            speakGreeting();
        }, 1000);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis?.cancel();
        };
    }, []);

    // TTS 인사말
    const speakGreeting = () => {
        try {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(
                `안녕하세요! ${selectedModel.name}입니다. 오늘 기분은 어떠세요? 편하게 말씀해주세요.`
            );
            utterance.lang = 'ko-KR';
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            ttsRef.current = utterance;
            synth.speak(utterance);
        } catch (error) {
            console.error('TTS 실행 실패:', error);
            // 브라우저 미지원 시에도 UI는 speaking 애니메이션으로 대체
            setSpeaking(true);
            setTimeout(() => setSpeaking(false), 3000);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="#F0E9FF" px={6} py={10}>
            <Box
                bg="white"
                borderRadius="20px"
                boxShadow="0 10px 40px rgba(76, 175, 80, 0.15)"
                p={{ base: 10, md: 14 }}
                w="full"
                maxW="550px"
            >
                <VStack spacing={8} align="stretch">
                    {/* 통화 중 헤더 */}
                    <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="#4CAF50" mb={2}>
                            통화 중
                        </Text>
                        <Text fontSize="lg" color="gray.600">
                            {selectedModel.name}
                        </Text>
                    </Box>

                    {/* 캐릭터 표시 영역 */}
                    <Center>
                        {selectedModel.name === '다복이' ? (
                            // 다복이가 선택된 경우 영상 재생
                            <VideoCharacter
                                videoSrc={videoSrc}
                                speaking={speaking}
                                loop={true}
                                width="350px"
                                height="350px"
                            />
                        ) : (
                            // 다정이나 다른 캐릭터의 경우 기본 표시
                            <MotionBox
                                w="350px"
                                h="350px"
                                borderRadius="full"
                                bg="white"
                                border="5px solid #2196F3"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                boxShadow="0 8px 20px rgba(0, 0, 0, 0.1)"
                                animate={{
                                    scale: speaking ? [1, 1.05, 1] : 1,
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: speaking ? Infinity : 0,
                                    ease: 'easeInOut',
                                }}
                            >
                                <Text fontSize="6xl">👨‍⚕️</Text>
                            </MotionBox>
                        )}
                    </Center>

                    {/* 상태 텍스트 */}
                    <Text fontSize="lg" color="gray.700" textAlign="center" fontWeight="medium">
                        {speaking ? `${selectedModel.name}가 말하고 있어요` : '말씀하시면 듣고 있습니다'}
                    </Text>

                    {/* 음성 표시 인디케이터 */}
                    {speaking && (
                        <HStack justify="center" spacing={2}>
                            {[...Array(5)].map((_, i) => (
                                <MotionBox
                                    key={i}
                                    w="6px"
                                    bg="#4CAF50"
                                    borderRadius="sm"
                                    animate={{
                                        height: ['8px', '24px', '12px', '20px', '8px'],
                                    }}
                                    transition={{
                                        duration: 0.9,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </HStack>
                    )}

                    {/* 통화 종료 버튼 */}
                    <Button
                        size="lg"
                        colorScheme="red"
                        w="full"
                        h="70px"
                        fontSize="1.9rem"
                        fontWeight="bold"
                        borderRadius="15px"
                        onClick={handleEndCall}
                        _hover={{
                            bg: 'red.600',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)',
                        }}
                        _active={{
                            bg: 'red.700',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        통화 종료
                    </Button>

                    {/* 추가 정보 */}
                    <HStack justify="center" color="gray.500" fontSize="sm">
                        <Box w="8px" h="8px" borderRadius="full" bg="green.500" />
                        <Text>연결됨</Text>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
}
