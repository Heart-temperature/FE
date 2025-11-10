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
import dajungIcon from '../../assets/img.png';
import { loginAdmin } from '../../api';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState({
        loginId: '',
        loginPw: '',
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
        } catch (error) {
            toast({
                title: '로그인 실패',
                description: error.message || '아이디 또는 비밀번호가 올바르지 않습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Login Error:', error);
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
            bg="white"
            px={4}
            position="relative"
            overflow="hidden"
        >
            {/* 배경 장식 요소들 */}
            <Box
                position="absolute"
                top="-10%"
                right="-5%"
                w="400px"
                h="400px"
                borderRadius="full"
                bgGradient="radial(circle, rgba(59, 130, 246, 0.08), transparent)"
                filter="blur(40px)"
            />
            <Box
                position="absolute"
                bottom="-10%"
                left="-5%"
                w="500px"
                h="500px"
                borderRadius="full"
                bgGradient="radial(circle, rgba(96, 165, 250, 0.06), transparent)"
                filter="blur(40px)"
            />

            {/* 메인 컨텐츠 */}
            <Box position="relative" zIndex={1} w="100%" maxW="460px">
                {/* 로고 영역 */}
                <Flex direction="column" align="center" mb={8}>
                    <Box
                        bg="blue.600"
                        p={6}
                        borderRadius="3xl"
                        boxShadow="0 10px 40px rgba(59, 130, 246, 0.3)"
                        mb={6}
                        transition="all 0.3s ease"
                        _hover={{
                            transform: 'translateY(-5px) scale(1.02)',
                            boxShadow: '0 15px 50px rgba(59, 130, 246, 0.5)'
                        }}
                    >
                        <Image src={dajungIcon} h="80px" />
                    </Box>
                    <Heading
                        size="2xl"
                        color="gray.800"
                        fontWeight="800"
                        letterSpacing="-1px"
                    >
                        다정이 관리 시스템
                    </Heading>
                    <Text
                        fontSize="lg"
                        color="gray.600"
                        mt={3}
                        fontWeight="500"
                    >
                        관리자 로그인
                    </Text>
                </Flex>

                {/* 로그인 박스 */}
                <Box
                    bg="white"
                    borderRadius="3xl"
                    p={10}
                    boxShadow="0 20px 60px rgba(0, 0, 0, 0.1)"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                        {/* 아이디 입력 */}
                        <FormControl isRequired isInvalid={!!errors.loginId}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm" mb={3}>
                                아이디
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="관리자 아이디를 입력하세요"
                                value={formData.loginId}
                                onChange={(e) => handleInputChange('loginId', e.target.value)}
                                size="lg"
                                bg="gray.50"
                                borderColor="gray.200"
                                color="gray.800"
                                _placeholder={{ color: 'gray.500' }}
                                _hover={{
                                    bg: 'white',
                                    borderColor: 'blue.400'
                                }}
                                _focus={{
                                    bg: 'white',
                                    borderColor: 'blue.500',
                                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                                }}
                                borderRadius="xl"
                                fontSize="md"
                                h="56px"
                            />
                            <FormErrorMessage color="red.500">{errors.loginId}</FormErrorMessage>
                        </FormControl>

                        {/* 비밀번호 입력 */}
                        <FormControl isRequired isInvalid={!!errors.loginPw}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm" mb={3}>
                                비밀번호
                            </FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="비밀번호를 입력하세요"
                                    value={formData.loginPw}
                                    onChange={(e) => handleInputChange('loginPw', e.target.value)}
                                    size="lg"
                                    bg="gray.50"
                                    borderColor="gray.200"
                                    color="gray.800"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{
                                        bg: 'white',
                                        borderColor: 'blue.400'
                                    }}
                                    _focus={{
                                        bg: 'white',
                                        borderColor: 'blue.500',
                                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                                    }}
                                    borderRadius="xl"
                                    fontSize="md"
                                    h="56px"
                                />
                                <InputRightElement h="56px" pr={2}>
                                    <Button
                                        variant="ghost"
                                        onClick={handleShowToggle}
                                        _focus={{ boxShadow: 'none' }}
                                        _hover={{ bg: 'gray.100' }}
                                        color="gray.600"
                                        size="sm"
                                    >
                                        {showPassword ? <ViewOffIcon boxSize={5} /> : <ViewIcon boxSize={5} />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage color="red.500">{errors.loginPw}</FormErrorMessage>
                        </FormControl>

                        {/* 로그인 버튼 */}
                        <Button
                            w="100%"
                            size="lg"
                            fontWeight="700"
                            type="submit"
                            isLoading={isLoading}
                            bg="blue.600"
                            color="white"
                            _hover={{
                                bg: 'blue.700',
                                transform: 'translateY(-3px)',
                                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)'
                            }}
                            _active={{
                                transform: 'translateY(-1px)',
                                bg: 'blue.800'
                            }}
                            transition="all 0.3s"
                            mt={4}
                            borderRadius="xl"
                            h="56px"
                            fontSize="lg"
                            boxShadow="0 4px 20px rgba(59, 130, 246, 0.4)"
                        >
                            로그인
                        </Button>

                        {/* 테스트 계정 안내 */}
                        <Box
                            bg="blue.50"
                            p={4}
                            borderRadius="xl"
                            w="100%"
                            textAlign="center"
                            border="1px solid"
                            borderColor="blue.200"
                            mt={2}
                        >
                            <Text fontSize="xs" color="blue.600" mb={2} fontWeight="700" letterSpacing="wider">
                                테스트 계정
                            </Text>
                            <Flex justify="space-around" mt={3}>
                                <Box>
                                    <Text fontSize="xs" color="gray.600" mb={1}>
                                        아이디
                                    </Text>
                                    <Text fontSize="md" fontWeight="800" color="blue.600">
                                        admin
                                    </Text>
                                </Box>
                                <Box h="40px" w="1px" bg="gray.300" />
                                <Box>
                                    <Text fontSize="xs" color="gray.600" mb={1}>
                                        비밀번호
                                    </Text>
                                    <Text fontSize="md" fontWeight="800" color="blue.600">
                                        1234
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </VStack>
                </Box>

                {/* 하단 정보 */}
                <Text
                    fontSize="sm"
                    color="gray.500"
                    mt={8}
                    textAlign="center"
                    fontWeight="500"
                >
                    © 2024 다정이 관리 시스템. All rights reserved.
                </Text>
            </Box>
        </Flex>
    );
}

