import { Box, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Mouth } from './Mouth'; // 1. Mouth 컴포넌트를 분리하여 import

const MotionBox = motion(Box);

/**
 * 로봇 캐릭터 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {'idle' | 'talking'} props.mode - 로봇 모드
 * @param {string} [props.viseme] - 현재 입모양 (예: 'a', 'i', 'u', 'neutral')
 */
export const Robot = ({ mode = 'idle', viseme = 'u' }) => {
    return (
        <VStack spacing={3}>
            <MotionBox
                w="180px"
                h="180px"
                borderRadius="full"
                bg="white"
                boxShadow="lg"
                display="grid"
                placeItems="center"
                // 'talking'일 때만 더 큰 애니메이션 적용
                animate={
                    mode === 'talking'
                        ? {
                              scale: [1, 1.06, 1],
                              boxShadow: [
                                  '0 10px 20px rgba(0,0,0,0.08)',
                                  '0 16px 32px rgba(0,0,0,0.12)',
                                  '0 10px 20px rgba(0,0,0,0.08)',
                              ],
                          }
                        : { scale: [1, 1.02, 1] }
                }
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* 얼굴 */}
                <Box w="120px" h="120px" bg="#0F172A" borderRadius="full" position="relative">
                    {/* 눈 */}
                    <MotionBox
                        position="absolute"
                        top="40%"
                        left="22%"
                        w="20px"
                        h="12px"
                        bg="#66E3FF"
                        borderRadius="12px"
                        animate={{
                            opacity: [1, 0.8, 1],
                            y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0],
                        }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                    />
                    <MotionBox
                        position="absolute"
                        top="40%"
                        right="22%"
                        w="20px"
                        h="12px"
                        bg="#66E3FF"
                        borderRadius="12px"
                        animate={{
                            opacity: [1, 0.8, 1],
                            y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0],
                        }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
                    />

                    {/* 2. 입모양 컴포넌트 호출 */}
                    {/* 말하는 중일 때만 viseme에 맞는 입모양을 렌더링 */}
                    {mode === 'talking' && <Mouth viseme={viseme} />}
                </Box>
            </MotionBox>
            <Text fontSize="lg" color="gray.700">
                {mode === 'talking' ? '말하고 있어요…' : '안녕하세요!'}
            </Text>
        </VStack>
    );
};

