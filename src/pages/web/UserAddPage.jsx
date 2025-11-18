import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../hooks';
import { addUser } from '../../api';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    Textarea,
    useToast,
    Container,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    IconButton,
    useColorModeValue
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon } from '@chakra-ui/icons';

export default function UserAdd() {
    const navigate = useNavigate();
    const { goBack } = useNavigation();
    const toast = useToast();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    // 폼 상태
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        sexuality: '',
        address: '',
        phoneNum: '',
        user_loginPw: '',
        extra_phoneNum: '',
        memo: ''
    });

    // 에러 상태
    const [errors, setErrors] = useState({});

    // 입력값 변경 핸들러
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // 에러가 있으면 제거
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // 나이 계산 함수
    const calculateAge = (birthDate) => {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = '성함을 입력해주세요';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = '생년월일을 선택해주세요';
        } else {
            const age = calculateAge(formData.birthDate);
            if (age < 0) {
                newErrors.birthDate = '미래 날짜는 선택할 수 없습니다';
            }
        }

        if (!formData.sexuality) {
            newErrors.sexuality = '성별을 선택해주세요';
        }

        if (!formData.address.trim()) {
            newErrors.address = '주소를 입력해주세요';
        }

        if (!formData.phoneNum.trim()) {
            newErrors.phoneNum = '연락처를 입력해주세요';
        } else if (!/^010-\d{4}-\d{4}$/.test(formData.phoneNum)) {
            newErrors.phoneNum = '올바른 연락처 형식이 아닙니다 (010-0000-0000)';
        }

        if (!formData.user_loginPw.trim()) {
            newErrors.user_loginPw = '비밀번호를 입력해주세요';
        } else if (!/^\d{4}$/.test(formData.user_loginPw.trim())) {
            newErrors.user_loginPw = '비밀번호는 숫자 4자리여야 합니다';
        }

        if (formData.extra_phoneNum && !/^010-\d{4}-\d{4}$/.test(formData.extra_phoneNum)) {
            newErrors.extra_phoneNum = '올바른 연락처 형식이 아닙니다 (010-0000-0000)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast({
                title: '입력 오류',
                description: '필수 항목을 올바르게 입력해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            // 성별을 M/F 형식으로 변환
            const sexualityMap = {
                '남성': 'M',
                '여성': 'F'
            };
            
            // birthDate를 ISO 8601 형식으로 변환 (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss.SSS)
            const birthDateFormatted = formData.birthDate ? 
                new Date(formData.birthDate).toISOString() : 
                null;

            // API 요청 데이터 구성
            const apiData = {
                user_loginId: formData.phoneNum, // phoneNum을 user_loginId로 사용
                user_loginPw: formData.user_loginPw,
                name: formData.name,
                sexuality: sexualityMap[formData.sexuality] || formData.sexuality, // "남성"/"여성" -> "M"/"F"
                birthDate: birthDateFormatted, // ISO 8601 형식
                address: formData.address,
                phoneNum: formData.phoneNum,
                extra_phoneNum: formData.extra_phoneNum || '',
                memo: formData.memo || '',
            };

            // API 호출
            await addUser(apiData);

            const age = calculateAge(formData.birthDate);
            
            toast({
                title: '사용자 추가 완료!',
                description: `${formData.name}님(만 ${age}세)이 성공적으로 추가되었습니다.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // 대시보드로 이동
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: '사용자 추가 실패',
                description: '서버 오류가 발생했습니다. 다시 시도해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('User Add Error:', error);
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        goBack();
    };

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Header */}
            <Flex 
                as="header" 
                align="center" 
                justify="space-between" 
                p={4} 
                bg="white" 
                borderBottom="1px" 
                borderColor="gray.200"
                boxShadow="sm"
            >
                <HStack spacing={4}>
                    <IconButton
                        icon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        variant="ghost"
                        aria-label="뒤로 가기"
                    />
                    <Heading size="md">사용자 추가</Heading>
                </HStack>
                <HStack spacing={3}>
                    <Button variant="outline" onClick={handleCancel}>
                        취소
                    </Button>
                    <Button 
                        leftIcon={<AddIcon />} 
                        colorScheme="blue" 
                        onClick={handleSubmit}
                    >
                        저장
                    </Button>
                </HStack>
            </Flex>

            <Container maxW="4xl" py={8}>
                <Card bg={cardBg} boxShadow="lg">
                    <CardHeader>
                        <Heading size="lg" color="gray.700">
                            기본 인적사항 입력
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mt={2}>
                            필수 식별 정보를 입력해주세요. 관리자 페이지 목록에 표시됩니다.
                        </Text>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6} align="stretch">
                                {/* 필수 정보 */}
                                <VStack spacing={4} align="stretch">
                                    <Heading size="md" color="gray.700">
                                        필수 정보
                                    </Heading>
                                    
                                    <HStack spacing={4}>
                                        <FormControl isRequired isInvalid={errors.name}>
                                            <FormLabel>성함</FormLabel>
                                            <Input
                                                placeholder="홍길동"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                            />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={errors.sexuality}>
                                            <FormLabel>성별</FormLabel>
                                            <Select
                                                placeholder="성별 선택"
                                                value={formData.sexuality}
                                                onChange={(e) => handleInputChange('sexuality', e.target.value)}
                                            >
                                                <option value="남성">남성</option>
                                                <option value="여성">여성</option>
                                            </Select>
                                            <FormErrorMessage>{errors.sexuality}</FormErrorMessage>
                                        </FormControl>
                                    </HStack>

                                    <HStack spacing={4}>
                                        <FormControl isRequired isInvalid={errors.birthDate}>
                                            <FormLabel>생년월일</FormLabel>
                                            <Input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            />
                                            <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>연세 (자동 계산)</FormLabel>
                                            <Input
                                                value={formData.birthDate ? `만 ${calculateAge(formData.birthDate)}세` : ''}
                                                isReadOnly
                                                bg="gray.50"
                                                placeholder="생년월일을 선택하면 자동으로 계산됩니다"
                                            />
                                        </FormControl>
                                    </HStack>

                                    <FormControl isRequired isInvalid={errors.address}>
                                        <FormLabel>주소</FormLabel>
                                        <Input
                                            placeholder="서울시 강남구 역삼동 123-45"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                        />
                                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.phoneNum}>
                                        <FormLabel>어르신 연락처</FormLabel>
                                        <Input
                                            placeholder="010-1234-5678"
                                            value={formData.phoneNum}
                                            onChange={(e) => handleInputChange('phoneNum', e.target.value)}
                                        />
                                        <FormErrorMessage>{errors.phoneNum}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.user_loginPw}>
                                        <FormLabel>비밀번호 (숫자 4자리)</FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="1234"
                                            value={formData.user_loginPw}
                                            onChange={(e) => handleInputChange('user_loginPw', e.target.value)}
                                            maxLength="4"
                                        />
                                        <FormErrorMessage>{errors.user_loginPw}</FormErrorMessage>
                                    </FormControl>
                                </VStack>

                                <Divider />

                                {/* 선택 정보 */}
                                <VStack spacing={4} align="stretch">
                                    <Heading size="md" color="gray.700">
                                        선택 정보
                                    </Heading>
                                    
                                    <FormControl isInvalid={errors.extra_phoneNum}>
                                        <FormLabel>비상 연락처 (보호자)</FormLabel>
                                        <Input
                                            placeholder="010-9876-5432"
                                            value={formData.extra_phoneNum}
                                            onChange={(e) => handleInputChange('extra_phoneNum', e.target.value)}
                                        />
                                        <FormErrorMessage>{errors.extra_phoneNum}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>특이사항 및 메모</FormLabel>
                                        <Textarea
                                            placeholder="의료 이력, 특이사항, 주의사항 등을 입력해주세요"
                                            value={formData.memo}
                                            onChange={(e) => handleInputChange('memo', e.target.value)}
                                            rows={4}
                                            resize="vertical"
                                        />
                                    </FormControl>
                                </VStack>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>
            </Container>
        </Box>
    );
}
