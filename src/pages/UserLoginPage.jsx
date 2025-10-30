import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Card,
    CardBody,
    CardHeader,
    Container,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';

export default function UserLogin() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [touched, setTouched] = useState(false);
    const [touchedPw, setTouchedPw] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    const isInvalidId = touched && !userId.trim();
    const isInvalidPw = touchedPw && !password.trim();

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        setTouched(true);

        if (!userId.trim() || !password.trim()) {
            toast({
                title: '아이디와 비밀번호를 입력해주세요',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        // 실제 로그인 로직이 있다면 여기에 연동
        toast({
            title: '로그인 성공',
            description: `${userId}님 환영합니다!`,
            status: 'success',
            duration: 1500,
            isClosable: true,
        });

        // 기본 이동 경로 (대시보드)
        navigate('/dashboard');
    };

    return (
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center">
            <Container maxW="md">
                <Card bg={cardBg} boxShadow="lg">
                    <CardHeader>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg">로그인</Heading>
                            <Text color="gray.500" fontSize="sm">
                                아이디를 입력하고 로그인하세요.
                            </Text>
                        </VStack>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={5} align="stretch">
                                <FormControl isRequired isInvalid={isInvalidId}>
                                    <FormLabel>아이디</FormLabel>
                                    <Input
                                        placeholder="예: u1, u2 …"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        onBlur={() => setTouched(true)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit(e);
                                        }}
                                    />
                                    <FormErrorMessage>아이디를 입력해주세요.</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={isInvalidPw}>
                                    <FormLabel>비밀번호</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouchedPw(true)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit(e);
                                        }}
                                    />
                                    <FormErrorMessage>비밀번호를 입력해주세요.</FormErrorMessage>
                                </FormControl>

                                <HStack justify="flex-end">
                                    <Button
                                        colorScheme="blue"
                                        type="submit"
                                        onClick={handleSubmit}
                                        isDisabled={!userId.trim() || !password.trim()}
                                    >
                                        로그인
                                    </Button>
                                </HStack>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>
            </Container>
        </Box>
    );
}
