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
    const [fontSizeLevel, setFontSizeLevel] = useState(1); // 보통
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
            bg={isHighContrast ? '#000000' : '#E3F2FD'}
            px={6}
            py={10}
        >
            {/* 메인 로그인 카드 */}
            <Box
                bg={isHighContrast ? '#000000' : 'white'}
                borderRadius="30px"
                boxShadow={isHighContrast ? '0 0 0 4px white, 0 20px 60px rgba(255,255,255,0.5)' : '0 20px 60px rgba(0, 0, 0, 0.15)'}
                p={{ base: 10, md: 14 }}
                w="full"
                maxW="550px"
                border={isHighContrast ? '4px solid white' : '2px solid #BBDEFB'}
            >
                <VStack spacing={8} align="stretch">
                    {/* 헤더 */}
                    <Box textAlign="center" mb={4}>
                        <Flex justify="center" mb={4}>
                            <Logo size={fontSizeLevel === 0 ? 'md' : fontSizeLevel === 1 ? 'lg' : 'xl'} isHighContrast={isHighContrast} />
                        </Flex>
                        <Text
                            fontSize={{ base: '2rem', md: '2.8rem' }}
                            fontWeight="900"
                            color={isHighContrast ? '#FFFFFF' : '#1565C0'}
                            mb={2}
                        >
                            로그인
                        </Text>
                        <Text fontSize={fs} color={isHighContrast ? '#CCCCCC' : '#546E7A'} fontWeight="600">
                            다정 서비스에 오신 것을 환영합니다
                        </Text>
                    </Box>

                    {/* 아이디 */}
                    <FormControl>
                        <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : 'gray.700'} fontWeight="700">
                            아이디
                        </FormLabel>
                        <Input
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            size="lg"
                            fontSize={fs}
                            height={inputH}
                            borderRadius="20px"
                            bg={isHighContrast ? '#000000' : 'white'}
                            border="2px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : 'gray.300'}
                            color={isHighContrast ? '#FFFFFF' : 'gray.800'}
                            fontWeight="600"
                            _placeholder={{
                                color: isHighContrast ? '#666666' : 'gray.400',
                            }}
                            _hover={{
                                borderColor: isHighContrast ? '#FFFF00' : '#1976D2',
                            }}
                            _focus={{
                                borderColor: isHighContrast ? '#FFFF00' : '#1565C0',
                                borderWidth: '3px',
                                boxShadow: isHighContrast
                                    ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                    : '0 0 0 4px rgba(21, 101, 192, 0.2)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>

                    {/* 비밀번호 */}
                    <FormControl>
                        <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : 'gray.700'} fontWeight="700">
                            비밀번호
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                size="lg"
                                fontSize={fs}
                                height={inputH}
                                borderRadius="20px"
                                bg={isHighContrast ? '#000000' : 'white'}
                                border="2px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : 'gray.300'}
                                color={isHighContrast ? '#FFFFFF' : 'gray.800'}
                                fontWeight="600"
                                _placeholder={{
                                    color: isHighContrast ? '#666666' : 'gray.400',
                                }}
                                _hover={{
                                    borderColor: isHighContrast ? '#FFFF00' : '#1976D2',
                                }}
                                _focus={{
                                    borderColor: isHighContrast ? '#FFFF00' : '#1565C0',
                                    borderWidth: '3px',
                                    boxShadow: isHighContrast
                                        ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                        : '0 0 0 4px rgba(21, 101, 192, 0.2)',
                                    outline: 'none',
                                }}
                            />
                            <InputRightElement height="100%" pr={4}>
                                <IconButton
                                    variant="ghost"
                                    onClick={handleShowToggle}
                                    icon={
                                        show ? (
                                            <ViewOffIcon
                                                boxSize={6}
                                                color={isHighContrast ? '#FFFFFF' : 'gray.500'}
                                            />
                                        ) : (
                                            <ViewIcon boxSize={6} color={isHighContrast ? '#FFFFFF' : 'gray.500'} />
                                        )
                                    }
                                    aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
                                    _hover={{
                                        bg: 'transparent',
                                        color: isHighContrast ? '#FFFF00' : '#1565C0',
                                    }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    {/* 로그인 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#1976D2'}
                        color={isHighContrast ? '#000000' : 'white'}
                        size="lg"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="800"
                        borderRadius="20px"
                        boxShadow="lg"
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#1565C0',
                            transform: 'translateY(-2px)',
                            boxShadow: '2xl',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#0D47A1',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        로그인
                    </Button>

                    {/* 설정 영역 */}
                    <Box
                        mt={4}
                        pt={6}
                        borderTop="2px solid"
                        borderColor={isHighContrast ? '#333333' : 'gray.200'}
                    >
                        {/* 글자 크기 조절 */}
                        <HStack justify="space-between" mb={5}>
                            <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : 'gray.700'}>
                                글자 크기
                            </Text>
                            <HStack spacing={3}>
                                <Button
                                    size="sm"
                                    onClick={handleDecrease}
                                    isDisabled={fontSizeLevel === 0}
                                    bg={isHighContrast ? '#FFFFFF' : 'gray.100'}
                                    color={isHighContrast ? '#000000' : 'gray.700'}
                                    fontWeight="700"
                                    borderRadius="12px"
                                    fontSize="1.3rem"
                                    h="50px"
                                    w="50px"
                                    _hover={{
                                        bg: isHighContrast ? '#FFFF00' : 'gray.200',
                                    }}
                                    _disabled={{
                                        opacity: 0.3,
                                    }}
                                >
                                    A-
                                </Button>
                                <Text
                                    fontSize="1.2rem"
                                    fontWeight="600"
                                    color={isHighContrast ? '#CCCCCC' : 'gray.600'}
                                    minW="60px"
                                    textAlign="center"
                                >
                                    {fontSizeLevels[fontSizeLevel]}
                                </Text>
                                <Button
                                    size="sm"
                                    onClick={handleIncrease}
                                    isDisabled={fontSizeLevel === 2}
                                    bg={isHighContrast ? '#FFFFFF' : 'gray.100'}
                                    color={isHighContrast ? '#000000' : 'gray.700'}
                                    fontWeight="700"
                                    borderRadius="12px"
                                    fontSize="1.3rem"
                                    h="50px"
                                    w="50px"
                                    _hover={{
                                        bg: isHighContrast ? '#FFFF00' : 'gray.200',
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
                            <Text fontSize={fs} fontWeight="700" color={isHighContrast ? '#FFFFFF' : 'gray.700'}>
                                {isHighContrast ? '고대비 모드' : '일반 모드'}
                            </Text>
                            <Button
                                size="sm"
                                onClick={toggleHighContrast}
                                bg={isHighContrast ? '#FFD700' : 'gray.700'}
                                color={isHighContrast ? '#000000' : 'white'}
                                fontWeight="700"
                                borderRadius="12px"
                                px={6}
                                h="50px"
                                fontSize="1.2rem"
                                _hover={{
                                    transform: 'scale(1.05)',
                                }}
                                transition="all 0.2s"
                            >
                                {isHighContrast ? '☀️ 끄기' : '🌙 켜기'}
                            </Button>
                        </HStack>
                    </Box>
                </VStack>
            </Box>

        </Flex>
    );
}