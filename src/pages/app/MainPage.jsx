import React, { useState } from 'react';
import { Box, Button, Flex, Text, VStack, HStack, Image, Divider, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DajeongLogo from '../../components/common/image.png';
import Img1 from '../../components/common/img1.png';
import Img2 from '../../components/common/img2.png';
import { ROUTES } from '../../routes';

const MotionBox = motion(Box);

export default function MainPage() {
    const navigate = useNavigate();
    const fontSizeLevels = ['작게', '보통', '크게'];
    const fontSizes = ['1.5rem', '1.9rem', '2.5rem']; // 로그인 페이지와 동일
    const callButtonHeights = ['70px', '85px', '110px']; // 통화 시작 버튼 (로그인 페이지 inputHeights와 동일)
    const buttonHeights = ['50px', '55px', '65px'];
    const arrowButtonSizes = ['30px', '40px', '50px']; // 화살표 버튼 크기 (직접 지정)
    const arrowIconSizes = [6, 8, 10]; // 화살표 아이콘 크기
    const aiImageSizes = ['160px', '200px', '240px']; // AI 모델 이미지 크기
    const imageCircleSizes = ['130', '150', '170']; // 이미지 원형 배경 크기

    const [fontSizeLevel, setFontSizeLevel] = useState(1);
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [currentModelIndex, setCurrentModelIndex] = useState(0);
    const [isPolite, setIsPolite] = useState(true); // true = 존댓말, false = 반말

    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);
    const handleToggle = () => {
        setIsPolite((prev) => !prev);
        // 🔹 실제로는 여기서 tone 상태를 전역/로컬 저장소에 저장할 수도 있음
    };

    const fs = fontSizes[fontSizeLevel];
    const callBtnH = callButtonHeights[fontSizeLevel];
    const arrowBtnSize = arrowButtonSizes[fontSizeLevel];
    const arrowIconSize = arrowIconSizes[fontSizeLevel];
    const aiImgSize = aiImageSizes[fontSizeLevel];
    const btnH = buttonHeights[fontSizeLevel];
    const imgCircleHeight = imageCircleSizes[fontSizeLevel];
    const imgCircleWidth = `${imageCircleSizes[fontSizeLevel] + 5} px`;

    // AI 모델 데이터
    const aiModels = [
        {
            id: 1,
            name: '다정이',
            image: Img2,
            characterType: 'dajeong',
            color: isHighContrast ? '#FFD700' : '#2196F3',
            description: '친근하고 활기찬 목소리',
        },
        {
            id: 2,
            name: '다복이',
            image: Img1,
            characterType: 'dabok',
            color: isHighContrast ? '#FFD700' : '#4CAF50',
            description: '차분하고 안정된 목소리',
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
        // CallPage로 이동하면서 선택된 캐릭터 정보 및 고대비 모드 전달
        navigate(ROUTES.USER_APP_CALL, {
            state: {
                character: {
                    name: currentModel.name,
                    characterType: currentModel.characterType,
                    color: currentModel.color,
                },
                isHighContrast: isHighContrast,
            },
        });
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3}>
            {/* 메인 로그인 카드 */}
            <Box p={{ base: 5, md: 14 }} w="full" maxW="530px">
                <VStack spacing={9} align="stretch">
                    {/* 헤더 */}
                    <Box mb={2} pb={2} borderBottom="2px solid" borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'}>
                        <Image src={DajeongLogo} alt="다정이 로고" maxW="200px" mx="auto" />
                    </Box>

                    {/* AI 모델 선택 섹션 */}
                    <Text
                        fontSize={fs}
                        fontWeight="700"
                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                        textAlign="left"
                        w="fit-content"
                        mx="auto"
                    >
                        통화할 상대를 선택하세요
                    </Text>

                    {/* AI 모델 슬라이더 */}
                    <Box position="relative" mx="auto">
                        <HStack justify="space-between" align="center">
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
                            <Box textAlign="center" py={8} w="70%">
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
                                            w={imgCircleWidth}
                                            h={imgCircleHeight}
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
                                        >
                                            <Image
                                                position="relative"
                                                src={currentModel.image}
                                                alt={currentModel.name}
                                                w="100%"
                                                h="100%"
                                                objectFit="contain"
                                                top="8px"
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

                        {/* 모델 설명 */}
                        <Text fontSize={fs} color={isHighContrast ? '#e2e2e2' : '#666666'} fontWeight="500">
                            {currentModel.description}
                        </Text>

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

                    <Button
                        onClick={() => setIsPolite(!isPolite)}
                        bg={isHighContrast ? '#FFFFFF' : isPolite ? '#2196F3' : '#E0E0E0'}
                        color={isHighContrast ? '#000000' : isPolite ? 'white' : '#333'}
                        fontSize={fs}
                        h={btnH}
                        mt={3}
                        fontWeight="600"
                        borderRadius="10px"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : isPolite ? '#1976D2' : '#BDBDBD',
                        }}
                        transition="all 0.2s"
                    >
                        {isPolite ? '존댓말 모드 ON' : '존댓말 모드 OFF'}
                    </Button>

                    {/* 통화 시작 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#2196F3'}
                        color={isHighContrast ? '#000000' : 'white'}
                        w="90%"
                        mx="auto"
                        height={callBtnH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        boxShadow="0 4px 14px rgba(33, 150, 243, 0.3)"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        mt={2}
                        onClick={handleStartCall}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#1976D2',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#1565C0',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        통화 시작
                    </Button>

                    <Box my={5} pt={7} borderTop="2px solid" borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'}>
                        {/* 글자 크기 조절 */}
                        <Text
                            fontSize={fs}
                            fontWeight="700"
                            color={isHighContrast ? '#FFFFFF' : '#000000ff'}
                            mb={5}
                            textAlign="center"
                        >
                            글자 크기
                        </Text>
                        <HStack spacing={0} justify="center" mb={6}>
                            <Button
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
                                h={btnH}
                                fontSize="1.9rem"
                                border={isHighContrast ? '2px solid black' : '2px solid #90CAF9'}
                                borderRight={isHighContrast ? '1px solid black' : '1px solid #90CAF9'}
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
                                h={btnH}
                                fontSize="1.9rem"
                                border={isHighContrast ? '2px solid black' : '2px solid #90CAF9'}
                                borderRight={isHighContrast ? '1px solid black' : '1px solid #90CAF9'}
                                borderLeft={isHighContrast ? '1px solid black' : '1px solid #90CAF9'}
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
                                h={btnH}
                                fontSize="1.9rem"
                                border={isHighContrast ? '2px solid black' : '2px solid #90CAF9'}
                                borderLeft={isHighContrast ? '1px solid black' : '1px solid #90CAF9'}
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

                        {/* 고대비 모드 */}
                        <Text
                            fontSize={fs}
                            fontWeight="700"
                            color={isHighContrast ? '#FFFFFF' : '#000000ff'}
                            mb={5}
                            textAlign="center"
                        >
                            선명한 화면
                        </Text>
                        <HStack justify="center">
                            <Button
                                size="md"
                                onClick={toggleHighContrast}
                                bg={isHighContrast ? '#FFD700' : '#2196F3'}
                                color={isHighContrast ? '#000000' : 'white'}
                                fontWeight="700"
                                borderRadius="10px"
                                minW="210px"
                                h={btnH}
                                fontSize={fs}
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
