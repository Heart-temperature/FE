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
    Image,
    Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import DajeongLogo from '../../components/common/image.png';

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
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    const fs = fontSizes[fontSizeLevel];
    const inputH = inputHeights[fontSizeLevel];

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : '#F5F7FA'} px={6} py={10}>
            {/* 메인 로그인 카드 */}
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
                        <Image
                            src={DajeongLogo}
                            alt="다정이 로고"
                            maxW="300px"
                            mx="auto"
                            mb={4}
                        />
                        <Divider
                            borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'}
                            borderWidth="2px"
                            mb={4}
                        />
                    </Box>

                    {/* 아이디 */}
                    <FormControl>
                        <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : '#000000'} fontWeight="700" mb={3}>
                            전화번호
                        </FormLabel>
                        <Input
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="여기에 입력"
                            size="lg"
                            fontSize={fs}
                            height={inputH}
                            borderRadius="15px"
                            bg={isHighContrast ? '#000000' : '#F0F8FF'}
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                            color={isHighContrast ? '#FFFFFF' : '#1976D2'}
                            fontWeight="600"
                            _placeholder={{
                                color: isHighContrast ? '#e2e2e2ff' : '#797979ff',
                                fontWeight: '500',
                            }}
                            _hover={{
                                borderColor: isHighContrast ? '#FFFF00' : '#2196F3',
                                boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                            }}
                            _focus={{
                                borderWidth: '5px',
                                borderColor: isHighContrast ? '#FFFF00' : '#2196F3',
                                boxShadow: isHighContrast
                                    ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                    : '0 0 0 4px rgba(33, 150, 243, 0.25)',
                                outline: 'none',
                            }}
                            transition="all 0.2s"
                        />
                    </FormControl>

                    {/* 비밀번호 */}
                    <FormControl>
                        <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : '#000000'} fontWeight="700" mb={3}>
                            비밀번호
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="여기에 입력"
                                size="lg"
                                fontSize={fs}
                                height={inputH}
                                borderRadius="15px"
                                bg={isHighContrast ? '#000000' : '#F0F8FF'}
                                border="3px solid"
                                borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                                color={isHighContrast ? '#FFFFFF' : '#1976D2'}
                                fontWeight="600"
                                _placeholder={{
                                    color: isHighContrast ? '#e2e2e2ff' : '#797979ff',
                                    fontWeight: '500',
                                }}
                                _hover={{
                                    borderColor: isHighContrast ? '#FFFF00' : '#2196F3',
                                    boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                }}
                                _focus={{
                                    borderWidth: '5px',
                                    borderColor: isHighContrast ? '#FFFF00' : '#2196F3',
                                    boxShadow: isHighContrast
                                        ? '0 0 0 4px rgba(255, 255, 0, 0.3)'
                                        : '0 0 0 4px rgba(33, 150, 243, 0.25)',
                                    outline: 'none',
                                }}
                                transition="all 0.2s"
                            />
                        </InputGroup>
                    </FormControl>

                    {/* 로그인 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#2196F3'}
                        color={isHighContrast ? '#000000' : 'white'}
                        size="lg"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        boxShadow="0 4px 14px rgba(33, 150, 243, 0.3)"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        mt={2}
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
                        시작하기
                    </Button>

                    {/* 설정 영역 */}
                    <Box mt={4} pt={6} borderTop="3px solid" borderColor={isHighContrast ? '#444444' : '#E3F2FD'}>
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
                                    h="55px"
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
                                    h="55px"
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
                                    h="55px"
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
                                h="55px"
                                fontSize="1.4rem"
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
