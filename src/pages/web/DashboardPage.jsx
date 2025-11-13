import {
    Box,
    Flex,
    Heading,
    Button,
    Text,
    Badge,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    VStack,
    HStack,
    IconButton,
    useToast,
    Avatar,
    Spacer,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Checkbox,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    Tooltip,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
    Image,
    Grid,
    GridItem,
    Icon,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dajungIcon from '../../assets/image.png';
import { fetchUserList, deleteUser, addUserMemo, getLastEmotion, getLastCall } from '../../api';
import { calculateAge } from '../../utils/dateUtils';
import {
    SearchIcon,
    TimeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
    AddIcon,
    EditIcon,
    ViewIcon,
    WarningIcon,
    DeleteIcon,
    InfoIcon,
    CheckCircleIcon,
    StarIcon,
} from '@chakra-ui/icons';
import {
    FiUsers,
    FiAlertTriangle,
    FiAlertCircle,
    FiCheckCircle,
    FiMessageSquare,
    FiEdit2,
    FiEye,
} from 'react-icons/fi';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [users, setUsers] = useState([]); // API에서 받아온 사용자 목록
    const [isLoading, setIsLoading] = useState(false);
    const [filterEmotion, setFilterEmotion] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortField, setSortField] = useState('lastCall');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [selectedUserForMemo, setSelectedUserForMemo] = useState(null);
    const [memoText, setMemoText] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 시간 문자열을 분 단위로 변환하는 함수
    const convertTimeToMinutes = (timeStr) => {
        if (!timeStr) return Infinity;
        const parts = timeStr.split(' ');
        const value = parseInt(parts[0]);
        const unit = parts[1];

        if (unit === '분') return value;
        if (unit === '시간') return value * 60;
        if (unit === '일') return value * 24 * 60;
        if (unit === '주') return value * 7 * 24 * 60;
        if (unit === '개월') return value * 30 * 24 * 60;
        if (unit === '년') return value * 365 * 24 * 60;
        return Infinity;
    };

    // 필터링된 사용자 목록
    const filteredUsers = users.filter((user) => {
        const matchesEmotion = filterEmotion === 'all' || user.emotion === filterEmotion;
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone && user.phone.includes(searchTerm)) ||
            (user.phoneNum && user.phoneNum.includes(searchTerm));
        return matchesEmotion && matchesSearch;
    });

    // 정렬된 사용자 목록
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'emotion') {
            const emotionOrder = { urgent: 0, caution: 1, normal: 2 };
            aValue = emotionOrder[aValue] ?? 3;
            bValue = emotionOrder[bValue] ?? 3;
        } else if (sortField === 'lastCall') {
            aValue = convertTimeToMinutes(aValue);
            bValue = convertTimeToMinutes(bValue);
        }

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    // 페이지네이션
    const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    const handleMemoClick = (user) => {
        setSelectedUserForMemo(user);
        setMemoText('');
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
            // API 호출로 메모 저장
            await addUserMemo(selectedUserForMemo.id, memoText.trim());

            toast({
                title: '메모 저장 완료!',
                description: `${selectedUserForMemo.name}님의 메모가 저장되었습니다.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            setIsMemoModalOpen(false);
            setMemoText('');
            setSelectedUserForMemo(null);
        } catch (error) {
            toast({
                title: '메모 저장 실패',
                description: error.message || '메모 저장 중 오류가 발생했습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Memo Save Error:', error);
        }
    };

    const handleMemoCancel = () => {
        setIsMemoModalOpen(false);
        setMemoText('');
        setSelectedUserForMemo(null);
    };

    const handleAction = (action, user) => {
        if (action === '사용자 추가') {
            navigate('/user/add');
        } else {
            toast({
                title: `${action} 완료!`,
                description: `${user.name}님에게 ${action} 요청이 전송되었습니다.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteClick = () => {
        if (selectedRows.length === 0) {
            toast({
                title: '선택된 사용자 없음',
                description: '삭제할 사용자를 선택해주세요.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        // 삭제 확인 모달 열기
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);

            // 선택된 사용자 정보 가져오기
            const selectedUsers = paginatedUsers.filter((user) => selectedRows.includes(user.id));
            const userNames = selectedUsers.map((u) => u.name).join(', ');

            // 선택된 사용자 삭제
            for (const userId of selectedRows) {
                await deleteUser(userId);
            }

            toast({
                title: '사용자 삭제 완료!',
                description: `${userNames}님이 삭제되었습니다.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // 선택 초기화 및 목록 새로고침
            setSelectedRows([]);
            setIsDeleteModalOpen(false);

            // 목록 다시 불러오기
            await loadUserList();
        } catch (error) {
            toast({
                title: '사용자 삭제 실패',
                description: error.message || '삭제 중 오류가 발생했습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Delete User Error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(paginatedUsers.map((user) => user.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (userId, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, userId]);
        } else {
            setSelectedRows(selectedRows.filter((id) => id !== userId));
        }
    };

    const getEmotionColor = (emotion) => {
        switch (emotion) {
            case 'urgent':
                return '#EF4444'; // 빨강 - 긴급 (Tailwind red-500)
            case 'caution':
                return '#F59E0B'; // 주황 - 주의 (Tailwind amber-500)
            case 'normal':
                return '#10B981'; // 초록 - 정상 (Tailwind emerald-500)
            case 'new':
                return '#3B82F6'; // 파랑 - 신규 회원 (Tailwind blue-500)
            default:
                return '#6B7280'; // 회색 - 알 수 없음 (Tailwind gray-500)
        }
    };

    // API에서 사용자 목록 받아오기
    const loadUserList = async () => {
        try {
            setIsLoading(true);

            const adminId = localStorage.getItem('adminId');

            if (!adminId) {
                toast({
                    title: '관리자 정보 없음',
                    description: '관리자 ID를 찾을 수 없습니다. 다시 로그인해주세요.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setUsers([]);
                return;
            }

            const dbUsers = await fetchUserList(adminId);

            // DB 데이터를 MOCK 형식으로 변환하고 감정상태, 통화 정보 조회
            const userList = await Promise.all(
                dbUsers.map(async (user) => {
                    // 감정상태 조회 (에러 발생 시 null 반환)
                    // 백엔드가 user_login_id (String)를 기대하므로 user.loginId 사용
                    let emotionData = null;
                    try {
                        emotionData = await getLastEmotion(user.loginId || user.phoneNum);
                    } catch (error) {
                        emotionData = null;
                    }

                    // 통화 정보 조회 (에러 발생 시 null 반환)
                    // 백엔드가 user_login_id (String)를 기대하므로 user.loginId 사용
                    let callData = null;
                    try {
                        callData = await getLastCall(user.loginId || user.phoneNum);
                    } catch (error) {
                        callData = null;
                    }

                    // 감정상태 결정 (API 데이터 있으면 사용, 없으면 'new')
                    let emotion = 'new';
                    let desc = '신규 회원';
                    if (emotionData) {
                        emotion = emotionData.emotion || 'new';
                        desc = emotionData.description || '신규 회원';
                    }

                    // 통화 정보 결정 (API 데이터 있으면 사용, 없으면 '신규')
                    let lastCall = '신규';
                    let callDuration = '-';
                    let callSummary = user.memo || '메모 없음';
                    if (callData) {
                        lastCall = callData.lastCall || '신규';
                        callDuration = callData.duration || '-';
                        callSummary = callData.summary || user.memo || '메모 없음';
                    }

                    // 생년월일로부터 나이 계산
                    // birthDate가 ISO 형식(YYYY-MM-DDTHH:mm:ss.SSS)일 수 있으므로 날짜 부분만 추출
                    const birthDateStr = user.birthDate
                        ? user.birthDate.includes('T')
                            ? user.birthDate.split('T')[0]
                            : user.birthDate
                        : null;
                    const age = birthDateStr ? calculateAge(birthDateStr) : 0;

                    // 성별 변환 (M -> 남성, F -> 여성)
                    let gender = '미지정';
                    if (user.sexuality === 'M') {
                        gender = '남성';
                    } else if (user.sexuality === 'F') {
                        gender = '여성';
                    } else if (user.sexuality === '남성' || user.sexuality === '여성') {
                        gender = user.sexuality;
                    }

                    // 가입일 처리 (localStorage에서 가져오기, 없으면 현재 시간으로 저장)
                    let joinedDate = '신규 회원';
                    const storageKey = `user_joined_${user.id}`;
                    const storedDate = localStorage.getItem(storageKey);

                    if (storedDate) {
                        // localStorage에 저장된 날짜가 있으면 사용
                        joinedDate = storedDate;
                    } else {
                        // 없으면 현재 날짜로 저장
                        const now = new Date();
                        joinedDate = now.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        });
                        localStorage.setItem(storageKey, joinedDate);
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        age: age,
                        emotion: emotion,
                        desc: desc,
                        lastCall: lastCall,
                        phone: user.phoneNum,
                        address: user.address || '',
                        joinedDate: joinedDate,
                        lastActive: lastCall === '신규' ? '신규' : lastCall,
                        gender: gender,
                        callDuration: callDuration,
                        callSummary: callSummary,
                        _dbData: user,
                    };
                })
            );

            setUsers(userList);
        } catch (error) {
            console.error('Error fetching user list:', error);
            toast({
                title: '사용자 목록 로드 실패',
                description: '사용자 목록을 불러오는데 실패했습니다. 다시 시도해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 및 경로 변경 시 사용자 목록 받아오기
    // 사용자 정보 수정 후 대시보드로 돌아올 때 최신 정보를 가져오기 위해 location을 의존성에 추가
    useEffect(() => {
        loadUserList();
    }, [location.pathname]);

    // 로그아웃 함수
    const handleLogout = () => {
        // localStorage에서 토큰 및 관리자 정보 제거
        localStorage.removeItem('adminToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('Authorization');
        localStorage.removeItem('adminId');

        toast({
            title: '로그아웃 성공!',
            description: '관리자 로그인 페이지로 이동합니다.',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });

        // 로그인 페이지로 이동
        setTimeout(() => navigate('/admin/login'), 1000);
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
                return '알 수 없음';
        }
    };

    const bgColor = useColorModeValue('#F5F7FB', 'gray.800');
    const cardBg = useColorModeValue('white', 'gray.700');

    // 통계 데이터 계산
    const stats = {
        total: users.length,
        urgent: users.filter((u) => u.emotion === 'urgent').length,
        caution: users.filter((u) => u.emotion === 'caution').length,
        normal: users.filter((u) => u.emotion === 'normal').length,
    };

    return (
        <Box bg={bgColor} minH="100vh">
            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" px={8} py={5}>
                <VStack spacing={4} align="stretch">
                    <Flex align="center" justify="space-between">
                        <HStack spacing={4}>
                            <Image src={dajungIcon} alt="Dajung Icon" boxSize="50px" />
                            <VStack align="start" spacing={0}>
                                <Heading size="lg" color="gray.900" fontWeight="700">
                                    관리자 대시보드
                                </Heading>
                            </VStack>
                        </HStack>

                        <HStack spacing={3}>
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="blue"
                                size="sm"
                                variant="solid"
                                onClick={() => handleAction('사용자 추가', { name: '새 사용자' })}
                            >
                                사용자 추가
                            </Button>
                            <Button
                                leftIcon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                variant="outline"
                                onClick={handleDeleteClick}
                                isDisabled={selectedRows.length === 0}
                            >
                                {selectedRows.length > 0 ? `삭제 (${selectedRows.length})` : '삭제'}
                            </Button>
                            <HStack
                                spacing={2}
                                bg="gray.50"
                                px={4}
                                py={2}
                                borderRadius="md"
                                border="1px"
                                borderColor="gray.200"
                            >
                                <Text fontSize="sm" fontWeight="600" color="gray.700">
                                    김관리
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    관리자
                                </Text>
                            </HStack>
                            <Button size="sm" variant="ghost" colorScheme="gray" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Action Bar */}
                    <Flex align="center" justify="flex-start" wrap="wrap" gap={3}>
                        <InputGroup maxW="320px">
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="이름, 주소, 전화번호 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                bg="gray.50"
                                border="1px"
                                borderColor="gray.200"
                                _hover={{ borderColor: 'gray.300' }}
                                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce', bg: 'white' }}
                            />
                        </InputGroup>

                        <Select
                            value={filterEmotion}
                            onChange={(e) => setFilterEmotion(e.target.value)}
                            maxW="140px"
                            bg="gray.50"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'gray.300' }}
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce', bg: 'white' }}
                        >
                            <option value="all">전체 상태</option>
                            <option value="urgent">긴급</option>
                            <option value="caution">주의</option>
                            <option value="normal">정상</option>
                        </Select>
                    </Flex>
                </VStack>
            </Box>

            {/* Statistics Cards */}
            <Container maxW="full" px={6} py={6}>
                <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
                    {/* Total Users Card */}
                    <GridItem>
                        <Box
                            bg="white"
                            borderRadius="lg"
                            p={5}
                            border="1px"
                            borderColor="gray.200"
                            borderTop="3px solid"
                            borderTopColor="blue.500"
                        >
                            <Flex justify="space-between" align="start">
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="600"
                                        mb={2}
                                        textTransform="uppercase"
                                    >
                                        총 사용자
                                    </Text>
                                    <Heading size="xl" color="gray.900" mb={1}>
                                        {stats.total}
                                    </Heading>
                                </Box>
                                <Box bg="blue.50" p={2} borderRadius="md">
                                    <Icon as={FiUsers} boxSize={5} color="blue.600" />
                                </Box>
                            </Flex>
                        </Box>
                    </GridItem>

                    {/* Urgent Users Card */}
                    <GridItem>
                        <Box
                            bg="white"
                            borderRadius="lg"
                            p={5}
                            border="1px"
                            borderColor="gray.200"
                            borderTop="3px solid"
                            borderTopColor="red.500"
                        >
                            <Flex justify="space-between" align="start">
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="600"
                                        mb={2}
                                        textTransform="uppercase"
                                    >
                                        긴급 상태
                                    </Text>
                                    <Heading size="xl" color="gray.900" mb={1}>
                                        {stats.urgent}
                                    </Heading>
                                </Box>
                                <Box bg="red.50" p={2} borderRadius="md">
                                    <Icon as={FiAlertCircle} boxSize={5} color="red.600" />
                                </Box>
                            </Flex>
                        </Box>
                    </GridItem>

                    {/* Caution Users Card */}
                    <GridItem>
                        <Box
                            bg="white"
                            borderRadius="lg"
                            p={5}
                            border="1px"
                            borderColor="gray.200"
                            borderTop="3px solid"
                            borderTopColor="orange.500"
                        >
                            <Flex justify="space-between" align="start">
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="600"
                                        mb={2}
                                        textTransform="uppercase"
                                    >
                                        주의 상태
                                    </Text>
                                    <Heading size="xl" color="gray.900" mb={1}>
                                        {stats.caution}
                                    </Heading>
                                </Box>
                                <Box bg="orange.50" p={2} borderRadius="md">
                                    <Icon as={FiAlertTriangle} boxSize={5} color="orange.600" />
                                </Box>
                            </Flex>
                        </Box>
                    </GridItem>

                    {/* Normal Users Card */}
                    <GridItem>
                        <Box
                            bg="white"
                            borderRadius="lg"
                            p={5}
                            border="1px"
                            borderColor="gray.200"
                            borderTop="3px solid"
                            borderTopColor="green.500"
                        >
                            <Flex justify="space-between" align="start">
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="600"
                                        mb={2}
                                        textTransform="uppercase"
                                    >
                                        정상 상태
                                    </Text>
                                    <Heading size="xl" color="gray.900" mb={1}>
                                        {stats.normal}
                                    </Heading>
                                </Box>
                                <Box bg="green.50" p={2} borderRadius="md">
                                    <Icon as={FiCheckCircle} boxSize={5} color="green.600" />
                                </Box>
                            </Flex>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>

            {/* Main Content - Table */}
            <Container maxW="full" px={6} pb={8}>
                <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
                    <Box px={6} py={4} borderBottom="1px" borderColor="gray.200">
                        <Heading size="md" color="gray.900" fontWeight="700">
                            사용자 목록
                        </Heading>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                            등록된 모든 사용자를 관리하고 모니터링합니다
                        </Text>
                    </Box>
                    <TableContainer>
                        <Table variant="simple" size="md">
                            <Thead bg="gray.50" borderBottom="2px" borderColor="gray.200">
                                <Tr>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Checkbox
                                            isChecked={
                                                selectedRows.length === paginatedUsers.length &&
                                                paginatedUsers.length > 0
                                            }
                                            isIndeterminate={
                                                selectedRows.length > 0 && selectedRows.length < paginatedUsers.length
                                            }
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            fontSize="md"
                                            onClick={() => handleSort('name')}
                                            rightIcon={
                                                sortField === 'name' ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )
                                                ) : null
                                            }
                                        >
                                            이름
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        연락처
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        주소
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            fontSize="md"
                                            onClick={() => handleSort('emotion')}
                                            rightIcon={
                                                sortField === 'emotion' ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )
                                                ) : null
                                            }
                                        >
                                            감정상태
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            fontSize="md"
                                            onClick={() => handleSort('gender')}
                                            rightIcon={
                                                sortField === 'gender' ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )
                                                ) : null
                                            }
                                        >
                                            성별
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            fontSize="md"
                                            onClick={() => handleSort('joinedDate')}
                                            rightIcon={
                                                sortField === 'joinedDate' ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )
                                                ) : null
                                            }
                                        >
                                            가입일
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            fontSize="md"
                                            onClick={() => handleSort('lastCall')}
                                            rightIcon={
                                                sortField === 'lastCall' ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )
                                                ) : null
                                            }
                                        >
                                            마지막 통화
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3} textAlign="center" fontSize="md" fontWeight="600">
                                        액션
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paginatedUsers.map((user) => (
                                    <Tr
                                        key={user.id}
                                        _hover={{ bg: 'gray.50' }}
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                    >
                                        <Td px={4} py={3} textAlign="center">
                                            <Checkbox
                                                isChecked={selectedRows.includes(user.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectRow(user.id, e.target.checked);
                                                }}
                                            />
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <HStack spacing={3} justify="center">
                                                <Avatar size="sm" name={user.name} />
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium" fontSize="md">
                                                        {user.name}
                                                    </Text>
                                                    <Text fontSize="md" color="gray.500">
                                                        {user.age}세
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <Text fontSize="md">{user.phone}</Text>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <Text fontSize="md" color="gray.600">
                                                {user.address}
                                            </Text>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <Badge
                                                bg={getEmotionColor(user.emotion)}
                                                color="white"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {getEmotionText(user.emotion)}
                                            </Badge>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <Badge
                                                colorScheme={user.gender === '남성' ? 'blue' : 'pink'}
                                                variant="subtle"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {user.gender}
                                            </Badge>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <Text fontSize="md" color="gray.600">
                                                {user.joinedDate}
                                            </Text>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <VStack align="center" spacing={0}>
                                                <Text fontSize="md" color="gray.600">
                                                    {user.lastCall}
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    통화시간: {user.callDuration}
                                                </Text>
                                            </VStack>
                                        </Td>
                                        <Td px={4} py={3} textAlign="center">
                                            <HStack spacing={1} justify="center">
                                                <Tooltip label="메모 작성" placement="top" hasArrow>
                                                    <IconButton
                                                        icon={<Icon as={FiMessageSquare} boxSize={4} />}
                                                        size="sm"
                                                        variant="ghost"
                                                        color="gray.600"
                                                        _hover={{ bg: 'blue.50', color: 'blue.600' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMemoClick(user);
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="정보 수정" placement="top" hasArrow>
                                                    <IconButton
                                                        icon={<Icon as={FiEdit2} boxSize={4} />}
                                                        size="sm"
                                                        variant="ghost"
                                                        color="gray.600"
                                                        _hover={{ bg: 'orange.50', color: 'orange.600' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/user/${user.id}/edit`);
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="상세 보기" placement="top" hasArrow>
                                                    <IconButton
                                                        icon={<Icon as={FiEye} boxSize={4} />}
                                                        size="sm"
                                                        variant="ghost"
                                                        color="gray.600"
                                                        _hover={{ bg: 'gray.100', color: 'gray.900' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/user/${user.id}`);
                                                        }}
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Flex justify="center" px={6} py={5} borderTop="1px" borderColor="gray.200">
                        <HStack spacing={1}>
                            <IconButton
                                icon={<ChevronLeftIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                isDisabled={currentPage === 1}
                                aria-label="이전 페이지"
                            />

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                if (pageNum > totalPages) return null;

                                return (
                                    <Button
                                        key={pageNum}
                                        size="sm"
                                        variant={pageNum === currentPage ? 'solid' : 'ghost'}
                                        colorScheme="blue"
                                        onClick={() => setCurrentPage(pageNum)}
                                        minW="32px"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}

                            <IconButton
                                icon={<ChevronRightIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                                aria-label="다음 페이지"
                            />
                        </HStack>
                    </Flex>
                </Box>
            </Container>

            {/* 메모 추가 모달 */}
            <Modal isOpen={isMemoModalOpen} onClose={handleMemoCancel} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>메모 추가 - {selectedUserForMemo?.name}님</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="sm" color="gray.600" mb={2}>
                                    사용자 정보
                                </Text>
                                <HStack spacing={3}>
                                    <Avatar size="sm" name={selectedUserForMemo?.name} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold">{selectedUserForMemo?.name}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {selectedUserForMemo?.age}세 • {selectedUserForMemo?.address}
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

            {/* 사용자 삭제 확인 모달 */}
            <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>사용자 삭제 확인</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="sm" color="gray.700" mb={2}>
                                    선택된 사용자 ({selectedRows.length}명):
                                </Text>
                                <VStack spacing={2} align="stretch" ml={4}>
                                    {paginatedUsers
                                        .filter((user) => selectedRows.includes(user.id))
                                        .map((user) => (
                                            <Text key={user.id} fontSize="sm">
                                                • {user.name} ({user.phone})
                                            </Text>
                                        ))}
                                </VStack>
                            </Box>

                            <Box bg="red.50" p={3} borderRadius="md" borderLeft="4px" borderColor="red.500">
                                <Text fontSize="sm" color="red.700">
                                    ⚠️ 삭제된 사용자는 복구할 수 없습니다. 정말로 삭제하시겠습니까?
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleCancelDelete} isDisabled={isDeleting}>
                            취소
                        </Button>
                        <Button colorScheme="red" onClick={handleConfirmDelete} isLoading={isDeleting}>
                            삭제
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
