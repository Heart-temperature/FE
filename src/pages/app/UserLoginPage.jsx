import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ViewIcon, ViewOffIcon, CloseIcon } from '@chakra-ui/icons';
import DajeongLogo from '../../components/common/image.png';
import { ROUTES } from '../../routes';

export default function UserLoginPage() {
    const navigate = useNavigate();
    const fontSizeLevels = ['작게', '보통', '크게'];
    const fontSizes = ['1.5rem', '1.9rem', '2.5rem'];
    const inputHeights = ['70px', '85px', '110px'];
    const buttonHeights = ['50px', '55px', '65px'];

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [fontSizeLevel, setFontSizeLevel] = useState(1);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const handleShowToggle = () => setShow(!show);
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);
    const handleLogin = () => {
        // TODO: 실제 로그인 로직 추가
        navigate(ROUTES.USER_APP_HOME);
    };

    const fs = fontSizes[fontSizeLevel];
    const inputH = inputHeights[fontSizeLevel];
    const btnH = buttonHeights[fontSizeLevel];

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3}>
            {/* 메인 로그인 카드 */}
            <Box p={{ base: 5, md: 14 }} w="full" maxW="530px">
                <VStack spacing={9} align="stretch">
                    {/* 헤더 */}
                    <Box mb={2} pb={2} borderBottom="2px solid" borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'}>
                        <Image src={DajeongLogo} alt="다정이 로고" maxW="200px" mx="auto" />
                    </Box>

                    {/* 아이디 */}
                    <FormControl>
                        <FormLabel
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            fontWeight="700"
                            mb={3}
                            width="fit-content"
                        >
                            전화번호
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type="number"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="전화번호 입력"
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
                            {id && (
                                <InputRightElement top="50%" transform="translateY(-50%)" pr={3}>
                                    <IconButton
                                        height={inputH}
                                        variant="unstyled"
                                        onClick={() => setId('')}
                                        icon={<CloseIcon boxSize={6} color={isHighContrast ? 'white' : '#2c1026'} />}
                                        aria-label="아이디 입력 초기화"
                                    />
                                </InputRightElement>
                            )}
                        </InputGroup>
                    </FormControl>

                    {/* 비밀번호 */}
                    <FormControl>
                        <FormLabel
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            fontWeight="700"
                            mb={3}
                            width="fit-content"
                        >
                            비밀번호
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호 입력"
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
                            <InputRightElement top="50%" transform="translateY(-50%)" pr={3}>
                                <IconButton
                                    height={inputH}
                                    variant="unstyled"
                                    onClick={handleShowToggle}
                                    icon={
                                        show ? (
                                            <ViewOffIcon boxSize={5} color={isHighContrast ? 'white' : '#2c1026'} />
                                        ) : (
                                            <ViewIcon boxSize={5} color={isHighContrast ? 'white' : '#2c1026'} />
                                        )
                                    }
                                    aria-label="비밀번호 보기 토글"
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    {/* 로그인 버튼 */}
                    <Button
                        bg={isHighContrast ? '#FFD700' : '#2196F3'}
                        color={isHighContrast ? '#000000' : 'white'}
                        w="90%"
                        mx="auto"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        boxShadow="0 4px 10px rgba(33, 150, 243, 0.3)"
                        mt={4}
                        onClick={handleLogin}
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
