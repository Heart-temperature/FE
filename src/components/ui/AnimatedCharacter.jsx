import React, { useEffect, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';

// Grandpa (다복이) 이미지 import - 누끼 버전
import GrandpaClosedMouthEyesOpen from '../common/close_m-removebg-preview.png';
import GrandpaClosedMouthEyesClosed from '../common/close_m_e-removebg-preview.png';
import GrandpaOpenMouthEyesClosed from '../common/open_m-removebg-preview.png';
import GrandpaOpenMouthEyesOpen from '../common/open_m_e-removebg-preview.png';

// Dajeong (다정이) 이미지 import
import DajeongClosed from '../common/img2.png';
import DajeongOpen from '../common/img2_openmouth.png';

/**
 * 정교한 립싱크 + 눈 깜빡임 애니메이션 컴포넌트
 * 이미지를 겹쳐서 배치하고 opacity만 조절하여 흔들림 없이 자연스럽게
 * @param {Object} props
 * @param {string} props.alt - 이미지 alt 텍스트
 * @param {boolean} props.isTalking - 말하는 중인지 여부
 * @param {string} props.characterType - 'dabok' (grandpa) 또는 'dajeong'
 */
export const AnimatedCharacter = ({ alt, isTalking = false, characterType = 'dajeong' }) => {
    const [currentImage, setCurrentImage] = useState('');

    // Grandpa 애니메이션 로직
    useEffect(() => {
        if (characterType !== 'dabok') return;

        // 말하지 않을 때
        if (!isTalking) {
            setCurrentImage(GrandpaClosedMouthEyesOpen);

            // 랜덤하게 눈 깜빡임 (2-5초마다)
            const blinkInterval = setInterval(() => {
                setCurrentImage(GrandpaClosedMouthEyesClosed);
                setTimeout(() => {
                    setCurrentImage(GrandpaClosedMouthEyesOpen);
                }, 150); // 150ms 동안 눈 감음
            }, 2000 + Math.random() * 3000);

            return () => clearInterval(blinkInterval);
        }

        // 말할 때 정교한 애니메이션
        let timeoutId;
        let blinkTimeoutId;

        const talkingStates = [
            { image: GrandpaClosedMouthEyesOpen, duration: 200 },
            { image: GrandpaOpenMouthEyesOpen, duration: 300 },
            { image: GrandpaClosedMouthEyesOpen, duration: 200 },
            { image: GrandpaOpenMouthEyesOpen, duration: 250 },
        ];

        let stateIndex = 0;
        let shouldBlink = false;

        const animateTalking = () => {
            // 20% 확률로 눈 깜빡임
            if (Math.random() < 0.2) {
                shouldBlink = true;
            }

            const currentState = talkingStates[stateIndex % talkingStates.length];
            let imageToShow = currentState.image;

            // 눈 깜빡임 적용
            if (shouldBlink) {
                if (imageToShow === GrandpaClosedMouthEyesOpen) {
                    imageToShow = GrandpaClosedMouthEyesClosed;
                } else if (imageToShow === GrandpaOpenMouthEyesOpen) {
                    imageToShow = GrandpaOpenMouthEyesClosed;
                }

                // 깜빡임 후 다시 눈 뜸
                blinkTimeoutId = setTimeout(() => {
                    shouldBlink = false;
                }, 150);
            }

            setCurrentImage(imageToShow);
            stateIndex++;

            const randomVariation = Math.random() * 100 - 50; // -50ms ~ +50ms 변화
            timeoutId = setTimeout(animateTalking, currentState.duration + randomVariation);
        };

        animateTalking();

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(blinkTimeoutId);
        };
    }, [isTalking, characterType]);

    // Dajeong 애니메이션 로직 (기존 방식)
    useEffect(() => {
        if (characterType !== 'dajeong') return;

        if (!isTalking) {
            setCurrentImage(DajeongClosed);
            return;
        }

        let timeoutId;
        let isOpen = false;

        const animateTalking = () => {
            isOpen = !isOpen;
            setCurrentImage(isOpen ? DajeongOpen : DajeongClosed);
            const delay = 200 + Math.random() * 300;
            timeoutId = setTimeout(animateTalking, delay);
        };

        animateTalking();

        return () => clearTimeout(timeoutId);
    }, [isTalking, characterType]);

    // Grandpa용 겹침 레이어 방식 (흔들림 방지)
    if (characterType === 'dabok') {
        return (
            <Box position="relative" w="500px" h="500px" maxW="100%" maxH="100%" margin="0 auto">
                {/* 모든 이미지를 정확히 같은 위치에 겹쳐서 배치 */}
                <Image
                    src={GrandpaClosedMouthEyesOpen}
                    alt={alt}
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    opacity={currentImage === GrandpaClosedMouthEyesOpen ? 1 : 0}
                    transition="opacity 0.05s ease-in-out"
                    pointerEvents="none"
                />
                <Image
                    src={GrandpaClosedMouthEyesClosed}
                    alt={alt}
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    opacity={currentImage === GrandpaClosedMouthEyesClosed ? 1 : 0}
                    transition="opacity 0.05s ease-in-out"
                    pointerEvents="none"
                />
                <Image
                    src={GrandpaOpenMouthEyesClosed}
                    alt={alt}
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    opacity={currentImage === GrandpaOpenMouthEyesClosed ? 1 : 0}
                    transition="opacity 0.05s ease-in-out"
                    pointerEvents="none"
                />
                <Image
                    src={GrandpaOpenMouthEyesOpen}
                    alt={alt}
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    opacity={currentImage === GrandpaOpenMouthEyesOpen ? 1 : 0}
                    transition="opacity 0.05s ease-in-out"
                    pointerEvents="none"
                />
            </Box>
        );
    }

    // Dajeong용 (기존 방식 유지)
    return (
        <Box position="relative" w="100%" h="100%">
            <Image
                src={DajeongClosed}
                alt={alt}
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                objectFit="contain"
                opacity={currentImage === DajeongClosed ? 1 : 0}
                transition="opacity 0.1s ease-in-out"
            />
            <Image
                src={DajeongOpen}
                alt={alt}
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                objectFit="contain"
                opacity={currentImage === DajeongOpen ? 1 : 0}
                transition="opacity 0.1s ease-in-out"
            />
        </Box>
    );
};
