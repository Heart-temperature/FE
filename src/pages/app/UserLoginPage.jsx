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
import HighContrastTitle from '../../assets/dajung-white.png';
import { ViewIcon, ViewOffIcon, MinusIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';

export default function UserLoginPage() {
    const fontSizeLevels = ['작게', '보통', '크게', '매우 크게'];
    // 노인 친화적 폰트 크기: 더 크게 시작
    const fontSizes = ['1.8rem', '2.2rem', '2.8rem', '3.6rem'];
    const uiScale = [
        { inputH: '5rem', mb: '6', BoxW: '90%', imageH: '7rem', BoxPx: 10, buttonIconSize: '1.5rem' },
        { inputH: '6rem', mb: '8', BoxW: '92%', imageH: '8.5rem', BoxPx: 12, buttonIconSize: '1.8rem' },
        { inputH: '7.5rem', mb: '10', BoxW: '94%', imageH: '10rem', BoxPx: 14, buttonIconSize: '2.2rem' },
        { inputH: '9rem', mb: '12', BoxW: '96%', imageH: '12rem', BoxPx: 16, buttonIconSize: '2.8rem' },
    ];

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [fontSizeLevel, setFontSizeLevel] = useState(2); // 기본값: 크게 (노인 친화)
    const [isHighContrast, setIsHighContrast] = useState(false);

    const handleShowToggle = () => setShow(!show);

    const handleIncrease = () => setFontSizeLevel((prev) => Math.min(prev + 1, 3));
    const handleDecrease = () => setFontSizeLevel((prev) => Math.max(prev - 1, 0));
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    const fs = fontSizes[fontSizeLevel];

    return (
        <Flex
            direction="column"
            align="center"
            justify="space-between"
            minH="100vh"
            bg={isHighContrast ? '#000000' : '#E8F4F8'}
            px={{ base: 6 }}
            py={{ base: 8 }}
        >
            {/* 상단: 로고 영역 */}
            <Flex direction="column" align="center" w="100%" mb={8}>
                <Image src={Icon} h={{ base: uiScale[fontSizeLevel].imageH }} mb={4} />
                <Image
                    src={isHighContrast ? HighContrastTitle : Title}
                    h={{ base: uiScale[fontSizeLevel].imageH }}
                    mb={4}
                />
                <Text
                    fontSize={fs}
                    color={isHighContrast ? '#FFFFFF' : '#004D40'}
                    fontWeight="bold"
                    textAlign="center"
                >
                    편안한 일상친구
                </Text>
            </Flex>

            {/* 중앙: 로그인 입력 영역 */}
            <Box
                bg={isHighContrast ? '#000000' : 'white'}
                border={isHighContrast ? '5px solid white' : '4px solid #0277BD'}
                borderRadius="30px"
                px={{ base: uiScale[fontSizeLevel].BoxPx }}
                py={{ base: uiScale[fontSizeLevel].mb * 2 }}
                w={{ base: uiScale[fontSizeLevel].BoxW }}
                maxW="600px"
                boxShadow="2xl"
            >
                {/* 아이디 */}
                <FormControl mb={uiScale[fontSizeLevel].mb * 2}>
                    <FormLabel
                        fontSize={fs}
                        color={isHighContrast ? '#FFFFFF' : '#004D40'}
                        fontWeight="900"
                        mb={3}
                    >
                        아이디
                    </FormLabel>
                    <Input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력하세요"
                        borderRadius="20px"
                        height={uiScale[fontSizeLevel].inputH}
                        fontSize={fs}
                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                        bg={isHighContrast ? '#000000' : '#F5F5F5'}
                        border="4px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#0277BD'}
                        fontWeight="bold"
                        px={6}
                        _placeholder={{
                            color: isHighContrast ? '#AAAAAA' : '#757575',
                            fontWeight: 'normal',
                        }}
                        _focus={{
                            borderColor: isHighContrast ? '#FFD700' : '#01579B',
                            borderWidth: '5px',
                            boxShadow: isHighContrast
                                ? '0 0 0 5px rgba(255, 215, 0, 0.5)'
                                : '0 0 0 5px rgba(2, 119, 189, 0.3)',
                            outline: 'none',
                            bg: isHighContrast ? '#000000' : 'white',
                        }}
                        _hover={{
                            borderColor: isHighContrast ? '#FFD700' : '#01579B',
                        }}
                    />
                </FormControl>

                {/* 비밀번호 */}
                <FormControl mb={uiScale[fontSizeLevel].mb * 3}>
                    <FormLabel
                        fontSize={fs}
                        color={isHighContrast ? '#FFFFFF' : '#004D40'}
                        fontWeight="900"
                        mb={3}
                    >
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            borderRadius="20px"
                            height={uiScale[fontSizeLevel].inputH}
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            bg={isHighContrast ? '#000000' : '#F5F5F5'}
                            border="4px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#0277BD'}
                            fontWeight="bold"
                            px={6}
                            _placeholder={{
                                color: isHighContrast ? '#AAAAAA' : '#757575',
                                fontWeight: 'normal',
                            }}
                            _focus={{
                                borderColor: isHighContrast ? '#FFD700' : '#01579B',
                                borderWidth: '5px',
                                boxShadow: isHighContrast
                                    ? '0 0 0 5px rgba(255, 215, 0, 0.5)'
                                    : '0 0 0 5px rgba(2, 119, 189, 0.3)',
                                outline: 'none',
                                bg: isHighContrast ? '#000000' : 'white',
                            }}
                            _hover={{
                                borderColor: isHighContrast ? '#FFD700' : '#01579B',
                            }}
                        />
                        <InputRightElement top="50%" transform="translateY(-50%)" pr={3}>
                            <IconButton
                                height="auto"
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={
                                    show ? (
                                        <ViewOffIcon
                                            color={isHighContrast ? '#FFFFFF' : '#0277BD'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    ) : (
                                        <ViewIcon
                                            color={isHighContrast ? '#FFFFFF' : '#0277BD'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    )
                                }
                                aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
                                fontSize={fs}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 - 매우 크게 */}
                <Button
                    bg={isHighContrast ? '#FFD700' : '#0277BD'}
                    color={isHighContrast ? '#000000' : '#FFFFFF'}
                    w="100%"
                    height={uiScale[fontSizeLevel].inputH}
                    fontSize={fs}
                    fontWeight="900"
                    borderRadius="20px"
                    border="5px solid"
                    borderColor={isHighContrast ? '#FFFFFF' : '#01579B'}
                    boxShadow="2xl"
                    _hover={{
                        bg: isHighContrast ? '#FFEB3B' : '#01579B',
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    }}
                    _active={{
                        transform: 'scale(0.98)',
                    }}
                    _focus={{
                        boxShadow: isHighContrast
                            ? '0 0 0 6px rgba(255, 215, 0, 0.6)'
                            : '0 0 0 6px rgba(2, 119, 189, 0.5)',
                        outline: 'none',
                    }}
                    transition="all 0.2s"
                >
                    로그인
                </Button>
            </Box>

            {/* 하단: 설정 버튼 영역 */}
            <Box w="100%" maxW="600px" px={4}>
                {/* 글자 크기 조절 */}
                <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    gap={5}
                    mb={6}
                    bg={isHighContrast ? '#1A1A1A' : 'white'}
                    borderRadius="25px"
                    py={4}
                    px={4}
                    border={isHighContrast ? '4px solid white' : '3px solid #0277BD'}
                    boxShadow="lg"
                >
                    <Button
                        aria-label="글자 작게"
                        bg={isHighContrast ? '#FFFFFF' : '#0277BD'}
                        color={isHighContrast ? '#000000' : '#FFFFFF'}
                        fontSize={fs}
                        fontWeight="900"
                        h={uiScale[fontSizeLevel].inputH}
                        w={uiScale[fontSizeLevel].inputH}
                        borderRadius="20px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#01579B'}
                        onClick={handleDecrease}
                        isDisabled={fontSizeLevel === 0}
                        _hover={{
                            transform: 'scale(1.1)',
                            boxShadow: 'xl',
                        }}
                        _active={{
                            transform: 'scale(0.95)',
                        }}
                        _disabled={{
                            opacity: 0.3,
                            cursor: 'not-allowed',
                        }}
                        transition="all 0.2s"
                    >
                        A-
                    </Button>

                    <Text
                        fontSize={fs}
                        fontWeight="900"
                        color={isHighContrast ? '#FFFFFF' : '#004D40'}
                        minW="120px"
                        textAlign="center"
                    >
                        {fontSizeLevels[fontSizeLevel]}
                    </Text>

                    <Button
                        aria-label="글자 크게"
                        bg={isHighContrast ? '#FFFFFF' : '#0277BD'}
                        color={isHighContrast ? '#000000' : '#FFFFFF'}
                        fontSize={fs}
                        fontWeight="900"
                        h={uiScale[fontSizeLevel].inputH}
                        w={uiScale[fontSizeLevel].inputH}
                        borderRadius="20px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#01579B'}
                        onClick={handleIncrease}
                        isDisabled={fontSizeLevel === 3}
                        _hover={{
                            transform: 'scale(1.1)',
                            boxShadow: 'xl',
                        }}
                        _active={{
                            transform: 'scale(0.95)',
                        }}
                        _disabled={{
                            opacity: 0.3,
                            cursor: 'not-allowed',
                        }}
                        transition="all 0.2s"
                    >
                        A+
                    </Button>
                </Flex>

                {/* 고대비 모드 */}
                <Button
                    bg={isHighContrast ? '#FFD700' : '#37474F'}
                    color={isHighContrast ? '#000000' : '#FFFFFF'}
                    w="100%"
                    h={uiScale[fontSizeLevel].inputH}
                    fontSize={fs}
                    fontWeight="900"
                    borderRadius="25px"
                    border="4px solid"
                    borderColor={isHighContrast ? '#FFFFFF' : '#263238'}
                    boxShadow="xl"
                    onClick={toggleHighContrast}
                    _hover={{
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                    _active={{
                        transform: 'scale(0.98)',
                    }}
                    transition="all 0.2s"
                >
                    {isHighContrast ? '☀️ 일반 화면' : '🌙 고대비 화면'}
                </Button>
            </Box>
        </Flex>
    );
}