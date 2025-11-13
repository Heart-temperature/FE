import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    HStack,
    Image,
} from '@chakra-ui/react';
import DajeongLogo from '../../assets/image.png';
import { ROUTES } from '../../routes';
import { loginUser } from '../../api/authAPI';
import { s } from 'framer-motion/client';
import usePersistentSettings from '../../hooks/usePersistentSettings';

export default function UserLoginPage() {
    const navigate = useNavigate();
    const { fontSizeLevel, setFontSizeLevel, isHighContrast, toggleHighContrast, fs, inputH, btnH } =
        usePersistentSettings();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await loginUser(id, password);
            console.log('로그인 성공: ', user);
            navigate(ROUTES.USER_APP_HOME);
        } catch (err) {
            setError(err.message || '로그인 중 오류가 발생했습니다.');
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

                        <Input
                            type="tel"
                            value={id}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 11); // 숫자만, 최대 11자리
                                setId(value);
                            }}
                            placeholder="01012345678"
                            fontSize={fs}
                            height={inputH}
                            borderRadius="15px"
                            bg={isHighContrast ? '#000000' : '#F0F8FF'}
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                            color={isHighContrast ? '#FFFFFF' : '#1976D2'}
                            fontWeight="600"
                            textAlign="center"
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
                        <FormLabel
                            fontSize={fs}
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                            fontWeight="700"
                            mb={3}
                            width="fit-content"
                        >
                            비밀번호
                        </FormLabel>
                        <Input
                            type="text"
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
                            textAlign="center"
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

                    {/* ✅ 오류 메시지 표시 (비밀번호 아래, 버튼 위) */}
                    {error && (
                        <Text
                            mt={2}
                            mb={1}
                            color={isHighContrast ? '#FF5252' : 'black'}
                            fontWeight="600"
                            fontSize={fs}
                            textAlign="center"
                        >
                            {error}
                        </Text>
                    )}

                    {/* 로그인 버튼 */}
                    <Button
                        type="submit"
                        bg={isHighContrast ? '#FFD700' : '#2196F3'}
                        color={isHighContrast ? '#000000' : 'white'}
                        w="100%"
                        mx="auto"
                        height={inputH}
                        fontSize={fs}
                        fontWeight="700"
                        borderRadius="15px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                        mt={4}
                        onClick={handleLogin}
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
                                color={
                                    fontSizeLevel === 0
                                        ? isHighContrast
                                            ? '#000000'
                                            : 'white'
                                        : '#000000'
                                }
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
                                color={
                                    fontSizeLevel === 1
                                        ? isHighContrast
                                            ? '#000000'
                                            : 'white'
                                        : '#000000'
                                }
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
                                color={
                                    fontSizeLevel === 2
                                        ? isHighContrast
                                            ? '#000000'
                                            : 'white'
                                        : '#000000'
                                }
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
                                w="100%"
                                h={inputH}
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
