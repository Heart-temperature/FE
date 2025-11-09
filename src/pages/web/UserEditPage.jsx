import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigation } from '../../hooks';
import { updateUser, updateUserInfoMemo, getUserInfo } from '../../api';
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
import { ArrowBackIcon, EditIcon } from '@chakra-ui/icons';

export default function UserEditPage() {
    const { id } = useParams();
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
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // 사용자 정보 로드
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoadingUser(true);
                const userInfo = await getUserInfo(id);
                
                if (userInfo) {
                    // API 응답 형식에 맞게 폼 데이터 설정
                    setFormData({
                        name: userInfo.name || '',
                        birthDate: userInfo.birthDate ? userInfo.birthDate.split('T')[0] : '', // ISO 형식에서 날짜만 추출
                        sexuality: userInfo.sexuality === 'M' ? '남성' : userInfo.sexuality === 'F' ? '여성' : '',
                        address: userInfo.address || '',
                        phoneNum: userInfo.phoneNum || '',
                        user_loginPw: '',
                        extra_phoneNum: userInfo.extraPhoneNum || '',
                        memo: userInfo.memo || ''
                    });
                } else {
                    toast({
                        title: '사용자 정보 없음',
                        description: '사용자 정보를 불러올 수 없습니다.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                toast({
                    title: '사용자 정보 로드 실패',
                    description: '사용자 정보를 불러오는데 실패했습니다.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoadingUser(false);
            }
        };

        if (id) {
            loadUserData();
        }
    }, [id, toast]);

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

        if (formData.extra_phoneNum && !/^010-\d{4}-\d{4}$/.test(formData.extra_phoneNum)) {
            newErrors.extra_phoneNum = '올바른 연락처 형식이 아닙니다 (010-0000-0000)';
        }

        if (formData.user_loginPw && !/^\d{4}$/.test(formData.user_loginPw.trim())) {
            newErrors.user_loginPw = '비밀번호는 숫자 4자리여야 합니다';
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
            setIsLoading(true);
            
            // 성별을 M/F 형식으로 변환
            const sexualityMap = {
                '남성': 'M',
                '여성': 'F'
            };
            
            // birthDate를 ISO 8601 형식으로 변환 (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss.SSS)
            const birthDateFormatted = formData.birthDate ? 
                new Date(formData.birthDate).toISOString() : 
                null;
            
            // API 요청 데이터 구성 (메모 제외)
            const apiData = {
                user_loginId: formData.phoneNum,
                name: formData.name,
                sexuality: sexualityMap[formData.sexuality] || formData.sexuality, // "남성"/"여성" -> "M"/"F"
                birthDate: birthDateFormatted, // ISO 8601 형식
                address: formData.address,
                phoneNum: formData.phoneNum,
                user_loginPw: formData.user_loginPw || '',
                extra_phoneNum: formData.extra_phoneNum || '',
            };

            // 사용자 정보 업데이트 API 호출
            await updateUser(id, apiData);
            
            // 메모는 별도 API로 업데이트
            await updateUserInfoMemo(id, formData.memo || '');

            const age = calculateAge(formData.birthDate);
            
            toast({
                title: '사용자 정보 수정 완료!',
                description: `${formData.name}님(만 ${age}세)의 정보가 성공적으로 수정되었습니다.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // 상세 페이지로 이동
            navigate(`/user/${id}`);
        } catch (error) {
            toast({
                title: '정보 수정 실패',
                description: '서버 오류가 발생했습니다. 다시 시도해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('User Edit Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        goBack();
    };

    // 로딩 중일 때
    if (isLoadingUser) {
        return (
            <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="lg" color="gray.500">로딩 중...</Text>
            </Box>
        );
    }

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
                    <Heading size="md">{formData.name} - 정보 수정</Heading>
                </HStack>
                <HStack spacing={3}>
                    <Button variant="outline" onClick={handleCancel} isDisabled={isLoading}>
                        취소
                    </Button>
                    <Button 
                        leftIcon={<EditIcon />} 
                        colorScheme="blue" 
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        저장
                    </Button>
                </HStack>
            </Flex>

            <Container maxW="4xl" py={8}>
                <Card bg={cardBg} boxShadow="lg">
                    <CardHeader>
                        <Heading size="lg" color="gray.700">
                            사용자 정보 수정
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mt={2}>
                            변경할 정보를 입력하고 저장해주세요.
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

                                    <FormControl isInvalid={errors.user_loginPw}>
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
