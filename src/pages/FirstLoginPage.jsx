import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Card,
    CardBody,
    CardHeader,
    Container,
    useToast,
    useColorModeValue,
    HStack,
} from '@chakra-ui/react';

export default function FirstLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    // location.state?.userId 로 전달된 아이디를 초기값으로 활용 가능
    const initialUserId = location.state?.userId || '';

    const [userId] = useState(initialUserId);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [touched, setTouched] = useState({ next: false, confirm: false });

    const pwPolicy = (pw) => pw.length >= 8;
    const isInvalidNew = touched.next && (!newPassword.trim() || !pwPolicy(newPassword));
    const isInvalidConfirm = touched.confirm && (confirmPassword !== newPassword || !confirmPassword.trim());

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        setTouched({ next: true, confirm: true });

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast({ title: '새 비밀번호와 확인을 입력해주세요', status: 'warning', duration: 2000, isClosable: true });
            return;
        }

        if (!pwPolicy(newPassword)) {
            toast({
                title: '새 비밀번호는 8자 이상이어야 합니다',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({ title: '비밀번호가 일치하지 않습니다', status: 'error', duration: 2000, isClosable: true });
            return;
        }

        // 실제 API 연동 시 현재 비밀번호 검증 및 변경 요청 수행
        toast({ title: '비밀번호가 변경되었습니다', status: 'success', duration: 1500, isClosable: true });
        navigate('/dashboard');
    };

    return (
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center">
            <Container maxW="md">
                <Card bg={cardBg} boxShadow="lg">
                    <CardHeader>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg">초기 비밀번호 변경</Heading>
                            <Text color="gray.500" fontSize="sm">
                                보안을 위해 처음 로그인 시 비밀번호 변경이 필요합니다.
                            </Text>
                        </VStack>
                    </CardHeader>
                    <CardBody>
                        <VStack align="stretch" spacing={5} as="form" onSubmit={handleSubmit}>
                            {userId && (
                                <Box>
                                    <Text fontSize="sm" color="gray.600">
                                        아이디
                                    </Text>
                                    <Text fontWeight="bold">{userId}</Text>
                                </Box>
                            )}

                            <FormControl isRequired isInvalid={isInvalidNew}>
                                <FormLabel>새 비밀번호</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="새 비밀번호 (8자 이상)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, next: true }))}
                                />
                                <FormErrorMessage>8자 이상으로 설정해주세요.</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={isInvalidConfirm}>
                                <FormLabel>새 비밀번호 확인</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="새 비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                                />
                                <FormErrorMessage>비밀번호가 일치하지 않습니다.</FormErrorMessage>
                            </FormControl>

                            <HStack justify="flex-end">
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    isDisabled={!newPassword.trim() || !confirmPassword.trim()}
                                >
                                    변경하기
                                </Button>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </Container>
        </Box>
    );
}
