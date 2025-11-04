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
    Image,
    IconButton,
} from '@chakra-ui/react';
import Icon from '../../assets/dajung-icon.png';
import Title from '../../assets/dajung-title.png';
import { ViewIcon, ViewOffIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';

export default function UserLoginPage() {
    const fontSizeLevels = ['작게', '보통', '크게', '매우 크게'];
    const fontSizes = ['md', 'lg', 'xl', '2xl']; // Chakra UI size
    const uiScale = [
        { inputH: 38, label: 20, inputText: 18, BoxW: '80%', imageW: 140, BoxP: 7 },
        { inputH: 45, label: 22, inputText: 20, BoxW: '84%', imageW: 150, BoxP: 6 },
        { inputH: 53, label: 24, inputText: 22, BoxW: '88%', imageW: 160, BoxP: 5 },
        { inputH: 61, label: 26, inputText: 24, BoxW: '92%', imageW: 170, BoxP: 4 },
    ];

    const [show, setShow] = useState(false);
    const [fontSizeLevel, setFontSizeLevel] = useState(1); // 기본값: 보통
    const [isHighContrast, setIsHighContrast] = useState(false);

    const handleShowToggle = () => setShow(!show);

    const handleIncrease = () => setFontSizeLevel((prev) => Math.min(prev + 1, 3));
    const handleDecrease = () => setFontSizeLevel((prev) => Math.max(prev - 1, 0));
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    

    const fs = fontSizes[fontSizeLevel];

    return (
        <Flex direction="column" align="center" justify="center" minH="100vh" bg="#FBF8F3" px={{ base: 4, md: 0 }}>
            {/* 로고 */}
            <Flex direction="column" align="center" w="100%" mb={4}>
                <Image src={Icon} w={{ base: '100px', md: '150px' }} />
                <Image src={Title} w={{ base: uiScale[fontSizeLevel].imageW, md: '180px' }} mt={2} />
            </Flex>

            {/* 슬로건 */}
            <Text fontSize={fs} color="#2c1026" mb={4}>
                편안한 일상친구
            </Text>

            {/* 로그인 박스 */}
            <Box
                bg="white" // bg={isHighContrast ? 'white' , 'black'}
                borderColor="#E5DED5"
                borderWidth="1px"
                borderRadius="20px"
                p={{ base: uiScale[fontSizeLevel].BoxP, md: 10 }}
                w={{ base: uiScale[fontSizeLevel].BoxW, md: '500px' }}
                maxW="min(90%, 450px)"
                boxShadow="lg"
            >
                {/* 아이디 */}
                <FormControl mb={6}>
                    <FormLabel fontSize={fs} color="#2c1026" fontWeight="bold">
                        아이디
                    </FormLabel>
                    <Input
                        placeholder="아이디 입력"
                        borderRadius="15px"
                        height={{ base: uiScale[fontSizeLevel].inputH, md: '55px' }}
                        fontSize={fs}
                        borderColor="#BEB8AD"
                        _focus={{ borderColor: '#2c1026', borderWidth: '2px', boxShadow: 'none' }}
                        _hover={{ borderColor: '#2c1026' }}
                    />
                </FormControl>

                {/* 비밀번호 */}
                <FormControl mb={8}>
                    <FormLabel fontSize={fs} color="#2c1026" fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: uiScale[fontSizeLevel].inputH, md: '55px' }}
                            fontSize={fs}
                            borderColor="#BEB8AD"
                            _focus={{ borderColor: '#2c1026', borderWidth: '2px', boxShadow: 'none' }}
                            _hover={{ borderColor: '#2c1026' }}
                        />
                        <InputRightElement top="50%" transform="translateY(-50%)" pr={2}>
                            <IconButton
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={show ? <ViewOffIcon /> : <ViewIcon />}
                                aria-label="비밀번호 보기 토글"
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    bg="#3A5A40"
                    color="white"
                    w="100%"
                    height={{ base: uiScale[fontSizeLevel].inputH, md: '65px' }}
                    fontSize={fs}
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={{ bg: '#4C7152' }}
                >
                    로그인
                </Button>
            </Box>

            {/* 설정 박스 */}
            <Flex
                direction="row"
                wrap="nowrap"
                align="center"
                justify="center"
                gap={3}
                p={5}
                w="100%"
                maxW="900px"
                mx="auto"
            >
                {/* - 글자 줄이기 */}
                <IconButton
                    aria-label="Decrease font size"
                    icon={<MinusIcon />}
                    bg="#3A5A40"
                    color="white"
                    _hover={{ bg: '#4C7152' }}
                    size="lg"
                    rounded="full"
                    onClick={handleDecrease}
                    isDisabled={fontSizeLevel === 0}
                />

                <Text fontSize={fs} fontWeight="bold" color="#2c1026" minW="60px" textAlign="center">
                    {fontSizeLevels[fontSizeLevel]}
                </Text>

                {/* + 글자 키우기 */}
                <IconButton
                    aria-label="Increase font size"
                    icon={<AddIcon />}
                    bg="#3A5A40"
                    color="white"
                    _hover={{ bg: '#4C7152' }}
                    size="lg"
                    rounded="full"
                    onClick={handleIncrease}
                    isDisabled={fontSizeLevel === 3}
                />

                {/* 고대비 모드 버튼 */}
                <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: '#292929' }}
                    _active={{ bg: '#444444' }}
                    fontWeight="bold"
                    px={6}
                    py={6}
                    fontSize={fs}
                    borderRadius="lg"
                    whiteSpace="nowrap"
                >
                    고대비 모드
                </Button>
            </Flex>
        </Flex>
    );
}
