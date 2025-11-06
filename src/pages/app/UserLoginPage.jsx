import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    IconButton,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Logo from '../../components/common/Logo';

export default function UserLoginPage() {
    const fontSizeLevels = ['작게', '보통', '크게'];
    const fontSizes = ['1.5rem', '1.9rem', '2.5rem'];
    const inputHeights = ['70px', '85px', '110px'];

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [fontSizeLevel, setFontSizeLevel] = useState(1);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const handleShowToggle = () => setShow(!show);
    const handleIncrease = () => setFontSizeLevel((prev) => Math.min(prev + 1, 2));
    const handleDecrease = () => setFontSizeLevel((prev) => Math.max(prev - 1, 0));
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    const fs = fontSizes[fontSizeLevel];
    const inputH = inputHeights[fontSizeLevel];

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={isHighContrast ? '#000000' : 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 50%, #FFD4E0 100%)'}
            px={6}
            py={10}
            position="relative"
            overflow="hidden"
        >
            {/* 배경 장식 - 동동 떠다니는 하트들 */}
            {!isHighContrast && (
                <>
                    <Text
                        position="absolute"
                        top="10%"
                        left="10%"
                        fontSize="3rem"
                        opacity="0.3"
                        animation="float 6s ease-in-out infinite"
                    >
                        💝
                    </Text>
                    <Text
                        position="absolute"
                        top="20%"
                        right="15%"
                        fontSize="2.5rem"
                        opacity="0.3"
                        animation="float 5s ease-in-out infinite 1s"
                    >
                        🌸
                    </Text>
                    <Text
                        position="absolute"
                        bottom="15%"
                        left="12%"
                        fontSize="2rem"
                        opacity="0.3"
                        animation="float 7s ease-in-out infinite 2s"
                    >
                        ✨
                    </Text>
                    <Text
                        position="absolute"
                        bottom="25%"
                        right="10%"
                        fontSize="3rem"
                        opacity="0.3"
                        animation="float 8s ease-in-out infinite 1.5s"
                    >
                        💕
                    </Text>
                    <style>
                        {`
                            @keyframes float {
                                0%, 100% { transform: translateY(0px); }
                                50% { transform: translateY(-20px); }
                            }
                        `}
                    </style>
                </>
            )}

            {/* 메인 로그인 카드 */}
            <Box
                bg={isHighContrast ? '#000000' : 'white'}
                borderRadius="35px"
                boxShadow={
                    isHighContrast
                        ? '0 0 0 4px white, 0 20px 60px rgba(255,255,255,0.5)'
                        : '0 20px 60px rgba(255, 105, 180, 0.25)'
                }
                p={{ base: 10, md: 14 }}
                w="full"
                maxW="550px"
                border={isHighContrast ? '4px solid white' : '3px solid #FFB6D9'}
                position="relative"
                zIndex="1"
            >
                <VStack spacing={6} align="stretch">
                    {/* 헤더 */}
                    <Box textAlign="center">
                        <Flex justify="center" mb={3}>
                            <Logo
                                size={fontSizeLevel === 0 ? 'md' : fontSizeLevel === 1 ? 'lg' : 'xl'}
                                isHighContrast={isHighContrast}
                            />
                        </Flex>
                        <Text
                            fontSize={{ base: '2rem', md: '2.5rem' }}
                            fontWeight="800"
                            color={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                            mb={1}
                        >
                            환영해요! 🎉
                        </Text>
                        <Text fontSize={fs} color={isHighContrast ? '#CCCCCC' : '#FF9FC5'} fontWeight="600">
                            로그인하고 시작해볼까요?
                        </Text>
                    </Box>

                    {/* 아이디 */}
                    <FormControl>
                        <FormLabel
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                            fontWeight="700"
                            mb={2}
                        >
                            아이디 📧
                        </FormLabel>
                        <Input
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디를 입력해주세요"
                            size="lg"
                            fontSize={fs}
                            height={inputH}
                            borderRadius="25px"
                            bg={isHighContrast ? '#000000' : '#FFF0F5'}
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#FFB6D9'}
                            color={isHighContrast ? '#FFFFFF' : '#FF1493'}
                            fontWeight="600"
                            _placeholder={{
                                color: isHighContrast ? '#666666' : '#FFB6D9',
                            }}
                            _hover={{
                                borderColor: isHighContrast ? '#FFFF00' : '#FF69B4',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
                            }}
                            _focus={{
                                borderColor: isHighContrast ? '#FFFF00' : '#FF1493',
                                borderWidth: '3px',
                                boxShadow: isHighContrast
                                    ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                    : '0 0 0 4px rgba(255, 20, 147, 0.2)',
                                outline: 'none',
                            }}
                            transition="all 0.2s"
                        />
                    </FormControl>

                    {/* 비밀번호 */}
                    <FormControl>
                        <FormLabel
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                            fontWeight="700"
                            mb={2}
                        >
                            비밀번호 🔐
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력해주세요"
                                size="lg"
                                fontSize={fs}
                                height={inputH}
                                borderRadius="25px"
                                bg={isHighContrast ? '#000000' : '#FFF0F5'}
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#FFB6D9'}
                                color={isHighContrast ? '#FFFFFF' : '#FF1493'}
                                fontWeight="600"
                                _placeholder={{
                                    color: isHighContrast ? '#666666' : '#FFB6D9',
                                }}
                                _hover={{
                                    borderColor: isHighContrast ? '#FFFF00' : '#FF69B4',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
                                }}
                                _focus={{
                                    borderColor: isHighContrast ? '#FFFF00' : '#FF1493',
                                    borderWidth: '3px',
                                    boxShadow: isHighContrast
                                        ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                        : '0 0 0 4px rgba(255, 20, 147, 0.2)',
                                    outline: 'none',
                                }}
                                transition="all 0.2s"
                            />
                            <InputRightElement height="100%" pr={4}>
                                <IconButton
                                    variant="ghost"
                                    onClick={handleShowToggle}
                                    icon={
                                        show ? (
                                            <ViewOffIcon
                                                boxSize={6}
                                                color={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                                            />
                                        ) : (
                                            <ViewIcon boxSize={6} color={isHighContrast ? '#FFFFFF' : '#FF69B4'} />
                                        )
                                    }
                                    aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
                                    _hover={{
                                        bg: 'transparent',
                                        color: isHighContrast ? '#FFFF00' : '#FF1493',
                                        transform: 'scale(1.1)',
                                    }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    {/* 로그인 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#FF69B4'}
                        color={isHighContrast ? '#000000' : 'white'}
                        size="lg"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="800"
                        borderRadius="25px"
                        boxShadow="0 8px 25px rgba(255, 105, 180, 0.4)"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#FF1493'}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#FF1493',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 35px rgba(255, 105, 180, 0.5)',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#C71585',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        로그인하기 💖
                    </Button>

                    {/* 설정 영역 */}
                    <Box
                        mt={2}
                        pt={5}
                        borderTop="2px solid"
                        borderColor={isHighContrast ? '#333333' : '#FFE4E9'}
                    >
                        {/* 글자 크기 조절 */}
                        <HStack justify="space-between" mb={4}>
                            <HStack spacing={2}>
                                <Text fontSize="1.2rem">📝</Text>
                                <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : '#FF69B4'}>
                                    글자 크기
                                </Text>
                            </HStack>
                            <HStack spacing={2}>
                                <Button
                                    size="sm"
                                    onClick={handleDecrease}
                                    isDisabled={fontSizeLevel === 0}
                                    bg={isHighContrast ? '#FFFFFF' : '#FFE4E9'}
                                    color={isHighContrast ? '#000000' : '#FF69B4'}
                                    fontWeight="700"
                                    borderRadius="15px"
                                    fontSize="1.1rem"
                                    h="45px"
                                    w="45px"
                                    border="2px solid"
                                    borderColor={isHighContrast ? '#FFFFFF' : '#FFB6D9'}
                                    _hover={{
                                        bg: isHighContrast ? '#FFFF00' : '#FFB6D9',
                                        transform: 'scale(1.1)',
                                    }}
                                    _disabled={{
                                        opacity: 0.3,
                                    }}
                                >
                                    A-
                                </Button>
                                <Text
                                    fontSize="1.1rem"
                                    fontWeight="600"
                                    color={isHighContrast ? '#CCCCCC' : '#FF9FC5'}
                                    minW="50px"
                                    textAlign="center"
                                >
                                    {fontSizeLevels[fontSizeLevel]}
                                </Text>
                                <Button
                                    size="sm"
                                    onClick={handleIncrease}
                                    isDisabled={fontSizeLevel === 2}
                                    bg={isHighContrast ? '#FFFFFF' : '#FFE4E9'}
                                    color={isHighContrast ? '#000000' : '#FF69B4'}
                                    fontWeight="700"
                                    borderRadius="15px"
                                    fontSize="1.1rem"
                                    h="45px"
                                    w="45px"
                                    border="2px solid"
                                    borderColor={isHighContrast ? '#FFFFFF' : '#FFB6D9'}
                                    _hover={{
                                        bg: isHighContrast ? '#FFFF00' : '#FFB6D9',
                                        transform: 'scale(1.1)',
                                    }}
                                    _disabled={{
                                        opacity: 0.3,
                                    }}
                                >
                                    A+
                                </Button>
                            </HStack>
                        </HStack>

                        {/* 고대비 모드 */}
                        <HStack justify="space-between">
                            <HStack spacing={2}>
                                <Text fontSize="1.2rem">{isHighContrast ? '☀️' : '🌙'}</Text>
                                <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : '#FF69B4'}>
                                    {isHighContrast ? '고대비 모드' : '일반 모드'}
                                </Text>
                            </HStack>
                            <Button
                                size="sm"
                                onClick={toggleHighContrast}
                                bg={isHighContrast ? '#FFD700' : '#FF9FC5'}
                                color={isHighContrast ? '#000000' : 'white'}
                                fontWeight="700"
                                borderRadius="15px"
                                px={5}
                                h="45px"
                                fontSize="1.1rem"
                                border="2px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#FF69B4'}
                                _hover={{
                                    bg: isHighContrast ? '#FFEB3B' : '#FF69B4',
                                    transform: 'scale(1.05)',
                                }}
                                transition="all 0.2s"
                            >
                                {isHighContrast ? '끄기' : '켜기'}
                            </Button>
                        </HStack>
                    </Box>
                </VStack>
            </Box>
        </Flex>
    );
}
