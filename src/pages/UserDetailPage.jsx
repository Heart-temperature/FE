import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Avatar,
    Badge,
    Divider,
    Card,
    CardBody,
    CardHeader,
    IconButton,
    useToast,
    Spacer,
    Flex,
    Container,
    Grid,
    GridItem,
    Tag,
    TagLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigation } from '../hooks';
import { useState } from 'react';
import { ArrowBackIcon, WarningIcon, EditIcon, CalendarIcon, ChatIcon, InfoIcon } from '@chakra-ui/icons';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const MOCK_DETAIL = {
    u1: {
        name: '김영희',
        age: 82,
        emotion: 'urgent',
        phone: '010-1234-5678',
        address: '서울시 강남구 역삼동 123-45',
        desc: 'AI 감정분석: 긴급 - 외로움과 불안감 심각',
        lastCall: '5분 전',
        callDuration: '12분',
        callSummary: '외로움과 불안감이 심각한 수준으로 상담 필요',
        gender: '여성',
        medicalHistory: ['고혈압', '당뇨'],
        emergencyContact: '010-9876-5432 (딸)',
        recentActivities: [
            { time: '5분 전', activity: 'AI 통화 완료: 외로움 표현', type: 'emotion' },
            { time: '1시간 전', activity: '복용약 체크 완료', type: 'normal' },
            { time: '3시간 전', activity: 'AI 통화 완료: 일상 대화', type: 'normal' },
        ],
        emotionHistory: [
            { date: '2024-01-15', emotion: 'urgent', score: 1, callDuration: 12 },
            { date: '2024-01-14', emotion: 'caution', score: 2, callDuration: 8 },
            { date: '2024-01-13', emotion: 'urgent', score: 1, callDuration: 15 },
            { date: '2024-01-12', emotion: 'normal', score: 3, callDuration: 5 },
            { date: '2024-01-11', emotion: 'caution', score: 2, callDuration: 10 },
            { date: '2024-01-10', emotion: 'normal', score: 3, callDuration: 6 },
        ],
        memos: [
            {
                id: 1,
                date: '2024-01-15',
                content: '외로움을 많이 표현하심. 가족과의 만남을 원하시는 것 같음.',
                author: '김관리',
            },
            {
                id: 2,
                date: '2024-01-14',
                content: '복용약을 잊어버리시는 경우가 늘어남. 주의 깊게 관찰 필요.',
                author: '김관리',
            },
            {
                id: 3,
                date: '2024-01-12',
                content: '오늘은 기분이 좋아 보이셨음. 정기적인 상담이 도움이 되는 것 같음.',
                author: '이상담',
            },
        ],
        conversations: [
            {
                date: '2024-01-15',
                summary: '외로움과 불안감이 심각한 수준으로 상담 필요',
                duration: '12분',
                emotion: 'urgent',
            },
            { date: '2024-01-14', summary: '우울감 표현, 일상에 대한 관심 저하', duration: '8분', emotion: 'caution' },
            {
                date: '2024-01-13',
                summary: '불안감이 심각, 혼자 있는 시간이 무서워함',
                duration: '15분',
                emotion: 'urgent',
            },
            { date: '2024-01-12', summary: '활기찬 대화, 건강 상태 양호', duration: '5분', emotion: 'normal' },
            { date: '2024-01-11', summary: '복용약 잊음, 기억력 저하 우려', duration: '10분', emotion: 'caution' },
        ],
    },
    u2: {
        name: '이철수',
        age: 76,
        emotion: 'caution',
        phone: '010-2345-6789',
        address: '서울시 서초구 서초동 67-89',
        desc: 'AI 감정분석: 주의 - 우울감과 관심 저하',
        lastCall: '1일 전',
        callDuration: '8분',
        callSummary: '우울감 표현, 일상에 대한 관심 저하',
        gender: '남성',
        medicalHistory: ['우울증', '불안장애'],
        emergencyContact: '010-8765-4321 (아들)',
        recentActivities: [
            { time: '1일 전', activity: 'AI 통화 완료: 우울감 표현', type: 'emotion' },
            { time: '2일 전', activity: '복용약 체크 완료', type: 'normal' },
            { time: '3일 전', activity: 'AI 통화 완료: 일상 대화', type: 'normal' },
        ],
        emotionHistory: [
            { date: '2024-01-15', emotion: 'caution', score: 2, callDuration: 8 },
            { date: '2024-01-14', emotion: 'caution', score: 2, callDuration: 6 },
            { date: '2024-01-13', emotion: 'normal', score: 3, callDuration: 4 },
            { date: '2024-01-12', emotion: 'caution', score: 2, callDuration: 7 },
            { date: '2024-01-11', emotion: 'normal', score: 3, callDuration: 5 },
            { date: '2024-01-10', emotion: 'caution', score: 2, callDuration: 9 },
        ],
        memos: [
            {
                id: 1,
                date: '2024-01-15',
                content: '우울감이 지속되고 있음. 전문 상담사 연계 필요할 수 있음.',
                author: '김관리',
            },
            { id: 2, date: '2024-01-13', content: '오늘은 조금 나아 보이셨음. 꾸준한 관심이 필요.', author: '이상담' },
        ],
        conversations: [
            { date: '2024-01-15', summary: '우울감 표현, 일상에 대한 관심 저하', duration: '8분', emotion: 'caution' },
            { date: '2024-01-14', summary: '우울감 지속, 상담 필요', duration: '6분', emotion: 'caution' },
            { date: '2024-01-13', summary: '활기찬 대화, 건강 상태 양호', duration: '4분', emotion: 'normal' },
            { date: '2024-01-12', summary: '우울감 표현, 관심 저하', duration: '7분', emotion: 'caution' },
        ],
    },
    u3: {
        name: '박순자',
        age: 69,
        emotion: 'normal',
        phone: '010-3456-7890',
        address: '서울시 송파구 잠실동 12-34',
        desc: 'AI 감정분석: 정상 - 긍정적이고 활기찬 대화',
        lastCall: '3시간 전',
        callDuration: '5분',
        callSummary: '활기찬 대화, 건강 상태 양호',
        gender: '여성',
        medicalHistory: ['관절염'],
        emergencyContact: '010-7654-3210 (딸)',
        recentActivities: [
            { time: '3시간 전', activity: 'AI 통화 완료: 기쁜 대화', type: 'emotion' },
            { time: '6시간 전', activity: '복용약 체크 완료', type: 'normal' },
            { time: '1일 전', activity: 'AI 통화 완료: 일상 대화', type: 'normal' },
        ],
        emotionHistory: [
            { date: '2024-01-15', emotion: 'normal', score: 3, callDuration: 5 },
            { date: '2024-01-14', emotion: 'normal', score: 3, callDuration: 6 },
            { date: '2024-01-13', emotion: 'normal', score: 3, callDuration: 4 },
            { date: '2024-01-12', emotion: 'normal', score: 3, callDuration: 7 },
            { date: '2024-01-11', emotion: 'normal', score: 3, callDuration: 5 },
            { date: '2024-01-10', emotion: 'normal', score: 3, callDuration: 6 },
        ],
        memos: [
            {
                id: 1,
                date: '2024-01-15',
                content: '항상 긍정적이고 활기찬 모습. 다른 사용자들의 롤모델이 될 수 있음.',
                author: '김관리',
            },
            {
                id: 2,
                date: '2024-01-12',
                content: '건강 상태가 매우 양호함. 정기적인 체크만 하면 될 것 같음.',
                author: '이상담',
            },
        ],
        conversations: [
            { date: '2024-01-15', summary: '활기찬 대화, 건강 상태 양호', duration: '5분', emotion: 'normal' },
            { date: '2024-01-14', summary: '긍정적인 대화, 일상에 만족', duration: '6분', emotion: 'normal' },
            { date: '2024-01-13', summary: '정상적인 대화, 건강 상태 양호', duration: '4분', emotion: 'normal' },
        ],
    },
};

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goBack } = useNavigation();
    const toast = useToast();
    const user = MOCK_DETAIL[id] || MOCK_DETAIL.u1;
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [memoText, setMemoText] = useState('');

    const getEmotionColor = (emotion) => {
        switch (emotion) {
            case 'urgent':
                return '#D93025';
            case 'caution':
                return '#F9AB00';
            case 'normal':
                return '#1B9A59';
            default:
                return '#718096';
        }
    };

    const getEmotionText = (emotion) => {
        switch (emotion) {
            case 'urgent':
                return '긴급';
            case 'caution':
                return '주의';
            case 'normal':
                return '정상';
            default:
                return '알 수 없음';
        }
    };

    const handleMemoClick = () => {
        setMemoText('');
        setIsMemoModalOpen(true);
    };

    const handleMemoSave = () => {
        if (memoText.trim()) {
            // 여기서 실제로는 서버에 메모를 저장해야 합니다
            toast({
                title: '메모 저장 완료!',
                description: `${user.name}님의 메모가 저장되었습니다.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            setIsMemoModalOpen(false);
            setMemoText('');
        } else {
            toast({
                title: '메모를 입력해주세요',
                description: '메모 내용을 입력한 후 저장해주세요.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleMemoCancel = () => {
        setIsMemoModalOpen(false);
        setMemoText('');
    };

    // 감정 점수 데이터 준비
    const emotionChartData = user.emotionHistory.map((item) => ({
        ...item,
        date: item.date.split('-').slice(1).join('/'), // MM/DD 형식으로 변환
        emotionText: getEmotionText(item.emotion),
    }));

    return (
        <Box minH="100vh" bg="#F5F7FB">
            {/* Header */}
            <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
                <Container maxW="7xl" py={4}>
                    <HStack spacing={4}>
                        <IconButton icon={<ArrowBackIcon />} variant="ghost" onClick={goBack} aria-label="뒤로가기" />
                        <Avatar size="md" name={user.name} />
                        <VStack align="start" spacing={0}>
                            <Heading size="md" color="#1B9A59">
                                {user.name}
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                {user.age}세 • {user.address}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Badge
                            bg={getEmotionColor(user.emotion)}
                            color="white"
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="md"
                        >
                            {getEmotionText(user.emotion)}
                        </Badge>
                    </HStack>
                </Container>
            </Box>

            <Container maxW="7xl" py={8}>
                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
                    {/* Left Column - Main Content */}
                    <VStack spacing={6} align="stretch">
                        {/* 감정 그래프 */}
                        <Card>
                            <CardHeader>
                                <HStack>
                                    <CalendarIcon color="blue.500" />
                                    <Heading size="md">감정 변화 그래프</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <Box h="300px">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={emotionChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis domain={[0, 3]} />
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    name === 'score' ? `${value}점` : value,
                                                    name === 'score' ? '감정점수' : '통화시간',
                                                ]}
                                                labelFormatter={(label) => `날짜: ${label}`}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3182ce"
                                                fill="#3182ce"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                                <HStack mt={4} spacing={4} justify="center">
                                    <Tag colorScheme="red" size="sm">
                                        <TagLabel>긴급 (1점)</TagLabel>
                                    </Tag>
                                    <Tag colorScheme="yellow" size="sm">
                                        <TagLabel>주의 (2점)</TagLabel>
                                    </Tag>
                                    <Tag colorScheme="green" size="sm">
                                        <TagLabel>정상 (3점)</TagLabel>
                                    </Tag>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* AI 대화 히스토리 */}
                        <Card>
                            <CardHeader>
                                <HStack>
                                    <ChatIcon color="green.500" />
                                    <Heading size="md">AI 대화 히스토리</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    {user.conversations.map((conv, index) => (
                                        <Box key={index} p={4} bg="gray.50" borderRadius="lg">
                                            <HStack justify="space-between" mb={2}>
                                                <Text fontWeight="bold" color="gray.700">
                                                    {conv.date}
                                                </Text>
                                                <HStack spacing={2}>
                                                    <Badge bg={getEmotionColor(conv.emotion)} color="white" size="sm">
                                                        {getEmotionText(conv.emotion)}
                                                    </Badge>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {conv.duration}
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                            <Text color="gray.600">{conv.summary}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>

                    {/* Right Column - Sidebar */}
                    <VStack spacing={6} align="stretch">
                        {/* 개인정보 카드 */}
                        <Card>
                            <CardHeader>
                                <HStack>
                                    <InfoIcon color="purple.500" />
                                    <Heading size="md">개인정보</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            연락처
                                        </Text>
                                        <Text fontWeight="bold">{user.phone}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            주소
                                        </Text>
                                        <Text>{user.address}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            성별
                                        </Text>
                                        <Badge colorScheme={user.gender === '남성' ? 'blue' : 'pink'}>
                                            {user.gender}
                                        </Badge>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            응급연락처
                                        </Text>
                                        <Text>{user.emergencyContact}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            의료이력
                                        </Text>
                                        <HStack spacing={2} wrap="wrap">
                                            {user.medicalHistory.map((history, index) => (
                                                <Tag key={index} size="sm" colorScheme="red">
                                                    <TagLabel>{history}</TagLabel>
                                                </Tag>
                                            ))}
                                        </HStack>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* 관리자 메모 */}
                        <Card>
                            <CardHeader>
                                <HStack>
                                    <EditIcon color="orange.500" />
                                    <Heading size="md">관리자 메모</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={3} align="stretch">
                                    {user.memos.map((memo) => (
                                        <Box
                                            key={memo.id}
                                            p={3}
                                            bg="orange.50"
                                            borderRadius="md"
                                            borderLeft="4px"
                                            borderColor="orange.400"
                                        >
                                            <HStack justify="space-between" mb={1}>
                                                <Text fontSize="sm" color="gray.600">
                                                    {memo.date}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {memo.author}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="sm">{memo.content}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* 액션 버튼 */}
                        <Card>
                            <CardBody>
                                <Button
                                    leftIcon={<EditIcon />}
                                    colorScheme="blue"
                                    size="lg"
                                    w="full"
                                    onClick={handleMemoClick}
                                >
                                    메모 추가
                                </Button>
                            </CardBody>
                        </Card>
                    </VStack>
                </Grid>
            </Container>

            {/* 메모 추가 모달 */}
            <Modal isOpen={isMemoModalOpen} onClose={handleMemoCancel} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>메모 추가 - {user.name}님</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="sm" color="gray.600" mb={2}>
                                    사용자 정보
                                </Text>
                                <HStack spacing={3}>
                                    <Avatar size="sm" name={user.name} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold">{user.name}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {user.age}세 • {user.address}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>

                            <Box>
                                <Text fontSize="sm" color="gray.600" mb={2}>
                                    메모 내용
                                </Text>
                                <Textarea
                                    placeholder="메모를 입력해주세요..."
                                    value={memoText}
                                    onChange={(e) => setMemoText(e.target.value)}
                                    rows={4}
                                    resize="vertical"
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleMemoCancel}>
                            취소
                        </Button>
                        <Button colorScheme="blue" onClick={handleMemoSave}>
                            저장
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
