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
    // 노인 친화적 폰트 크기: 최소 1.5rem (24px)부터 시작
    const fontSizes = ['1.5rem', '1.9rem', '2.4rem', '3.0rem'];
    const uiScale = [
        { inputH: '4.2rem', mb: '8', BoxW: '85%', imageH: '6rem', BoxPx: 8, buttonIconSize: '1.2rem' },
        { inputH: '5.4rem', mb: '10', BoxW: '88%', imageH: '7rem', BoxPx: 9, buttonIconSize: '1.5rem' },
        { inputH: '6.6rem', mb: '12', BoxW: '91%', imageH: '8.5rem', BoxPx: 10, buttonIconSize: '1.8rem' },
        { inputH: '8.4rem', mb: '14', BoxW: '94%', imageH: '10rem', BoxPx: 11, buttonIconSize: '2.2rem' },
    ];

    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const [fontSizeLevel, setFontSizeLevel] = useState(1); // 기본값: 보통
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
            justify="center"
            minH="100vh"
            bg={isHighContrast ? '#000033' : '#BBDEFB'}
            px={{ base: 4 }}
        >
            {/* 로그인 박스 - 로고 포함 */}
            <Box
                bg={isHighContrast ? '#000033' : 'white'}
                border="4px solid"
                borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                borderRadius="25px"
                px={{ base: uiScale[fontSizeLevel].BoxPx }}
                py={uiScale[fontSizeLevel].mb * 1.5}
                w={{ base: uiScale[fontSizeLevel].BoxW }}
                maxW="min(95%, 550px)"
                boxShadow="2xl"
                align="center"
            >
                {/* 로고 */}
                <Flex direction="column" align="center" w="100%" mb={uiScale[fontSizeLevel].mb}>
                    <Image src={Icon} h={{ base: uiScale[fontSizeLevel].imageH }} />
                    <Image
                        src={isHighContrast ? HighContrastTitle : Title}
                        h={{ base: uiScale[fontSizeLevel].imageH }}
                        mt={2}
                    />
                </Flex>

                {/* 슬로건 */}
                <Text
                    fontSize={fs}
                    color={isHighContrast ? '#FFFFFF' : '#0D47A1'}
                    fontWeight="bold"
                    mb={uiScale[fontSizeLevel].mb}
                >
                    편안한 일상친구
                </Text>
                {/* 아이디 */}
                <FormControl mb={uiScale[fontSizeLevel].mb}>
                    <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : '#0D47A1'} fontWeight="bold">
                        아이디
                    </FormLabel>
                    <InputGroup>
                        <Input
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디 입력"
                            borderRadius="15px"
                            height={{ base: uiScale[fontSizeLevel].inputH }}
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#0D47A1'}
                            bg={isHighContrast ? '#000033' : 'white'}
                            border="3px solid"
                            borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                            _placeholder={{
                                color: isHighContrast ? '#80D8FF' : '#42A5F5',
                                opacity: 0.8,
                            }}
                            _focusVisible={
                                isHighContrast
                                    ? {
                                          borderColor: '#FFD740',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 4px rgba(0, 217, 255, 0.5)',
                                          outline: 'none',
                                      }
                                    : {
                                          borderColor: '#1565C0',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.3)',
                                          outline: 'none',
                                      }
                            }
                            _hover={{
                                borderColor: isHighContrast ? '#00D9FF' : '#1976D2',
                            }}
                        />
                        {id && (
                            <InputRightElement top="50%" transform="translateY(-50%)" pr={2}>
                                <IconButton
                                    height={uiScale[fontSizeLevel].inputH}
                                    variant="unstyled"
                                    onClick={() => setId('')}
                                    icon={
                                        <CloseIcon
                                            color={isHighContrast ? '#00D9FF' : '#2196F3'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    }
                                    aria-label="아이디 입력 초기화"
                                    _hover={{
                                        bg: isHighContrast ? 'rgba(0, 217, 255, 0.2)' : 'rgba(33, 150, 243, 0.15)',
                                    }}
                                />
                            </InputRightElement>
                        )}
                    </InputGroup>
                </FormControl>

                {/* 비밀번호 */}
                <FormControl mb={uiScale[fontSizeLevel].mb * 2}>
                    <FormLabel fontSize={fs} color={isHighContrast ? '#FFFFFF' : '#0D47A1'} fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: uiScale[fontSizeLevel].inputH }}
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#0D47A1'}
                            bg={isHighContrast ? '#000033' : 'white'}
                            border="3px solid"
                            borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                            _placeholder={{
                                color: isHighContrast ? '#80D8FF' : '#42A5F5',
                                opacity: 0.8,
                            }}
                            _focusVisible={
                                isHighContrast
                                    ? {
                                          borderColor: '#FFD740',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 4px rgba(0, 217, 255, 0.5)',
                                          outline: 'none',
                                      }
                                    : {
                                          borderColor: '#1565C0',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.3)',
                                          outline: 'none',
                                      }
                            }
                            _hover={{
                                borderColor: isHighContrast ? '#00D9FF' : '#1976D2',
                            }}
                        />
                        <InputRightElement top="50%" transform="translateY(-50%)" pr={2}>
                            <IconButton
                                height={uiScale[fontSizeLevel].inputH}
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={
                                    show ? (
                                        <ViewOffIcon
                                            color={isHighContrast ? '#00D9FF' : '#2196F3'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    ) : (
                                        <ViewIcon
                                            color={isHighContrast ? '#00D9FF' : '#2196F3'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    )
                                }
                                aria-label="비밀번호 보기 토글"
                                _hover={{
                                    bg: isHighContrast ? 'rgba(0, 217, 255, 0.2)' : 'rgba(33, 150, 243, 0.15)',
                                }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    bg={isHighContrast ? '#00D9FF' : '#2196F3'}
                    color={isHighContrast ? '#000033' : 'white'}
                    w="90%"
                    height={{ base: uiScale[fontSizeLevel].inputH }}
                    fontSize={fs}
                    fontWeight="bold"
                    borderRadius="1.25rem"
                    border="3px solid"
                    borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                    boxShadow="xl"
                    _hover={
                        isHighContrast
                            ? {
                                  bg: '#80D8FF',
                                  color: '#000033',
                                  transform: 'scale(1.03)',
                                  boxShadow: '0 0 0 5px rgba(0, 217, 255, 0.5)',
                              }
                            : {
                                  bg: '#1976D2',
                                  transform: 'scale(1.03)',
                                  boxShadow: '2xl',
                              }
                    }
                    _active={
                        isHighContrast
                            ? { bg: '#40C4FF', transform: 'scale(0.97)' }
                            : { bg: '#1565C0', transform: 'scale(0.97)' }
                    }
                    _focusVisible={{
                        boxShadow: isHighContrast
                            ? '0 0 0 5px rgba(255, 215, 64, 0.6)'
                            : '0 0 0 5px rgba(33, 150, 243, 0.4)',
                        outline: 'none',
                    }}
                    mb={uiScale[fontSizeLevel].mb / 2}
                    transition="all 0.2s"
                >
                    로그인
                </Button>
            </Box>

            {/* 설정 박스 */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                gap={5}
                py={uiScale[fontSizeLevel].mb}
                px={4}
                w="100%"
                mx="auto"
            >
                {/* 글자 크기 조절 - 원형 버튼들 */}
                <Flex direction="row" align="center" justify="center" gap={4}>
                    <IconButton
                        aria-label="글자 크기 줄이기"
                        icon={<MinusIcon boxSize={uiScale[fontSizeLevel].buttonIconSize} />}
                        bg={isHighContrast ? '#00D9FF' : '#2196F3'}
                        color={isHighContrast ? '#000033' : 'white'}
                        border="3px solid"
                        borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                        _hover={
                            isHighContrast
                                ? {
                                      bg: '#80D8FF',
                                      transform: 'scale(1.15)',
                                      boxShadow: '0 0 0 5px rgba(0, 217, 255, 0.5)',
                                  }
                                : {
                                      bg: '#1976D2',
                                      transform: 'scale(1.15)',
                                      boxShadow: 'xl',
                                  }
                        }
                        _active={{
                            transform: 'scale(0.9)',
                        }}
                        _disabled={{
                            opacity: 0.3,
                            cursor: 'not-allowed',
                            _hover: { transform: 'none' },
                        }}
                        h={{ base: uiScale[fontSizeLevel].inputH }}
                        w={{ base: uiScale[fontSizeLevel].inputH }}
                        rounded="full"
                        onClick={handleDecrease}
                        isDisabled={fontSizeLevel === 0}
                        transition="all 0.2s"
                        boxShadow="lg"
                    />

                    <Text
                        fontSize={fs}
                        fontWeight="bold"
                        color={isHighContrast ? '#FFFFFF' : '#0D47A1'}
                        minW="90px"
                        textAlign="center"
                    >
                        {fontSizeLevels[fontSizeLevel]}
                    </Text>

                    <IconButton
                        aria-label="글자 크기 키우기"
                        icon={<AddIcon boxSize={uiScale[fontSizeLevel].buttonIconSize} />}
                        bg={isHighContrast ? '#00D9FF' : '#2196F3'}
                        color={isHighContrast ? '#000033' : 'white'}
                        border="3px solid"
                        borderColor={isHighContrast ? '#00D9FF' : '#2196F3'}
                        _hover={
                            isHighContrast
                                ? {
                                      bg: '#80D8FF',
                                      transform: 'scale(1.15)',
                                      boxShadow: '0 0 0 5px rgba(0, 217, 255, 0.5)',
                                  }
                                : {
                                      bg: '#1976D2',
                                      transform: 'scale(1.15)',
                                      boxShadow: 'xl',
                                  }
                        }
                        _active={{
                            transform: 'scale(0.9)',
                        }}
                        _disabled={{
                            opacity: 0.3,
                            cursor: 'not-allowed',
                            _hover: { transform: 'none' },
                        }}
                        h={{ base: uiScale[fontSizeLevel].inputH }}
                        w={{ base: uiScale[fontSizeLevel].inputH }}
                        rounded="full"
                        onClick={handleIncrease}
                        isDisabled={fontSizeLevel === 3}
                        transition="all 0.2s"
                        boxShadow="lg"
                    />
                </Flex>

                {/* 고대비 모드 버튼 - 사각형, 다른 색상 */}
                <Button
                    bg={isHighContrast ? '#FFD740' : '#7C4DFF'}
                    color={isHighContrast ? '#000033' : 'white'}
                    border="4px solid"
                    borderColor={isHighContrast ? '#FFD740' : '#651FFF'}
                    fontWeight="bold"
                    px={8}
                    height={{ base: 'auto' }}
                    minH={uiScale[fontSizeLevel].inputH}
                    fontSize={fs}
                    borderRadius="20px"
                    whiteSpace="normal"
                    boxShadow="xl"
                    w={{ base: '85%', md: 'auto' }}
                    minW={{ base: '280px' }}
                    _hover={
                        isHighContrast
                            ? {
                                  bg: '#FFEB3B',
                                  color: '#000033',
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 0 0 5px rgba(255, 215, 64, 0.5)',
                              }
                            : {
                                  bg: '#651FFF',
                                  transform: 'scale(1.05)',
                                  boxShadow: '2xl',
                              }
                    }
                    _active={{
                        transform: 'scale(0.95)',
                    }}
                    _focusVisible={{
                        boxShadow: isHighContrast
                            ? '0 0 0 5px rgba(255, 255, 255, 0.6)'
                            : '0 0 0 5px rgba(124, 77, 255, 0.4)',
                        outline: 'none',
                    }}
                    onClick={toggleHighContrast}
                    transition="all 0.2s"
                >
                    {isHighContrast ? '🌞 일반 모드' : '🌙 고대비 모드'}
                </Button>
            </Flex>
        </Flex>
    );
}