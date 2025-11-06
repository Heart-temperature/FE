import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

export default function Logo({ size = 'md', isHighContrast = false }) {
    const sizes = {
        sm: { icon: '50px', text: '1.8rem' },
        md: { icon: '70px', text: '2.5rem' },
        lg: { icon: '90px', text: '3.2rem' },
        xl: { icon: '110px', text: '4rem' },
    };

    const currentSize = sizes[size];

    return (
        <Flex direction="column" align="center" gap={2}>
            {/* 귀여운 캐릭터 로고 */}
            <Box position="relative" w={currentSize.icon} h={currentSize.icon}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 얼굴 배경 (둥근 원) */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill={isHighContrast ? '#FFD700' : '#FFB6C1'}
                    />

                    {/* 블러시 (볼터치) */}
                    <ellipse cx="30" cy="55" rx="8" ry="6" fill={isHighContrast ? '#FF6B9D' : '#FF9FB2'} opacity="0.6" />
                    <ellipse cx="70" cy="55" rx="8" ry="6" fill={isHighContrast ? '#FF6B9D' : '#FF9FB2'} opacity="0.6" />

                    {/* 눈 */}
                    <circle cx="38" cy="45" r="4" fill="#333333" />
                    <circle cx="62" cy="45" r="4" fill="#333333" />
                    {/* 눈 하이라이트 */}
                    <circle cx="39" cy="44" r="1.5" fill="white" />
                    <circle cx="63" cy="44" r="1.5" fill="white" />

                    {/* 웃는 입 */}
                    <path
                        d="M 35 60 Q 50 68, 65 60"
                        stroke="#333333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* 하트 */}
                    <path
                        d="M 50 30 L 52 28 Q 54 26, 56 28 Q 58 30, 56 32 L 50 38 L 44 32 Q 42 30, 44 28 Q 46 26, 48 28 Z"
                        fill={isHighContrast ? '#FFFFFF' : '#FF6B9D'}
                    />

                    {/* 손 (양쪽) */}
                    <ellipse cx="15" cy="55" rx="8" ry="12" fill={isHighContrast ? '#FFEB3B' : '#FFC0CB'} />
                    <ellipse cx="85" cy="55" rx="8" ry="12" fill={isHighContrast ? '#FFEB3B' : '#FFC0CB'} />
                </svg>
            </Box>

            {/* 귀여운 텍스트 */}
            <Flex align="center" gap={1}>
                <Text
                    fontSize={currentSize.text}
                    fontWeight="800"
                    color={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                    letterSpacing="tight"
                    fontFamily="'Noto Sans KR', sans-serif"
                >
                    다정
                </Text>
                <Text fontSize={currentSize.text} role="img" aria-label="heart">
                    💕
                </Text>
            </Flex>
        </Flex>
    );
}
