import React, { useState } from 'react';
import { Box, Button, Flex, Text, VStack, HStack, Image, Divider, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import DajeongLogo from '../../components/common/image.png';
import Img1 from '../../components/common/img1.png';
import Img2 from '../../components/common/img2.png';
import { AnimatedCharacter } from '../../components/ui';

const MotionBox = motion(Box);

export default function MainPage() {
    const fontSizeLevels = ['작게', '보통', '크게'];
    const fontSizes = ['1.5rem', '1.9rem', '2.5rem']; // 로그인 페이지와 동일
    const callButtonHeights = ['70px', '85px', '110px']; // 통화 시작 버튼 (로그인 페이지 inputHeights와 동일)
    const settingButtonHeights = ['50px', '55px', '65px']; // 설정 버튼 (로그인 페이지 buttonHeights와 동일)
    const arrowButtonSizes = ['45px', '55px', '65px']; // 화살표 버튼 크기 (직접 지정)
    const arrowIconSizes = [6, 8, 10]; // 화살표 아이콘 크기
    const aiImageSizes = ['160px', '200px', '240px']; // AI 모델 이미지 크기

    const [fontSizeLevel, setFontSizeLevel] = useState(1);
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [currentModelIndex, setCurrentModelIndex] = useState(0);
    const [isTalking, setIsTalking] = useState(false); // AI가 말하는 중인지 여부

    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    const fs = fontSizes[fontSizeLevel];
    const callBtnH = callButtonHeights[fontSizeLevel];
    const settingBtnH = settingButtonHeights[fontSizeLevel];
    const arrowBtnSize = arrowButtonSizes[fontSizeLevel];
    const arrowIconSize = arrowIconSizes[fontSizeLevel];
    const aiImgSize = aiImageSizes[fontSizeLevel];

    // AI 모델 데이터
    const aiModels = [
        {
            id: 1,
            name: '다정이',
            image: Img2,
            characterType: 'dajeong',
            color: isHighContrast ? '#FFD700' : '#2196F3',
            description: '친근하고 활기찬 음성',
        },
        {
            id: 2,
            name: '다복이',
            image: Img1,
            characterType: 'dabok',
            color: isHighContrast ? '#FFD700' : '#4CAF50',
            description: '차분하고 안정된 음성',
        },
    ];

    const currentModel = aiModels[currentModelIndex];

    const handlePrevModel = () => {
        setCurrentModelIndex((prev) => (prev === 0 ? aiModels.length - 1 : prev - 1));
    };

    const handleNextModel = () => {
        setCurrentModelIndex((prev) => (prev === aiModels.length - 1 ? 0 : prev + 1));
    };

    const handleStartCall = () => {
        console.log(`통화 시작: ${currentModel.name}`);
        // 통화 시작/종료 토글 (테스트용)
        setIsTalking((prev) => !prev);
        // TODO: 실제 통화 시작 로직 구현
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : '#F5F7FA'} px={6} py={10}>
            {/* 메인 카드 */}
            <Box
                bg={isHighContrast ? '#000000' : 'white'}
                borderRadius="20px"
                boxShadow={
                    isHighContrast
                        ? '0 0 0 4px white, 0 20px 60px rgba(255,255,255,0.5)'
                        : '0 10px 40px rgba(33, 150, 243, 0.15)'
                }
                p={{ base: 10, md: 14 }}
                w="full"
                maxW="550px"
                border={isHighContrast ? '4px solid white' : 'none'}
            >
                <VStack spacing={6} align="stretch">
                    {/* 헤더 */}
                    <Box textAlign="center" mb={2}>
                        <Image src={DajeongLogo} alt="다정이 로고" maxW="230px" mx="auto" mb={4} />
                        <Divider borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'} borderWidth="2px solid" mb={2} />
                    </Box>

                    {/* AI 모델 선택 섹션 */}
                    <Box>
                        <Text
                            fontSize={fs}
                            fontWeight="700"
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            mb={4}
                            textAlign="center"
                        >
                            통화할 상대를 선택하세요
                        </Text>

                        {/* AI 모델 슬라이더 */}
                        <Box position="relative" my={6}>
                            <HStack justify="space-between" align="center" spacing={4}>
                                {/* 이전 버튼 */}
                                <IconButton
                                    icon={<ChevronLeftIcon boxSize={arrowIconSize} />}
                                    aria-label="이전 모델"
                                    onClick={handlePrevModel}
                                    w={arrowBtnSize}
                                    h={arrowBtnSize}
                                    minW={arrowBtnSize}
                                    bg={isHighContrast ? '#FFFFFF' : '#E3F2FD'}
                                    color={isHighContrast ? '#000000' : '#2196F3'}
                                    borderRadius="50%"
                                    border={isHighContrast ? '3px solid white' : 'none'}
                                    _hover={{
                                        bg: isHighContrast ? '#FFEB3B' : '#64B5F6',
                                        transform: 'scale(1.1)',
                                    }}
                                    _active={{
                                        transform: 'scale(0.95)',
                                    }}
                                    transition="all 0.2s"
                                />

                                {/* AI 모델 표시 영역 */}
                                <Box flex="1" textAlign="center" py={8}>
                                    <MotionBox
                                        key={currentModel.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <VStack spacing={4}>
                                            {/* AI 모델 이미지 */}
                                            <Box
                                                w={aiImgSize}
                                                h={aiImgSize}
                                                borderRadius="full"
                                                bg={isHighContrast ? '#000000' : 'white'}
                                                border={`5px solid ${currentModel.color}`}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                boxShadow={
                                                    isHighContrast
                                                        ? '0 0 20px rgba(255, 215, 0, 0.5)'
                                                        : '0 8px 20px rgba(0, 0, 0, 0.1)'
                                                }
                                                overflow="hidden"
                                            >
                                                <AnimatedCharacter
                                                    alt={currentModel.name}
                                                    isTalking={isTalking}
                                                    characterType={currentModel.characterType}
                                                />
                                            </Box>

                                            {/* 모델 이름 */}
                                            <Text
                                                fontSize={fs}
                                                fontWeight="700"
                                                color={isHighContrast ? '#FFFFFF' : currentModel.color}
                                            >
                                                {currentModel.name}
                                            </Text>

                                            {/* 모델 설명 */}
                                            <Text
                                                fontSize={fs}
                                                color={isHighContrast ? '#e2e2e2' : '#666666'}
                                                fontWeight="500"
                                            >
                                                {currentModel.description}
                                            </Text>
                                        </VStack>
                                    </MotionBox>
                                </Box>

                                {/* 다음 버튼 */}
                                <IconButton
                                    icon={<ChevronRightIcon boxSize={arrowIconSize} />}
                                    aria-label="다음 모델"
                                    onClick={handleNextModel}
                                    w={arrowBtnSize}
                                    h={arrowBtnSize}
                                    minW={arrowBtnSize}
                                    bg={isHighContrast ? '#FFFFFF' : '#E3F2FD'}
                                    color={isHighContrast ? '#000000' : '#2196F3'}
                                    borderRadius="50%"
                                    border={isHighContrast ? '3px solid white' : 'none'}
                                    _hover={{
                                        bg: isHighContrast ? '#FFEB3B' : '#64B5F6',
                                        transform: 'scale(1.1)',
                                    }}
                                    _active={{
                                        transform: 'scale(0.95)',
                                    }}
                                    transition="all 0.2s"
                                />
                            </HStack>

                            {/* 하단 인디케이터 */}
                            <HStack justify="center" mt={4} spacing={3}>
                                {aiModels.map((model, index) => (
                                    <Box
                                        key={model.id}
                                        w={index === currentModelIndex ? '12px' : '8px'}
                                        h={index === currentModelIndex ? '12px' : '8px'}
                                        borderRadius="full"
                                        bg={
                                            index === currentModelIndex
                                                ? isHighContrast
                                                    ? '#FFD700'
                                                    : '#2196F3'
                                                : isHighContrast
                                                ? '#666666'
                                                : '#BDBDBD'
                                        }
                                        cursor="pointer"
                                        onClick={() => setCurrentModelIndex(index)}
                                        transition="all 0.2s"
                                        _hover={{
                                            transform: 'scale(1.2)',
                                        }}
                                    />
                                ))}
                            </HStack>
                        </Box>
                    </Box>

                    {/* 통화 시작 버튼 */}
                    <Button
                        bg={isTalking ? (isHighContrast ? '#FF5252' : '#F44336') : (isHighContrast ? '#FFD700' : '#2196F3')}
                        color={isHighContrast ? '#000000' : 'white'}
                        size="lg"
                        height={callBtnH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        boxShadow="0 4px 14px rgba(33, 150, 243, 0.3)"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        mt={2}
                        onClick={handleStartCall}
                        _hover={{
                            bg: isTalking ? (isHighContrast ? '#FF1744' : '#E53935') : (isHighContrast ? '#FFEB3B' : '#1976D2'),
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                        }}
                        _active={{
                            bg: isTalking ? (isHighContrast ? '#D50000' : '#C62828') : (isHighContrast ? '#FFC107' : '#1565C0'),
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        {isTalking ? '통화 종료' : '통화 시작'}
                    </Button>

                    {/* 설정 영역 */}
                    <Box mt={4} pt={6} borderTop="2px solid" borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'}>
                        <Text
                            fontSize={fs}
                            fontWeight="700"
                            color={isHighContrast ? '#FFFFFF' : '#000000ff'}
                            mb={5}
                            textAlign="center"
                        >
                            화면 설정
                        </Text>

                        {/* 글자 크기 조절 */}
                        <HStack justify="space-between" mb={5}>
                            <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : '#000000'}>
                                글자 크기
                            </Text>
                            <HStack spacing={0}>
                                <Button
                                    size="md"
                                    onClick={() => setFontSizeLevel(0)}
                                    bg={
                                        fontSizeLevel === 0
                                            ? isHighContrast
                                                ? '#FFD700'
                                                : '#2196F3'
                                            : isHighContrast
                                            ? '#FFFFFF'
                                            : '#E3F2FD'
                                    }
                                    color={
                                        fontSizeLevel === 0
                                            ? isHighContrast
                                                ? '#000000'
                                                : 'white'
                                            : isHighContrast
                                            ? '#000000'
                                            : '#1976D2'
                                    }
                                    fontWeight="700"
                                    borderRadius="10px 0 0 10px"
                                    minW="70px"
                                    h={settingBtnH}
                                    fontSize="1.4rem"
                                    border={isHighContrast ? '2px solid white' : 'none'}
                                    borderRight={isHighContrast ? 'none' : '1px solid #90CAF9'}
                                    _hover={{
                                        bg:
                                            fontSizeLevel === 0
                                                ? isHighContrast
                                                    ? '#FFD700'
                                                    : '#2196F3'
                                                : isHighContrast
                                                ? '#FFEB3B'
                                                : '#64B5F6',
                                        transform: 'scale(1.05)',
                                    }}
                                    transition="all 0.2s"
                                >
                                    작게
                                </Button>
                                <Button
                                    size="md"
                                    onClick={() => setFontSizeLevel(1)}
                                    bg={
                                        fontSizeLevel === 1
                                            ? isHighContrast
                                                ? '#FFD700'
                                                : '#2196F3'
                                            : isHighContrast
                                            ? '#FFFFFF'
                                            : '#E3F2FD'
                                    }
                                    color={
                                        fontSizeLevel === 1
                                            ? isHighContrast
                                                ? '#000000'
                                                : 'white'
                                            : isHighContrast
                                            ? '#000000'
                                            : '#1976D2'
                                    }
                                    fontWeight="700"
                                    borderRadius="0"
                                    minW="70px"
                                    h={settingBtnH}
                                    fontSize="1.4rem"
                                    border={isHighContrast ? '2px solid white' : 'none'}
                                    borderRight={isHighContrast ? 'none' : '1px solid #90CAF9'}
                                    borderLeft={isHighContrast ? 'none' : '1px solid #90CAF9'}
                                    _hover={{
                                        bg:
                                            fontSizeLevel === 1
                                                ? isHighContrast
                                                    ? '#FFD700'
                                                    : '#2196F3'
                                                : isHighContrast
                                                ? '#FFEB3B'
                                                : '#64B5F6',
                                        transform: 'scale(1.05)',
                                    }}
                                    transition="all 0.2s"
                                >
                                    보통
                                </Button>
                                <Button
                                    size="md"
                                    onClick={() => setFontSizeLevel(2)}
                                    bg={
                                        fontSizeLevel === 2
                                            ? isHighContrast
                                                ? '#FFD700'
                                                : '#2196F3'
                                            : isHighContrast
                                            ? '#FFFFFF'
                                            : '#E3F2FD'
                                    }
                                    color={
                                        fontSizeLevel === 2
                                            ? isHighContrast
                                                ? '#000000'
                                                : 'white'
                                            : isHighContrast
                                            ? '#000000'
                                            : '#1976D2'
                                    }
                                    fontWeight="700"
                                    borderRadius="0 10px 10px 0"
                                    minW="70px"
                                    h={settingBtnH}
                                    fontSize="1.4rem"
                                    border={isHighContrast ? '2px solid white' : 'none'}
                                    borderLeft={isHighContrast ? 'none' : '1px solid #90CAF9'}
                                    _hover={{
                                        bg:
                                            fontSizeLevel === 2
                                                ? isHighContrast
                                                    ? '#FFD700'
                                                    : '#2196F3'
                                                : isHighContrast
                                                ? '#FFEB3B'
                                                : '#64B5F6',
                                        transform: 'scale(1.05)',
                                    }}
                                    transition="all 0.2s"
                                >
                                    크게
                                </Button>
                            </HStack>
                        </HStack>

                        {/* 고대비 모드 */}
                        <HStack justify="space-between">
                            <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : '#000000'}>
                                선명한 화면
                            </Text>
                            <Button
                                size="md"
                                onClick={toggleHighContrast}
                                bg={isHighContrast ? '#FFD700' : '#2196F3'}
                                color={isHighContrast ? '#000000' : 'white'}
                                fontWeight="700"
                                borderRadius="10px"
                                minW="210px"
                                h={settingBtnH}
                                fontSize={fs}
                                border={isHighContrast ? '2px solid white' : 'none'}
                                _hover={{
                                    bg: isHighContrast ? '#FFEB3B' : '#1976D2',
                                    transform: 'scale(1.05)',
                                }}
                                transition="all 0.2s"
                            >
                                {isHighContrast ? '켜짐' : '꺼짐'}
                            </Button>
                        </HStack>
                    </Box>
                </VStack>
            </Box>
        </Flex>
    );
}
