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
    const fontSizes = ['1.1rem', '1.4rem', '1.7rem', '2.2rem']; // Chakra UI size
    const uiScale = [
        { inputH: '3.3rem', mb: '8', BoxW: '80%', imageH: '5rem', BoxPx: 7 },
        { inputH: '4.2rem', mb: '10', BoxW: '84%', imageH: '6rem', BoxPx: 7 },
        { inputH: '5.1rem', mb: '12', BoxW: '88%', imageH: '7rem', BoxPx: 7 },
        { inputH: '6.6rem', mb: '14', BoxW: '92%', imageH: '8rem', BoxPx: 7 },
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
            bg={isHighContrast ? 'black' : '#FBF8F3'}
            px={{ base: 4, md: 0 }}
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
            <Text fontSize={fs} color={isHighContrast ? 'white' : '#2c1026'} fontWeight={isHighContrast ? "bold" : "normal"} mb={uiScale[fontSizeLevel].mb}>
                편안한 일상친구
            </Text>

            {/* 로그인 박스 */}
            <Box
                bg={isHighContrast ? 'black' : 'white'}
                borderColor="#E5DED5"
                borderWidth="1px"
                borderRadius="20px"
                px={{ base: uiScale[fontSizeLevel].BoxPx }}
                py={8}
                w={{ base: uiScale[fontSizeLevel].BoxW }}
                maxW="min(90%, 450px)"
                boxShadow="lg"
                align="center"
            >
                {/* 아이디 */}
                <FormControl mb={uiScale[fontSizeLevel].mb}>
                    <FormLabel fontSize={fs} color={isHighContrast ? 'white' : '#2c1026'} fontWeight="bold">
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
                            color={isHighContrast ? 'white' : '#2c1026'}
                            borderColor="#BEB8AD"
                            _focus={
                                isHighContrast
                                    ? {
                                          borderColor: 'yellow',
                                          borderWidth: '3px',
                                          boxShadow: 'none',
                                      }
                                    : {
                                          borderColor: '#2c1026',
                                          borderWidth: '2px',
                                          boxShadow: 'none',
                                      }
                            }
                        />
                        {id && (
                            <InputRightElement top="50%" transform="translateY(-50%)" pr={1}>
                                <IconButton
                                    height={uiScale[fontSizeLevel].inputH}
                                    variant="unstyled"
                                    onClick={() => setId('')}
                                    icon={<CloseIcon color={isHighContrast ? 'white' : '#2c1026'} />}
                                    aria-label="아이디 입력 초기화"
                                />
                            </InputRightElement>
                        )}
                    </InputGroup>
                </FormControl>

                {/* 비밀번호 */}
                <FormControl mb={uiScale[fontSizeLevel].mb * 2}>
                    <FormLabel fontSize={fs} color={isHighContrast ? 'white' : '#2c1026'} fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: uiScale[fontSizeLevel].inputH }}
                            fontSize={fs}
                            color={isHighContrast ? 'white' : '#2c1026'}
                            borderColor="#BEB8AD"
                            _focus={
                                isHighContrast
                                    ? {
                                          borderColor: 'yellow',
                                          borderWidth: '3px',
                                          boxShadow: 'none',
                                      }
                                    : {
                                          borderColor: '#2c1026',
                                          borderWidth: '2px',
                                          boxShadow: 'none',
                                      }
                            }
                        />
                        <InputRightElement top="50%" transform="translateY(-50%)" pr={1}>
                            <IconButton
                                height={uiScale[fontSizeLevel].inputH}
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={
                                    show ? (
                                        <ViewOffIcon color={isHighContrast ? 'white' : '#2c1026'} />
                                    ) : (
                                        <ViewIcon color={isHighContrast ? 'white' : '#2c1026'} />
                                    )
                                }
                                aria-label="비밀번호 보기 토글"
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    bg={isHighContrast ? 'yellow' : '#3A5A40'}
                    color={isHighContrast ? 'black' : 'white'}
                    w="80%"
                    height={{ base: uiScale[fontSizeLevel].inputH }}
                    fontSize={fs}
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={isHighContrast ? { bg: 'white' } : { bg: '#4C7152' }}
                    mb={uiScale[fontSizeLevel].mb}
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
                gap={2}
                py={uiScale[fontSizeLevel].mb}
                px={4}
                w="100%"
                mx="auto"
            >
                {/* - 글자 줄이기 */}
                <IconButton
                    aria-label="Decrease font size"
                    icon={<MinusIcon />}
                    bg={isHighContrast ? 'white' : '#3A5A40'}
                    color={isHighContrast ? 'black' : 'white'}
                    _hover={isHighContrast ? { bg: 'yellow' } : { bg: '#4C7152' }}
                    h={{ base: uiScale[fontSizeLevel].inputH }}
                    rounded="full"
                    onClick={handleDecrease}
                    isDisabled={fontSizeLevel === 0}
                />

                <Text
                    fontSize={fs}
                    fontWeight="bold"
                    color={isHighContrast ? 'white' : '#2c1026'}
                    minW="60px"
                    textAlign="center"
                >
                    {fontSizeLevels[fontSizeLevel]}
                </Text>

                {/* + 글자 키우기 */}
                <IconButton
                    aria-label="Increase font size"
                    icon={<AddIcon />}
                    bg={isHighContrast ? 'white' : '#3A5A40'}
                    color={isHighContrast ? 'black' : 'white'}
                    _hover={isHighContrast ? { bg: 'yellow' } : { bg: '#4C7152' }}
                    h={{ base: uiScale[fontSizeLevel].inputH }}
                    rounded="full"
                    onClick={handleIncrease}
                    isDisabled={fontSizeLevel === 3}
                />

                {/* 고대비 모드 버튼 */}
                <Button
                    bg={isHighContrast ? '#3A5A40' : 'black'}
                    color="white"
                    _hover={isHighContrast ? { bg: '#4C7152' } : { bg: '#292929' }}
                    _active={isHighContrast ? { bg: '#2E4634' } : { bg: '#444444' }}
                    fontWeight="bold"
                    px={4}
                    height={{ base: 'auto', md: '65px' }}
                    minH={uiScale[fontSizeLevel].inputH}
                    fontSize={fs}
                    borderRadius="lg"
                    whiteSpace="normal"
                    onClick={toggleHighContrast}
                >
                    {isHighContrast ? '고대비 끄기' : '고대비 켜기'}
                </Button>
            </Flex>
        </Flex>
    );
}
