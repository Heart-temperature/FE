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
    Heading,
    Image,
    VStack,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import dajungIcon from '../../assets/dajung-icon.png';
import { loginAdmin, signUpAdmin } from '../../api';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        loginId: '',
        loginPw: '',
        name: '',
        age: '',
        phoneNum: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleShowToggle = () => setShowPassword(!showPassword);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.loginId.trim()) {
            newErrors.loginId = '아이디를 입력해주세요';
        }

        if (!formData.loginPw.trim()) {
            newErrors.loginPw = '비밀번호를 입력해주세요';
        }

        if (isSignUp) {
            if (!formData.name.trim()) {
                newErrors.name = '이름을 입력해주세요';
            }

            if (!formData.age || formData.age < 0) {
                newErrors.age = '나이를 입력해주세요';
            }

            if (!formData.phoneNum.trim()) {
                newErrors.phoneNum = '연락처를 입력해주세요';
            } else if (!/^\d{10,11}$/.test(formData.phoneNum.replace(/-/g, ''))) {
                newErrors.phoneNum = '올바른 연락처 형식이 아닙니다';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                // 회원가입 요청
                const requestBody = {
                    loginId: formData.loginId.trim(),
                    loginPw: formData.loginPw.trim(),
                    name: formData.name.trim(),
                    age: parseInt(formData.age),
                    phoneNum: formData.phoneNum.trim(),
                };

                await signUpAdmin(requestBody);

                toast({
                    title: '회원가입 성공!',
                    description: '관리자 계정이 생성되었습니다. 이제 로그인해주세요.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });

                // 로그인 폼으로 전환
                setIsSignUp(false);
                setFormData({
                    loginId: formData.loginId,
                    loginPw: formData.loginPw,
                    name: '',
                    age: '',
                    phoneNum: '',
                });
            } else {
                // 로그인 요청
                const result = await loginAdmin(formData.loginId.trim(), formData.loginPw.trim());

                // 토큰 저장
                let token = null;
                
                if (result.token) {
                    token = result.token;
                } else if (result.accessToken) {
                    token = result.accessToken;
                } else if (result.jwtToken) {
                    token = result.jwtToken;
                }

                if (token) {
                    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                    localStorage.setItem('Authorization', bearerToken);
                    localStorage.setItem('adminToken', token);
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('jwtToken', token);
                    
                    // 관리자 아이디 저장
                    localStorage.setItem('adminId', formData.loginId);
                }

                toast({
                    title: '로그인 성공!',
                    description: '관리자 페이지로 이동합니다.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });

                // 대시보드로 이동
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (error) {
            toast({
                title: isSignUp ? '회원가입 실패' : '로그인 실패',
                description: error.message || (isSignUp ? '회원가입에 실패했습니다.' : '아이디 또는 비밀번호가 올바르지 않습니다.'),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error(isSignUp ? 'Sign Up Error:' : 'Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="100vh"
            bg="#F5F7FB"
            px={4}
        >
            {/* 로고 영역 */}
            <Flex direction="column" align="center" mb={10}>
                <Box
                    bg="white"
                    p={4}
                    borderRadius="2xl"
                    boxShadow="md"
                    mb={6}
                    _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
                >
                    <Image src={dajungIcon} h="70px" />
                </Box>
                <Heading size="2xl" color="gray.800" fontWeight="700" letterSpacing="-0.5px">
                    다정이 관리 시스템
                </Heading>
                <Text fontSize="md" color="gray.600" mt={3} fontWeight="500">
                    {isSignUp ? '관리자 계정 생성' : '관리자 로그인'}
                </Text>
            </Flex>

            {/* 로그인 박스 */}
            <Box
                bg="white"
                borderRadius="2xl"
                p={10}
                boxShadow="xl"
                w="100%"
                maxW="440px"
                border="1px"
                borderColor="gray.100"
            >
                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                    {/* 아이디 입력 */}
                    <FormControl isRequired isInvalid={!!errors.loginId}>
                        <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                            아이디
                        </FormLabel>
                        <Input
                            type="text"
                            placeholder="관리자 아이디 입력"
                            value={formData.loginId}
                            onChange={(e) => handleInputChange('loginId', e.target.value)}
                            size="lg"
                            borderColor="gray.200"
                            bg="gray.50"
                            _hover={{ borderColor: 'gray.300', bg: 'white' }}
                            _focus={{
                                borderColor: 'blue.400',
                                boxShadow: '0 0 0 1px #3182ce',
                                bg: 'white'
                            }}
                            borderRadius="xl"
                        />
                        <FormErrorMessage>{errors.loginId}</FormErrorMessage>
                    </FormControl>

                    {/* 비밀번호 입력 */}
                    <FormControl isRequired isInvalid={!!errors.loginPw}>
                        <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                            비밀번호
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호 입력"
                                value={formData.loginPw}
                                onChange={(e) => handleInputChange('loginPw', e.target.value)}
                                size="lg"
                                borderColor="gray.200"
                                bg="gray.50"
                                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                                _focus={{
                                    borderColor: 'blue.400',
                                    boxShadow: '0 0 0 1px #3182ce',
                                    bg: 'white'
                                }}
                                borderRadius="xl"
                            />
                            <InputRightElement h="3rem">
                                <Button
                                    variant="ghost"
                                    onClick={handleShowToggle}
                                    _focus={{ boxShadow: 'none' }}
                                    _hover={{ bg: 'transparent' }}
                                    color="gray.500"
                                >
                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.loginPw}</FormErrorMessage>
                    </FormControl>

                    {/* 회원가입 - 이름 입력 */}
                    {isSignUp && (
                        <FormControl isRequired isInvalid={!!errors.name}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                                이름
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="관리자 이름 입력"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                size="lg"
                                borderColor="gray.200"
                                bg="gray.50"
                                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                                _focus={{
                                    borderColor: 'blue.400',
                                    boxShadow: '0 0 0 1px #3182ce',
                                    bg: 'white'
                                }}
                                borderRadius="xl"
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                    )}

                    {/* 회원가입 - 나이 입력 */}
                    {isSignUp && (
                        <FormControl isRequired isInvalid={!!errors.age}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                                나이
                            </FormLabel>
                            <Input
                                type="number"
                                placeholder="나이 입력"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', e.target.value)}
                                size="lg"
                                borderColor="gray.200"
                                bg="gray.50"
                                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                                _focus={{
                                    borderColor: 'blue.400',
                                    boxShadow: '0 0 0 1px #3182ce',
                                    bg: 'white'
                                }}
                                borderRadius="xl"
                            />
                            <FormErrorMessage>{errors.age}</FormErrorMessage>
                        </FormControl>
                    )}

                    {/* 회원가입 - 연락처 입력 */}
                    {isSignUp && (
                        <FormControl isRequired isInvalid={!!errors.phoneNum}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                                연락처
                            </FormLabel>
                            <Input
                                type="tel"
                                placeholder="01012345678"
                                value={formData.phoneNum}
                                onChange={(e) => handleInputChange('phoneNum', e.target.value)}
                                size="lg"
                                borderColor="gray.200"
                                bg="gray.50"
                                _hover={{ borderColor: 'gray.300', bg: 'white' }}
                                _focus={{
                                    borderColor: 'blue.400',
                                    boxShadow: '0 0 0 1px #3182ce',
                                    bg: 'white'
                                }}
                                borderRadius="xl"
                            />
                            <FormErrorMessage>{errors.phoneNum}</FormErrorMessage>
                        </FormControl>
                    )}

                    {/* 로그인/회원가입 버튼 */}
                    <Button
                        w="100%"
                        colorScheme="blue"
                        size="lg"
                        fontWeight="600"
                        type="submit"
                        isLoading={isLoading}
                        borderRadius="xl"
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                        }}
                        transition="all 0.2s"
                        mt={2}
                    >
                        {isSignUp ? '계정 생성' : '로그인'}
                    </Button>

                    {/* 로그인/회원가입 토글 */}
                    <Box textAlign="center" w="100%">
                        <Text fontSize="sm" color="gray.600">
                            {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
                            <Button
                                variant="link"
                                colorScheme="blue"
                                fontSize="sm"
                                fontWeight="600"
                                ml={2}
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setErrors({});
                                }}
                                _hover={{ textDecoration: 'underline' }}
                            >
                                {isSignUp ? '로그인' : '회원가입'}
                            </Button>
                        </Text>
                    </Box>

                    {/* 안내 메시지 */}
                    {!isSignUp && (
                        <Box
                            bg="blue.50"
                            p={4}
                            borderRadius="xl"
                            w="100%"
                            textAlign="center"
                            border="1px"
                            borderColor="blue.100"
                        >
                            <Text fontSize="xs" color="gray.500" mb={2} fontWeight="600">
                                테스트 계정
                            </Text>
                            <Text fontSize="sm" color="gray.700">
                                아이디: <Text as="span" fontWeight="700" color="blue.600">admin</Text>
                            </Text>
                            <Text fontSize="sm" color="gray.700">
                                비밀번호: <Text as="span" fontWeight="700" color="blue.600">1234</Text>
                            </Text>
                        </Box>
                    )}
                </VStack>
            </Box>

            {/* 하단 정보 */}
            <Text fontSize="sm" color="gray.500" mt={8} fontWeight="500">
                © 2024 다정이 관리 시스템. All rights reserved.
            </Text>
        </Flex>
    );
}

