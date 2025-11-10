import React, { useEffect, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

// 입 모양 이미지 import
import Img1Closed from '../common/img1_closedmouth.png';
import Img1Open from '../common/img1_openmouth.png';
import Img2Closed from '../common/img2.png';
import Img2Open from '../common/img2_openmouth.png';

const MotionImage = motion(Image);

/**
 * 실제 이미지 파일을 사용한 립싱크 애니메이션 컴포넌트
 * @param {Object} props
 * @param {string} props.alt - 이미지 alt 텍스트
 * @param {boolean} props.isTalking - 말하는 중인지 여부
 * @param {string} props.characterType - 'dabok' (img1) 또는 'dajeong' (img2)
 */
export const AnimatedCharacter = ({ alt, isTalking = false, characterType = 'dajeong' }) => {
    const [mouthOpen, setMouthOpen] = useState(false);

    // 캐릭터별 이미지 매핑
    const characterImages = {
        dabok: {
            closed: Img1Closed,
            open: Img1Open,
        },
        dajeong: {
            closed: Img2Closed,
            open: Img2Open,
        },
    };

    const images = characterImages[characterType];

    // 말할 때 입 모양 번갈아 변경
    useEffect(() => {
        if (!isTalking) {
            setMouthOpen(false);
            return;
        }

        // 랜덤한 간격으로 입 모양 변경 (200ms~500ms)
        const animate = () => {
            setMouthOpen((prev) => !prev);
            const randomDelay = 200 + Math.random() * 300;
            return setTimeout(animate, randomDelay);
        };

        const timeout = animate();

        return () => {
            clearTimeout(timeout);
        };
    }, [isTalking]);

    // 현재 표시할 이미지
    const currentImage = isTalking && mouthOpen ? images.open : images.closed;

    return (
        <Box position="relative" w="100%" h="100%">
            <AnimatePresence mode="wait">
                <MotionImage
                    key={currentImage}
                    src={currentImage}
                    alt={alt}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.8 }}
                    transition={{ duration: 0.15 }}
                />
            </AnimatePresence>
        </Box>
    );
};
