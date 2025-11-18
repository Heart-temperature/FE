import React, { useState } from 'react';
import { Box, Button, Flex, Text, VStack, HStack, Image, Divider, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DajeongLogo from '../../assets/image.png';
import Img1 from '../../assets/img1.png';
import Img2 from '../../assets/img2.png';
import { ROUTES } from '../../routes';
import useAppSettings from '../../hooks/useAppSettings';

const MotionBox = motion(Box);

export default function MainPage() {
    const navigate = useNavigate();
    const {
        fontSizeLevel,
        setFontSizeLevel,
        isHighContrast,
        toggleHighContrast,
        fs,
        arrowBtnSize,
        arrowIconSize,
        inputH,
        imgCircleHeight,
    } = useAppSettings();

    const [currentModelIndex, setCurrentModelIndex] = useState(0);
    const [isPolite, setIsPolite] = useState(true);

    // AI 모델 데이터
    const aiModels = [
        {
            id: 1,
            name: '다정이',
            image: Img2,
            characterType: 'dajeong',
            color: isHighContrast ? '#FFD700' : '#2196F3',
            description: '따뜻하게 듣는 30세 여성 상담사',
        },
        {
            id: 2,
            name: '다복이',
            image: Img1,
            characterType: 'dabok',
            color: isHighContrast ? '#FFD700' : '#4CAF50',
            description: '조용하고 외로운 75세 공장 출신 노인.',
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
        console.log('📞 CallPage로 이동 시작...');
        console.log('   경로:', ROUTES.USER_APP_CALL);
        console.log('   캐릭터:', currentModel);
        console.log('   정중함:', isPolite);
        
        // CallPage로 이동하면서 선택된 캐릭터 정보 및 고대비 모드 전달
        const navigationState = {
            character: {
                name: currentModel.name,
                characterType: currentModel.characterType,
                color: currentModel.color,
            },
            isHighContrast: isHighContrast,
            politeness: isPolite
        };
        
        console.log('   전달할 state:', navigationState);
        
        try {
            navigate(ROUTES.USER_APP_CALL, {
                state: navigationState,
                replace: false, // 히스토리에 추가
            });
            console.log('✅ navigate 호출 완료');
        } catch (error) {
            console.error('❌ navigate 오류:', error);
        }
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
                                            overflow="hidden"
                                        >
                                            <Image
                                                position="relative"
                                                src={currentModel.image}
                                                alt={currentModel.name}
                                                w="130%"
                                                h="130%"
                                                objectFit="contain"
                                                top="-15px"
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
                                    w={index === currentModelIndex ? '20px' : '20px'}
                                    h={index === currentModelIndex ? '20px' : '12px'}
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

                    <HStack spacing={0} justify="center" w="100%" mt={3}>
                        <Button
                            onClick={() => setIsPolite(true)}
                            bg={
                                isPolite
                                    ? isHighContrast
                                        ? '#FFD700'
                                        : '#2196F3'
                                    : isHighContrast
                                    ? '#FFFFFF'
                                    : '#E3F2FD'
                            }
                            color={isPolite ? (isHighContrast ? '#000000' : 'white') : '#000000'}
                            fontSize={fs}
                            h={inputH}
                            flex="1"
                            fontWeight="700"
                            borderRadius="15px 0 0 15px"
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                            borderRight="none"
                            _hover={{
                                bg: isPolite
                                    ? isHighContrast
                                        ? '#FFEB3B'
                                        : '#1976D2'
                                    : isHighContrast
                                    ? '#FFD700'
                                    : '#2196F3',
                                transform: 'translateY(-2px)',
                                boxShadow: isHighContrast
                                    ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                    : '0 6px 20px rgba(33, 150, 243, 0.4)',
                            }}
                            _active={{
                                bg: isHighContrast ? '#FFC107' : '#1565C0',
                                transform: 'translateY(0)',
                            }}
                            transition="all 0.2s"
                        >
                            존댓말
                        </Button>
                        <Button
                            onClick={() => setIsPolite(false)}
                            bg={
                                !isPolite
                                    ? isHighContrast
                                        ? '#FFD700'
                                        : '#2196F3'
                                    : isHighContrast
                                    ? '#FFFFFF'
                                    : '#E3F2FD'
                            }
                            color={!isPolite ? (isHighContrast ? '#000000' : 'white') : '#000000'}
                            fontSize={fs}
                            h={inputH}
                            flex="1"
                            fontWeight="700"
                            borderRadius="0 15px 15px 0"
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                            borderLeft="none"
                            _hover={{
                                bg: !isPolite
                                    ? isHighContrast
                                        ? '#FFEB3B'
                                        : '#1976D2'
                                    : isHighContrast
                                    ? '#FFD700'
                                    : '#2196F3',
                                transform: 'translateY(-2px)',
                                boxShadow: isHighContrast
                                    ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                    : '0 6px 20px rgba(33, 150, 243, 0.4)',
                            }}
                            _active={{
                                bg: isHighContrast ? '#FFC107' : '#1565C0',
                                transform: 'translateY(0)',
                            }}
                            transition="all 0.2s"
                        >
                            반말
                        </Button>
                    </HStack>

                    {/* 통화 시작 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#4CAF50'}
                        color={isHighContrast ? '#000000' : 'white'}
                        w="100%"
                        mx="auto"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#2E7D32'}
                        mt={2}
                        onClick={handleStartCall}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#388E3C',
                            transform: 'translateY(-2px)',
                            boxShadow: isHighContrast
                                ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                : '0 6px 20px rgba(76, 175, 80, 0.4)',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#2E7D32',
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
                        <HStack spacing={0} justify="center" mb={6} w="100%">
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
                                color={fontSizeLevel === 0 ? (isHighContrast ? '#000000' : 'white') : '#000000'}
                                fontWeight="700"
                                borderRadius="15px 0 0 15px"
                                h={inputH}
                                flex="1"
                                fontSize={fs}
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                                borderRight="none"
                                _hover={{
                                    bg:
                                        fontSizeLevel === 0
                                            ? isHighContrast
                                                ? '#FFEB3B'
                                                : '#1976D2'
                                            : isHighContrast
                                            ? '#FFD700'
                                            : '#2196F3',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isHighContrast
                                        ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                        : '0 6px 20px rgba(33, 150, 243, 0.4)',
                                }}
                                _active={{
                                    bg: isHighContrast ? '#FFC107' : '#1565C0',
                                    transform: 'translateY(0)',
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
                                color={fontSizeLevel === 1 ? (isHighContrast ? '#000000' : 'white') : '#000000'}
                                fontWeight="700"
                                borderRadius="0"
                                h={inputH}
                                flex="1"
                                fontSize={fs}
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                                borderRight="none"
                                borderLeft="none"
                                _hover={{
                                    bg:
                                        fontSizeLevel === 1
                                            ? isHighContrast
                                                ? '#FFEB3B'
                                                : '#1976D2'
                                            : isHighContrast
                                            ? '#FFD700'
                                            : '#2196F3',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isHighContrast
                                        ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                        : '0 6px 20px rgba(33, 150, 243, 0.4)',
                                }}
                                _active={{
                                    bg: isHighContrast ? '#FFC107' : '#1565C0',
                                    transform: 'translateY(0)',
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
                                color={fontSizeLevel === 2 ? (isHighContrast ? '#000000' : 'white') : '#000000'}
                                fontWeight="700"
                                borderRadius="0 15px 15px 0"
                                h={inputH}
                                flex="1"
                                fontSize={fs}
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                                borderLeft="none"
                                _hover={{
                                    bg:
                                        fontSizeLevel === 2
                                            ? isHighContrast
                                                ? '#FFEB3B'
                                                : '#1976D2'
                                            : isHighContrast
                                            ? '#FFD700'
                                            : '#2196F3',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isHighContrast
                                        ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                        : '0 6px 20px rgba(33, 150, 243, 0.4)',
                                }}
                                _active={{
                                    bg: isHighContrast ? '#FFC107' : '#1565C0',
                                    transform: 'translateY(0)',
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
                                borderRadius="15px"
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                                h={inputH}
                                w="100%"
                                fontSize={fs}
                                _hover={{
                                    bg: isHighContrast ? '#FFEB3B' : '#1976D2',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isHighContrast
                                        ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                        : '0 6px 20px rgba(33, 150, 243, 0.4)',
                                }}
                                _active={{
                                    bg: isHighContrast ? '#FFC107' : '#1565C0',
                                    transform: 'translateY(0)',
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
