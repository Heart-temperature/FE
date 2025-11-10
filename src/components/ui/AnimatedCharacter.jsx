import React, { useEffect, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * 2D 캐릭터 이미지에 입 애니메이션을 추가하는 컴포넌트
 * @param {Object} props
 * @param {string} props.image - 캐릭터 이미지 경로
 * @param {string} props.alt - 이미지 alt 텍스트
 * @param {boolean} props.isTalking - 말하는 중인지 여부
 * @param {string} props.characterType - 'dabok' (img1) 또는 'dajeong' (img2)
 */
export const AnimatedCharacter = ({ image, alt, isTalking = false, characterType = 'dajeong' }) => {
    const [currentViseme, setCurrentViseme] = useState('neutral');

    // 말할 때 랜덤하게 viseme 변경 (실제로는 음성 API에서 받아올 수 있음)
    useEffect(() => {
        if (!isTalking) {
            setCurrentViseme('neutral');
            return;
        }

        const visemes = ['a', 'u', 'i', 'neutral'];
        const interval = setInterval(() => {
            const randomViseme = visemes[Math.floor(Math.random() * visemes.length)];
            setCurrentViseme(randomViseme);
        }, 300); // 300ms마다 입 모양 변경

        return () => clearInterval(interval);
    }, [isTalking]);

    // 각 캐릭터별 입 위치 조정
    const mouthPosition = {
        dabok: {
            // 다복이 (할아버지) - img1.png
            top: '62%',
            left: '50%',
        },
        dajeong: {
            // 다정이 (여성) - img2.png
            top: '65%',
            left: '50%',
        },
    };

    const position = mouthPosition[characterType];

    // Viseme별 입 모양 정의
    const getMouthStyle = () => {
        const baseStyle = {
            position: 'absolute',
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -50%)',
            bg: '#4A3428', // 갈색 입
            borderRadius: '50%',
        };

        switch (currentViseme) {
            case 'a': // '아' - 크게 벌린 입
                return {
                    ...baseStyle,
                    w: '22px',
                    h: '18px',
                    borderRadius: '50% 50% 50% 50%',
                };
            case 'u': // '우' - 둥근 작은 입
                return {
                    ...baseStyle,
                    w: '14px',
                    h: '14px',
                    borderRadius: 'full',
                };
            case 'i': // '이' - 가로로 긴 입
                return {
                    ...baseStyle,
                    w: '26px',
                    h: '8px',
                    borderRadius: '4px',
                };
            default: // neutral - 기본 미소
                return {
                    ...baseStyle,
                    w: '20px',
                    h: '4px',
                    borderRadius: '10px',
                };
        }
    };

    // 말할 때 애니메이션 variants
    const mouthVariants = {
        a: {
            scaleY: [0.9, 1.1, 0.95, 1.05, 0.9],
            scaleX: [0.95, 1.05, 1, 0.95, 1],
            transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' },
        },
        u: {
            scale: [0.8, 1.2, 0.9, 1.1, 0.85],
            transition: { duration: 0.8, repeat: Infinity, ease: 'circOut' },
        },
        i: {
            scaleY: [0.7, 1.1, 0.8, 1.2, 0.7],
            scaleX: [0.95, 1.05, 1, 0.95, 1],
            transition: { duration: 0.4, repeat: Infinity, ease: 'linear' },
        },
        neutral: {
            scaleY: [0.9, 1.1, 0.9],
            transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
        },
    };

    return (
        <Box position="relative" w="100%" h="100%">
            {/* 캐릭터 이미지 */}
            <Image src={image} alt={alt} w="100%" h="100%" objectFit="cover" />

            {/* 입 애니메이션 오버레이 */}
            {isTalking && (
                <MotionBox
                    {...getMouthStyle()}
                    animate={mouthVariants[currentViseme]}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </Box>
    );
};
