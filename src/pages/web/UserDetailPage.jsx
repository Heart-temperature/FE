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
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../hooks';
import { useState, useEffect } from 'react';
import { WarningIcon, EditIcon, CalendarIcon, ChatIcon, InfoIcon, CloseIcon } from '@chakra-ui/icons';
import { getUserInfo, getEmotionGraph, getCallDetail, getUserMemos, addUserMemo, updateUserMemo, deleteUserMemo, getLastEmotion } from '../../api';
import { EmotionChart } from '../../components/ui';

export default function UserDetail() {
    const { id } = useParams();
    const { goBack } = useNavigation();
    const navigate = useNavigate();
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
    const [joinedDate, setJoinedDate] = useState('신규 회원');

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        const loadDetailData = async () => {
            try {
                setIsLoading(true);
                
                // API 호출 (userInfo를 먼저 가져와서 loginId를 사용)
                const userInfo = await getUserInfo(id);
                
                if (userInfo) {
                    setUser(userInfo);

                    // 가입일 처리 (localStorage에서 가져오기, 없으면 현재 시간으로 저장)
                    const storageKey = `user_joined_${id}`;
                    const storedDate = localStorage.getItem(storageKey);

                    if (storedDate) {
                        // localStorage에 저장된 날짜가 있으면 사용
                        setJoinedDate(storedDate);
                    } else {
                        // 없으면 현재 날짜로 저장
                        const now = new Date();
                        const formattedDate = now.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        });
                        localStorage.setItem(storageKey, formattedDate);
                        setJoinedDate(formattedDate);
                    }

                    // userInfo의 ID를 사용하여 나머지 API 호출 (병렬 처리)
                    const [emotionGraph, callRecords, userMemos, emotionScore] = await Promise.all([
                        getEmotionGraph(id),
                        getCallDetail(id),
                        getUserMemos(id),
                        getLastEmotion(id),
                    ]);

                    // CallRecord를 날짜순으로 정렬 (오래된 순서: 왼쪽이 옛날, 오른쪽이 최신)
                    const sortedCallRecords = [...callRecords].sort((a, b) => {
                        const dateA = new Date(a.callDate || a.date || a.createdAt || a.callDateTime || 0);
                        const dateB = new Date(b.callDate || b.date || b.createdAt || b.callDateTime || 0);
                        return dateA - dateB; // 오래된 순서 (왼쪽이 옛날, 오른쪽이 최신)
                    });
                    
                    // emotion-graph 데이터에 날짜 정보가 없을 수 있으므로 CallRecord와 매칭
                    const enrichedEmotionData = emotionGraph.map((emotionItem, index) => {
                        // CallRecord에서 해당 인덱스의 기록 찾기 (오래된 순서로 정렬된 것 기준)
                        const matchingRecord = sortedCallRecords[index];
                        
                        if (matchingRecord) {
                            // CallRecordResponse에서 날짜와 시간 추출
                            let dateStr = '';
                            let timeStr = '';
                            
                            // 다양한 날짜 필드명 시도
                            const dateField = matchingRecord.callDate || matchingRecord.date || 
                                            matchingRecord.createdAt || matchingRecord.callDateTime;
                            
                            if (dateField) {
                                try {
                                    const date = new Date(dateField);
                                    if (!isNaN(date.getTime())) {
                                        dateStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                                        timeStr = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                                    } else {
                                        dateStr = String(dateField);
                                    }
                                } catch (e) {
                                    dateStr = String(dateField);
                                }
                            }
                            
                            // emotion 점수 추출
                            let score = 0;
                            if (typeof emotionItem === 'number') {
                                score = emotionItem;
                            } else if (emotionItem && typeof emotionItem === 'object') {
                                score = emotionItem.score || emotionItem.emotion || matchingRecord.emotion || 0;
                            }
                            
                            return {
                                score: score,
                                date: dateStr,
                                time: timeStr,
                                originalDate: dateField ? new Date(dateField) : null, // 정렬용 원본 날짜
                            };
                        }
                        
                        // 매칭되는 기록이 없으면 기존 데이터 사용
                        if (typeof emotionItem === 'number') {
                            return {
                                score: emotionItem,
                                date: '',
                                time: '',
                                originalDate: null,
                            };
                        }
                        
                        // emotionItem에서 원본 날짜 추출 시도
                        const itemDateField = emotionItem?.date || emotionItem?.callDate || emotionItem?.createdAt || emotionItem?.callDateTime;
                        let itemOriginalDate = null;
                        if (itemDateField) {
                            try {
                                const parsed = new Date(itemDateField);
                                if (!isNaN(parsed.getTime())) {
                                    itemOriginalDate = parsed;
                                }
                            } catch (e) {
                                // 날짜 파싱 실패
                            }
                        }
                        
                        return {
                            score: emotionItem?.score || emotionItem?.emotion || 0,
                            date: emotionItem?.date || '',
                            time: emotionItem?.time || '',
                            originalDate: itemOriginalDate,
                        };
                    }).sort((a, b) => {
                        // 날짜순으로 정렬 (오래된 것부터 최신 순서로: 왼쪽이 옛날, 오른쪽이 최신)
                        if (a.originalDate && b.originalDate) {
                            return a.originalDate.getTime() - b.originalDate.getTime();
                        }
                        if (a.originalDate) return -1;
                        if (b.originalDate) return 1;
                        // 날짜가 없으면 원래 순서 유지
                        return 0;
                    });

                    setEmotionData(enrichedEmotionData || []);
                    setCallData(callRecords || []);
                    setMemos(userMemos || []);
                    
                    // call 기록이 없으면 신규 회원으로 처리
                    if (!callRecords || callRecords.length === 0) {
                        setLastEmotion(null); // null이면 "신규"로 표시됨
                    } else {
                        // getLastEmotion API에서 받은 감정 점수를 기반으로 감정상태 결정
                        // 40 이하: 정상, 40~80: 주의, 80 이상: 긴급
                        let emotionStatus = null;
                        if (emotionScore !== null && !isNaN(emotionScore)) {
                            if (emotionScore >= 80) {
                                emotionStatus = { emotion: 'urgent', description: '긴급' };
                            } else if (emotionScore >= 40) {
                                emotionStatus = { emotion: 'caution', description: '주의' };
                            } else {
                                emotionStatus = { emotion: 'normal', description: '정상' };
                            }
                        }
                        // emotion 값이 없거나 유효하지 않은 경우 null로 유지 (신규 회원)
                        setLastEmotion(emotionStatus);
                    }
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

    // 감정 점수 데이터 준비 (enrichedEmotionData가 이미 정규화되어 있음)
    const emotionChartData = emotionData.length > 0 
        ? emotionData.map((item, index) => {
            // enrichedEmotionData는 이미 {score, date, time} 형식으로 정규화됨
            return {
                date: item.date || `기록 ${index + 1}`,
                score: typeof item.score === 'number' ? item.score : 0,
                time: item.time || '',
            };
        })
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
                            {lastEmotion ? lastEmotion.description : '신규'}
                        </Badge>
                        <Button
                            colorScheme="blue"
                            size="md"
                            onClick={() => navigate('/dashboard')}
                        >
                            대시보드로 이동
                        </Button>
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
                                <EmotionChart 
                                    data={emotionChartData}
                                    title="감정 변화 그래프"
                                    width={800}
                                    height={400}
                                />
                                <HStack mt={4} spacing={4} justify="center">
                                    <Tag colorScheme="red" size="sm">
                                        <TagLabel>긴급 (80점 이상)</TagLabel>
                                    </Tag>
                                    <Tag colorScheme="orange" size="sm">
                                        <TagLabel>주의 (40-80점)</TagLabel>
                                    </Tag>
                                    <Tag colorScheme="green" size="sm">
                                        <TagLabel>정상 (40점 미만)</TagLabel>
                                    </Tag>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* AI 대화 히스토리 */}
                        <Card>
                            <CardHeader>
                                <HStack>
                                    <ChatIcon color="green.500" />
                                    <Heading size="md">AI 대화 요약</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                {callData.length > 0 ? (
                                    <Box maxH="400px" overflowY="auto" pr={2}>
                                        <VStack spacing={4} align="stretch">
                                            {callData.map((conv, index) => {
                                                // CallRecordResponse 필드명 처리
                                                const callDate = conv.callDate || conv.date || conv.createdAt || conv.callDateTime;
                                                const emotion = conv.emotion;
                                                const duration = conv.duration || conv.callDuration;
                                                const summary = conv.summary || conv.callSummary || conv.detail || '';
                                                const isNormalFinish = conv.is_normal_finish || conv.isNormalFinish || conv.normalFinish;
                                                
                                                // 날짜 포맷팅
                                                let formattedDate = '';
                                                if (callDate) {
                                                    try {
                                                        const date = new Date(callDate);
                                                        if (!isNaN(date.getTime())) {
                                                            formattedDate = date.toLocaleDateString('ko-KR', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                            });
                                                        } else {
                                                            formattedDate = String(callDate);
                                                        }
                                                    } catch (e) {
                                                        formattedDate = String(callDate);
                                                    }
                                                }
                                                
                                                // 감정 점수를 감정 상태로 변환
                                                let emotionStatus = 'new';
                                                if (typeof emotion === 'number') {
                                                    // 40 이하: 정상, 40~80: 주의, 80 이상: 긴급
                                                    if (emotion >= 80) emotionStatus = 'urgent';
                                                    else if (emotion >= 40) emotionStatus = 'caution';
                                                    else emotionStatus = 'normal';
                                                } else if (typeof emotion === 'string') {
                                                    emotionStatus = emotion;
                                                }
                                                
                                                // is_normal_finish가 1(true)이면 비정상 종료
                                                const isAbnormalFinish = isNormalFinish === 1 || isNormalFinish === true;
                                                
                                                return (
                                                    <Box key={conv.id || conv.callId || index} p={4} bg="gray.50" borderRadius="lg">
                                                        <HStack justify="space-between" mb={2}>
                                                            <Text fontWeight="bold" color="gray.700">
                                                                {formattedDate || '날짜 정보 없음'}
                                                            </Text>
                                                            <HStack spacing={2}>
                                                                {isAbnormalFinish && (
                                                                    <Badge bg="red.500" color="white" size="sm">
                                                                        비정상 종료
                                                                    </Badge>
                                                                )}
                                                                {duration && (
                                                                    <Text fontSize="sm" color="gray.500">
                                                                        {duration}
                                                                    </Text>
                                                                )}
                                                            </HStack>
                                                        </HStack>
                                                        {summary && (
                                                            <Text color="gray.600">{summary}</Text>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </VStack>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" justifyContent="center" h="200px">
                                        <Badge bg="gray.200" color="gray.700" fontSize="lg" px={4} py={2} borderRadius="md">
                                            신규
                                        </Badge>
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
                                <HStack justify="space-between">
                                    <HStack>
                                        <InfoIcon color="purple.500" />
                                        <Heading size="md">개인정보</Heading>
                                    </HStack>
                                    <IconButton
                                        icon={<EditIcon />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="purple"
                                        aria-label="정보 수정"
                                        onClick={() => navigate(`/user/${id}/edit`)}
                                    />
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
                                            가입일
                                        </Text>
                                        <Text>{joinedDate}</Text>
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
