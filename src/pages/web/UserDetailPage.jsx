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
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../hooks';
import { useState, useEffect } from 'react';
import { ArrowBackIcon, WarningIcon, EditIcon, CalendarIcon, ChatIcon, InfoIcon, CloseIcon } from '@chakra-ui/icons';
import { getUserInfo, getEmotionGraph, getCallDetail, getUserMemos, addUserMemo, updateUserMemo, deleteUserMemo, getLastEmotion } from '../../api';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

export default function UserDetail() {
    const { id } = useParams();
    const { goBack } = useNavigation();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [emotionData, setEmotionData] = useState([]);
    const [callData, setCallData] = useState([]);
    const [memos, setMemos] = useState([]);
    const [lastEmotion, setLastEmotion] = useState(null);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [memoText, setMemoText] = useState('');
    const [selectedMemo, setSelectedMemo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmittingMemo, setIsSubmittingMemo] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memoToDelete, setMemoToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        const loadDetailData = async () => {
            try {
                setIsLoading(true);
                
                // API 호출 (userInfo를 먼저 가져와서 loginId를 사용)
                const userInfo = await getUserInfo(id);
                
                if (userInfo) {
                    setUser(userInfo);
                    
                    // userInfo의 loginId를 사용하여 나머지 API 호출 (병렬 처리)
                    const [emotionGraph, callDetail, userMemos, lastEmotionData] = await Promise.all([
                        getEmotionGraph(id),
                        getCallDetail(id),
                        getUserMemos(id),
                        getLastEmotion(userInfo.loginId || userInfo.phoneNum),
                    ]);
                    
                    setEmotionData(emotionGraph || []);
                    setCallData(callDetail || []);
                    setMemos(userMemos || []);
                    setLastEmotion(lastEmotionData);
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
                console.error('Error loading user detail data:', error);
                toast({
                    title: '데이터 로드 실패',
                    description: '사용자 정보를 불러오는데 실패했습니다.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadDetailData();
    }, [id, toast]);

    const getEmotionColor = (emotion) => {
        switch (emotion) {
            case 'urgent':
                return '#D93025';
            case 'caution':
                return '#F9AB00';
            case 'normal':
                return '#1B9A59';
            case 'new':
                return '#718096';
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
            case 'new':
                return '신규';
            default:
                return '신규';
        }
    };

    const handleMemoClick = () => {
        setMemoText('');
        setSelectedMemo(null);
        setIsMemoModalOpen(true);
    };

    const handleMemoEdit = (memo) => {
        setMemoText(memo.memoDetail || memo.content || '');
        setSelectedMemo(memo);
        setIsEditing(true);
        setIsMemoModalOpen(true);
    };

    const handleMemoSave = async () => {
        if (!memoText.trim()) {
            toast({
                title: '메모를 입력해주세요',
                description: '메모 내용을 입력한 후 저장해주세요.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        try {
            setIsSubmittingMemo(true);
            
            // API 호출 (수정 모드면 updateUserMemo, 아니면 addUserMemo)
            if (isEditing && selectedMemo) {
                if (!selectedMemo.id) {
                    throw new Error('메모 ID가 없습니다. 메모를 다시 선택해주세요.');
                }
                await updateUserMemo(selectedMemo.id, memoText.trim());
            } else {
                await addUserMemo(id, memoText.trim());
            }

            toast({
                title: `메모 ${isEditing ? '수정' : '추가'} 완료!`,
                description: `${user.name}님의 메모가 ${isEditing ? '수정' : '추가'}되었습니다.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // 메모 목록 새로고침
            const updatedMemos = await getUserMemos(id);
            setMemos(updatedMemos || []);

            setIsMemoModalOpen(false);
            setMemoText('');
            setSelectedMemo(null);
            setIsEditing(false);
        } catch (error) {
            let errorMessage = '메모 저장 중 오류가 발생했습니다.';
            
            if (error.message) {
                if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
                    errorMessage = '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            toast({
                title: '메모 저장 실패',
                description: errorMessage,
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            console.error('Memo Save Error:', error);
        } finally {
            setIsSubmittingMemo(false);
        }
    };

    const handleMemoCancel = () => {
        setIsMemoModalOpen(false);
        setMemoText('');
        setSelectedMemo(null);
        setIsEditing(false);
    };

    const handleMemoDeleteClick = (memo, e) => {
        e.stopPropagation(); // 메모 클릭 이벤트 전파 방지
        setMemoToDelete(memo);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!memoToDelete || !memoToDelete.id) {
            toast({
                title: '삭제 실패',
                description: '삭제할 메모 정보가 없습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            setIsDeleting(true);
            await deleteUserMemo(memoToDelete.id);
            
            toast({
                title: '메모 삭제 완료!',
                description: '메모가 성공적으로 삭제되었습니다.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // 메모 목록 새로고침
            const updatedMemos = await getUserMemos(id);
            setMemos(updatedMemos || []);

            setIsDeleteModalOpen(false);
            setMemoToDelete(null);
        } catch (error) {
            let errorMessage = '메모 삭제 중 오류가 발생했습니다.';
            
            if (error.message) {
                if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
                    errorMessage = '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            toast({
                title: '메모 삭제 실패',
                description: errorMessage,
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            console.error('Memo Delete Error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setMemoToDelete(null);
    };

    // 감정 점수 데이터 준비
    const emotionChartData = emotionData.length > 0 
        ? emotionData.map((item) => ({
            ...item,
            date: item.date ? item.date.split('-').slice(1).join('/') : '', // MM/DD 형식으로 변환
            emotionText: getEmotionText(item.emotion),
        }))
        : [];

    // 사용자 정보가 없으면 로딩 중이거나 에러 상태
    if (isLoading) {
        return (
            <Box minH="100vh" bg="#F5F7FB" display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="lg" color="gray.500">로딩 중...</Text>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box minH="100vh" bg="#F5F7FB" display="flex" alignItems="center" justifyContent="center">
                <VStack spacing={4}>
                    <Text fontSize="lg" color="gray.500">사용자 정보를 불러올 수 없습니다.</Text>
                    <Button onClick={goBack}>돌아가기</Button>
                </VStack>
            </Box>
        );
    }

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
                                {user.name || '이름 없음'}
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                {user.birthDate ? `${new Date().getFullYear() - new Date(user.birthDate).getFullYear()}세` : '나이 정보 없음'} • {user.address || '주소 정보 없음'}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Badge
                            bg={getEmotionColor(lastEmotion?.emotion || 'new')}
                            color="white"
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="md"
                        >
                            {getEmotionText(lastEmotion?.emotion || 'new')}
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
                                {emotionChartData.length > 0 ? (
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
                                ) : (
                                    <Box h="300px" display="flex" alignItems="center" justifyContent="center">
                                        <Text color="gray.500" fontSize="lg">
                                            기록 없음
                                        </Text>
                                    </Box>
                                )}
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
                                {callData.length > 0 ? (
                                    <Box maxH="400px" overflowY="auto" pr={2}>
                                        <VStack spacing={4} align="stretch">
                                            {callData.map((conv, index) => (
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
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" justifyContent="center" h="200px">
                                        <Text color="gray.500" fontSize="lg">
                                            기록 없음
                                        </Text>
                                    </Box>
                                )}
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
                                        <Text fontWeight="bold">{user.phoneNum || '연락처 정보 없음'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            주소
                                        </Text>
                                        <Text>{user.address || '주소 정보 없음'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            생년월일
                                        </Text>
                                        <Text>{user.birthDate ? new Date(user.birthDate).toLocaleDateString('ko-KR') : '생년월일 정보 없음'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            성별
                                        </Text>
                                        <Badge colorScheme={user.sexuality === 'M' || user.sexuality === '남성' ? 'blue' : 'pink'}>
                                            {user.sexuality === 'M' ? '남성' : user.sexuality === 'F' ? '여성' : user.sexuality || '성별 정보 없음'}
                                        </Badge>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            긴급연락처
                                        </Text>
                                        <Text>{user.extraPhoneNum || '긴급연락처 정보 없음'}</Text>
                                    </Box>
                                    {user.memo && (
                                        <Box>
                                            <Text fontSize="sm" color="gray.600" mb={1}>
                                                특이사항 및 메모
                                            </Text>
                                            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                                                {user.memo}
                                            </Text>
                                        </Box>
                                    )}
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
                                {memos.length > 0 ? (
                                    <Box maxH="350px" overflowY="auto" pr={2}>
                                        <VStack spacing={3} align="stretch">
                                            {memos.map((memo) => (
                                                <Box
                                                    key={memo.id}
                                                    p={3}
                                                    bg="orange.50"
                                                    borderRadius="md"
                                                    borderLeft="4px"
                                                    borderColor="orange.400"
                                                    cursor="pointer"
                                                    _hover={{ 
                                                        bg: "orange.100",
                                                        borderColor: "orange.500",
                                                        boxShadow: "md"
                                                    }}
                                                    transition="all 0.2s"
                                                    onClick={() => handleMemoEdit(memo)}
                                                >
                                                    <HStack justify="space-between" mb={1}>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {memo.createdAt ? new Date(memo.createdAt).toLocaleDateString('ko-KR') : memo.date || '날짜 정보 없음'}
                                                        </Text>
                                                        <IconButton
                                                            icon={<CloseIcon />}
                                                            size="xs"
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            aria-label="메모 삭제"
                                                            onClick={(e) => handleMemoDeleteClick(memo, e)}
                                                            _hover={{ bg: "red.100" }}
                                                        />
                                                    </HStack>
                                                    <Text fontSize="sm">{memo.memoDetail || memo.content || '메모 내용 없음'}</Text>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" justifyContent="center" h="150px">
                                        <Text color="gray.500" fontSize="lg">
                                            기록 없음
                                        </Text>
                                    </Box>
                                )}
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

            {/* 메모 추가/수정 모달 */}
            <Modal isOpen={isMemoModalOpen} onClose={handleMemoCancel} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        메모 {isEditing ? '수정' : '추가'} - {user.name}님
                    </ModalHeader>
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
                                        <Text fontWeight="bold">{user.name || '이름 없음'}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {user.birthDate ? `${new Date().getFullYear() - new Date(user.birthDate).getFullYear()}세` : '나이 정보 없음'} • {user.address || '주소 정보 없음'}
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
                            {isEditing ? '수정' : '추가'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* 메모 삭제 확인 모달 */}
            <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        메모 삭제 확인
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="md" mb={2}>
                                    정말로 이 메모를 삭제하시겠습니까?
                                </Text>
                                {memoToDelete && (
                                    <Box p={3} bg="gray.50" borderRadius="md">
                                        <Text fontSize="sm" color="gray.600" mb={1}>
                                            {memoToDelete.createdAt ? new Date(memoToDelete.createdAt).toLocaleDateString('ko-KR') : memoToDelete.date || '날짜 정보 없음'}
                                        </Text>
                                        <Text fontSize="sm">
                                            {memoToDelete.memoDetail || memoToDelete.content || '메모 내용 없음'}
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                            <Alert status="warning">
                                <AlertIcon />
                                <Text fontSize="sm">이 작업은 되돌릴 수 없습니다.</Text>
                            </Alert>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleCancelDelete} isDisabled={isDeleting}>
                            취소
                        </Button>
                        <Button 
                            colorScheme="red" 
                            onClick={handleConfirmDelete}
                            isLoading={isDeleting}
                            loadingText="삭제 중..."
                        >
                            삭제
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
