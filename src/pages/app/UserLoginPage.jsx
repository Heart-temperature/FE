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
            bg={isHighContrast ? 'black' : '#F5F0E8'}
            px={{ base: 4 }}
        >
            {/* 로고 */}
            <Flex direction="column" align="center" w="100%" mb={8}>
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
                color={isHighContrast ? 'white' : '#1a0a15'}
                fontWeight="bold"
                mb={uiScale[fontSizeLevel].mb}
            >
                편안한 일상친구
            </Text>

            {/* 로그인 박스 */}
            <Box
                bg={isHighContrast ? 'black' : 'white'}
                border="3px solid"
                borderColor={isHighContrast ? 'white' : '#8B7E6A'}
                borderRadius="20px"
                px={{ base: uiScale[fontSizeLevel].BoxPx }}
                py={uiScale[fontSizeLevel].mb}
                w={{ base: uiScale[fontSizeLevel].BoxW }}
                maxW="min(92%, 500px)"
                boxShadow="xl"
                align="center"
            >
                {/* 아이디 */}
                <FormControl mb={uiScale[fontSizeLevel].mb}>
                    <FormLabel fontSize={fs} color={isHighContrast ? 'white' : '#1a0a15'} fontWeight="bold">
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
                            color={isHighContrast ? 'white' : '#1a0a15'}
                            bg={isHighContrast ? 'black' : 'white'}
                            border="3px solid"
                            borderColor={isHighContrast ? 'white' : '#8B7E6A'}
                            _placeholder={{
                                color: isHighContrast ? '#CCCCCC' : '#6B5E4F',
                                opacity: 0.8,
                            }}
                            _focusVisible={
                                isHighContrast
                                    ? {
                                          borderColor: '#FFD700',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.5)',
                                          outline: 'none',
                                      }
                                    : {
                                          borderColor: '#2D5016',
                                          borderWidth: '3px',
                                          boxShadow: '0 0 0 3px rgba(45, 80, 22, 0.2)',
                                          outline: 'none',
                                      }
                            }
                            _hover={{
                                borderColor: isHighContrast ? '#FFD700' : '#5A4830',
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
                                            color={isHighContrast ? 'white' : '#1a0a15'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    }
                                    aria-label="아이디 입력 초기화"
                                    _hover={{
                                        bg: isHighContrast ? 'rgba(255, 215, 0, 0.2)' : 'rgba(45, 80, 22, 0.1)',
                                    }}
                                />
                            </InputRightElement>
                        )}
                    </InputGroup>
                </FormControl>

                {/* 비밀번호 */}
                <FormControl mb={uiScale[fontSizeLevel].mb * 2}>
                    <FormLabel fontSize={fs} color={isHighContrast ? 'white' : '#1a0a15'} fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: uiScale[fontSizeLevel].inputH }}
                            fontSize={fs}
                            color={isHighContrast ? 'white' : '#1a0a15'}
                            bg={isHighContrast ? 'black' : 'white'}
                            border="3px solid"
                            borderColor={isHighContrast ? 'white' : '#8B7E6A'}
                            _placeholder={{
                                color: isHighContrast ? '#CCCCCC' : '#6B5E4F',
                                opacity: 0.8,
                            }}
                            _focusVisible={
                                isHighContrast
                                    ? {
                                          borderColor: '#FFD700',
                                          borderWidth: '4px',
                                          boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.5)',
                                          outline: 'none',
                                      }
                                    : {
                                          borderColor: '#2D5016',
                                          borderWidth: '3px',
                                          boxShadow: '0 0 0 3px rgba(45, 80, 22, 0.2)',
                                          outline: 'none',
                                      }
                            }
                            _hover={{
                                borderColor: isHighContrast ? '#FFD700' : '#5A4830',
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
                                            color={isHighContrast ? 'white' : '#1a0a15'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    ) : (
                                        <ViewIcon
                                            color={isHighContrast ? 'white' : '#1a0a15'}
                                            boxSize={uiScale[fontSizeLevel].buttonIconSize}
                                        />
                                    )
                                }
                                aria-label="비밀번호 보기 토글"
                                _hover={{
                                    bg: isHighContrast ? 'rgba(255, 215, 0, 0.2)' : 'rgba(45, 80, 22, 0.1)',
                                }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    bg={isHighContrast ? '#FFD700' : '#2D5016'}
                    color={isHighContrast ? 'black' : 'white'}
                    w="85%"
                    height={{ base: uiScale[fontSizeLevel].inputH }}
                    fontSize={fs}
                    fontWeight="bold"
                    borderRadius="1.25rem"
                    border="3px solid"
                    borderColor={isHighContrast ? 'white' : '#2D5016'}
                    boxShadow="lg"
                    _hover={
                        isHighContrast
                            ? {
                                  bg: 'white',
                                  color: 'black',
                                  transform: 'scale(1.02)',
                                  boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.5)',
                              }
                            : {
                                  bg: '#3A6B1E',
                                  transform: 'scale(1.02)',
                                  boxShadow: 'xl',
                              }
                    }
                    _active={
                        isHighContrast
                            ? { bg: '#CCCCCC', transform: 'scale(0.98)' }
                            : { bg: '#1F3A0E', transform: 'scale(0.98)' }
                    }
                    _focusVisible={{
                        boxShadow: isHighContrast
                            ? '0 0 0 4px rgba(255, 255, 255, 0.6)'
                            : '0 0 0 4px rgba(45, 80, 22, 0.4)',
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
                direction="row"
                wrap="nowrap"
                align="center"
                justify="center"
                gap={4}
                py={uiScale[fontSizeLevel].mb}
                px={4}
                w="100%"
                mx="auto"
            >
                {/* - 글자 줄이기 */}
                <IconButton
                    aria-label="글자 크기 줄이기"
                    icon={<MinusIcon boxSize={uiScale[fontSizeLevel].buttonIconSize} />}
                    bg={isHighContrast ? '#FFD700' : '#2D5016'}
                    color={isHighContrast ? 'black' : 'white'}
                    border="3px solid"
                    borderColor={isHighContrast ? 'white' : '#2D5016'}
                    _hover={
                        isHighContrast
                            ? {
                                  bg: 'white',
                                  color: 'black',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.5)',
                              }
                            : {
                                  bg: '#3A6B1E',
                                  transform: 'scale(1.1)',
                                  boxShadow: 'lg',
                              }
                    }
                    _active={{
                        transform: 'scale(0.95)',
                    }}
                    _disabled={{
                        opacity: 0.4,
                        cursor: 'not-allowed',
                        _hover: { transform: 'none' },
                    }}
                    h={{ base: uiScale[fontSizeLevel].inputH }}
                    w={{ base: uiScale[fontSizeLevel].inputH }}
                    rounded="full"
                    onClick={handleDecrease}
                    isDisabled={fontSizeLevel === 0}
                    transition="all 0.2s"
                />

                <Text
                    fontSize={fs}
                    fontWeight="bold"
                    color={isHighContrast ? 'white' : '#1a0a15'}
                    minW="80px"
                    textAlign="center"
                >
                    {fontSizeLevels[fontSizeLevel]}
                </Text>

                {/* + 글자 키우기 */}
                <IconButton
                    aria-label="글자 크기 키우기"
                    icon={<AddIcon boxSize={uiScale[fontSizeLevel].buttonIconSize} />}
                    bg={isHighContrast ? '#FFD700' : '#2D5016'}
                    color={isHighContrast ? 'black' : 'white'}
                    border="3px solid"
                    borderColor={isHighContrast ? 'white' : '#2D5016'}
                    _hover={
                        isHighContrast
                            ? {
                                  bg: 'white',
                                  color: 'black',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.5)',
                              }
                            : {
                                  bg: '#3A6B1E',
                                  transform: 'scale(1.1)',
                                  boxShadow: 'lg',
                              }
                    }
                    _active={{
                        transform: 'scale(0.95)',
                    }}
                    _disabled={{
                        opacity: 0.4,
                        cursor: 'not-allowed',
                        _hover: { transform: 'none' },
                    }}
                    h={{ base: uiScale[fontSizeLevel].inputH }}
                    w={{ base: uiScale[fontSizeLevel].inputH }}
                    rounded="full"
                    onClick={handleIncrease}
                    isDisabled={fontSizeLevel === 3}
                    transition="all 0.2s"
                />

                {/* 고대비 모드 버튼 */}
                <Button
                    bg={isHighContrast ? '#FFD700' : '#1a1a1a'}
                    color={isHighContrast ? 'black' : 'white'}
                    border="3px solid"
                    borderColor={isHighContrast ? 'white' : '#1a1a1a'}
                    fontWeight="bold"
                    px={5}
                    height={{ base: 'auto' }}
                    minH={uiScale[fontSizeLevel].inputH}
                    fontSize={fs}
                    borderRadius="1.25rem"
                    whiteSpace="normal"
                    boxShadow="lg"
                    _hover={
                        isHighContrast
                            ? {
                                  bg: 'white',
                                  color: 'black',
                                  transform: 'scale(1.02)',
                                  boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.5)',
                              }
                            : {
                                  bg: '#2D2D2D',
                                  transform: 'scale(1.02)',
                                  boxShadow: 'xl',
                              }
                    }
                    _active={{
                        transform: 'scale(0.98)',
                    }}
                    _focusVisible={{
                        boxShadow: isHighContrast
                            ? '0 0 0 4px rgba(255, 255, 255, 0.6)'
                            : '0 0 0 4px rgba(255, 215, 0, 0.4)',
                        outline: 'none',
                    }}
                    onClick={toggleHighContrast}
                    transition="all 0.2s"
                >
                    {isHighContrast ? '고대비 끄기' : '고대비 켜기'}
                </Button>
            </Flex>
        </Flex>
    );
}