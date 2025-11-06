import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

export default function Logo({ size = 'md', isHighContrast = false }) {
    const sizes = {
        sm: { icon: '40px', text: '1.5rem', container: '120px' },
        md: { icon: '60px', text: '2.2rem', container: '180px' },
        lg: { icon: '80px', text: '3rem', container: '240px' },
        xl: { icon: '100px', text: '3.8rem', container: '300px' },
    };

    const currentSize = sizes[size];

    return (
        <Flex align="center" justify="center" gap={3}>
            {/* 로고 아이콘 - 하트와 손 */}
            <Box position="relative" w={currentSize.icon} h={currentSize.icon}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 외곽 원 */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill={isHighContrast ? '#000000' : '#1976D2'}
                        stroke={isHighContrast ? '#FFFFFF' : '#1565C0'}
                        strokeWidth="3"
                    />

                    {/* 하트 모양 */}
                    <path
                        d="M50 75 C25 60, 20 45, 25 35 C28 28, 35 25, 42 28 C46 30, 48 33, 50 37 C52 33, 54 30, 58 28 C65 25, 72 28, 75 35 C80 45, 75 60, 50 75 Z"
                        fill={isHighContrast ? '#FFD700' : '#FFFFFF'}
                        stroke={isHighContrast ? '#FFD700' : '#E3F2FD'}
                        strokeWidth="2"
                    />

                    {/* 손 모양 (하트를 감싸는 느낌) */}
                    <path
                        d="M30 50 Q25 55, 30 60 L35 58 Q32 55, 35 50 Z"
                        fill={isHighContrast ? '#FFFFFF' : '#BBDEFB'}
                        opacity="0.8"
                    />
                    <path
                        d="M70 50 Q75 55, 70 60 L65 58 Q68 55, 65 50 Z"
                        fill={isHighContrast ? '#FFFFFF' : '#BBDEFB'}
                        opacity="0.8"
                    />
                </svg>
            </Box>

            {/* 텍스트 로고 */}
            <Text
                fontSize={currentSize.text}
                fontWeight="900"
                color={isHighContrast ? '#FFFFFF' : '#1565C0'}
                letterSpacing="tight"
                fontFamily="'Noto Sans KR', sans-serif"
            >
                다정
            </Text>
        </Flex>
    );
}
