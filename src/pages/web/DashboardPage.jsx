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
    Image
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dajungIcon from '../../assets/dajung-icon.png';
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
    DeleteIcon
} from '@chakra-ui/icons';

const MOCK = [
    { id: 'u7', name: '박철수', age: 73, emotion: 'urgent', desc: 'AI 감정분석: 긴급 - 좌절감과 신체적 어려움', lastCall: '1분 전', phone: '010-7890-1234', address: '서울시 강동구', joinedDate: '2022-11-30', lastActive: '1분 전', gender: '남성', callDuration: '4분', callSummary: '신체적 불편함이 심각, 움직임의 어려움' },
    { id: 'u4', name: '정민수', age: 74, emotion: 'urgent', desc: 'AI 감정분석: 긴급 - 불안감과 안전 우려', lastCall: '2분 전', phone: '010-4567-8901', address: '서울시 마포구', joinedDate: '2023-02-19', lastActive: '3개월 전', gender: '남성', callDuration: '3분', callSummary: '불안감이 심각, 혼자 있는 시간이 무서워함' },
    { id: 'u10', name: '최순자', age: 77, emotion: 'caution', desc: 'AI 감정분석: 주의 - 스트레스와 압박감', lastCall: '3분 전', phone: '010-0123-4567', address: '서울시 도봉구', joinedDate: '2022-12-05', lastActive: '3분 전', gender: '여성', callDuration: '2분', callSummary: '스트레스 표현, 일상의 부담감' },
    { id: 'u1', name: '김영희', age: 82, emotion: 'urgent', desc: 'AI 감정분석: 긴급 - 외로움과 불안감 심각', lastCall: '5분 전', phone: '010-1234-5678', address: '서울시 강남구', joinedDate: '2023-03-12', lastActive: '1분 전', gender: '여성', callDuration: '12분', callSummary: '외로움과 불안감이 심각한 수준으로 상담 필요' },
    { id: 'u5', name: '최영숙', age: 71, emotion: 'caution', desc: 'AI 감정분석: 주의 - 기억력 저하와 혼란', lastCall: '30분 전', phone: '010-5678-9012', address: '서울시 영등포구', joinedDate: '2022-07-15', lastActive: '1주 전', gender: '여성', callDuration: '7분', callSummary: '복용약 잊음, 기억력 저하 우려' },
    { id: 'u6', name: '강순자', age: 78, emotion: 'normal', desc: 'AI 감정분석: 정상 - 평온하고 안정적', lastCall: '2시간 전', phone: '010-6789-0123', address: '서울시 노원구', joinedDate: '2023-05-20', lastActive: '2시간 전', gender: '여성', callDuration: '6분', callSummary: '평온한 대화, 일상에 만족' },
    { id: 'u3', name: '박순자', age: 69, emotion: 'normal', desc: 'AI 감정분석: 정상 - 긍정적이고 활기찬 대화', lastCall: '3시간 전', phone: '010-3456-7890', address: '서울시 송파구', joinedDate: '2021-10-05', lastActive: '10일 전', gender: '여성', callDuration: '5분', callSummary: '활기찬 대화, 건강 상태 양호' },
    { id: 'u8', name: '이영숙', age: 80, emotion: 'caution', desc: 'AI 감정분석: 주의 - 외로움과 사회적 고립', lastCall: '6시간 전', phone: '010-8901-2345', address: '서울시 성동구', joinedDate: '2023-08-10', lastActive: '6시간 전', gender: '여성', callDuration: '9분', callSummary: '외로움 표현, 사람들과의 만남을 원함' },
    { id: 'u2', name: '이철수', age: 76, emotion: 'caution', desc: 'AI 감정분석: 주의 - 우울감과 관심 저하', lastCall: '1일 전', phone: '010-2345-6789', address: '서울시 서초구', joinedDate: '2024-01-08', lastActive: '4일 전', gender: '남성', callDuration: '8분', callSummary: '우울감 표현, 일상에 대한 관심 저하' },
    { id: 'u9', name: '김민수', age: 75, emotion: 'normal', desc: 'AI 감정분석: 정상 - 만족스럽고 긍정적', lastCall: '1일 전', phone: '010-9012-3456', address: '서울시 중랑구', joinedDate: '2023-01-25', lastActive: '1일 전', gender: '남성', callDuration: '4분', callSummary: '만족스러운 대화, 현재 상황에 만족' },
    { id: 'u11', name: '손미영', age: 85, emotion: 'caution', desc: 'AI 감정분석: 주의 - 건강 악화 우려', lastCall: '10분 전', phone: '010-1111-2222', address: '서울시 성북구', joinedDate: '2022-09-14', lastActive: '10분 전', gender: '여성', callDuration: '6분', callSummary: '최근 건강 상태 악화, 정기적 관찰 필요' },
    { id: 'u12', name: '오재훈', age: 72, emotion: 'normal', desc: 'AI 감정분석: 정상 - 긍정적 태도 유지', lastCall: '25분 전', phone: '010-3333-4444', address: '서울시 구로구', joinedDate: '2023-06-20', lastActive: '25분 전', gender: '남성', callDuration: '5분', callSummary: '항상 밝은 태도, 대화하기 즐거움' },
    { id: 'u13', name: '유명희', age: 68, emotion: 'urgent', desc: 'AI 감정분석: 긴급 - 극심한 외로움', lastCall: '45분 전', phone: '010-5555-6666', address: '서울시 동작구', joinedDate: '2023-04-10', lastActive: '45분 전', gender: '여성', callDuration: '15분', callSummary: '극심한 외로움 표현, 적극적 상담 필요' },
    { id: 'u14', name: '한봉식', age: 79, emotion: 'caution', desc: 'AI 감정분석: 주의 - 수면 부족', lastCall: '1시간 전', phone: '010-7777-8888', address: '서울시 금천구', joinedDate: '2022-08-05', lastActive: '1시간 전', gender: '남성', callDuration: '7분', callSummary: '수면 부족으로 인한 피로 호소' },
    { id: 'u15', name: '이춘희', age: 81, emotion: 'normal', desc: 'AI 감정분석: 정상 - 건강한 대화', lastCall: '1시간 30분 전', phone: '010-9999-0000', address: '서울시 관악구', joinedDate: '2021-12-15', lastActive: '1시간 30분 전', gender: '여성', callDuration: '8분', callSummary: '일상에 만족하며 건강한 삶 유지' },
    { id: 'u16', name: '박영배', age: 77, emotion: 'urgent', desc: 'AI 감정분석: 긴급 - 가족관계 갈등', lastCall: '2시간 전', phone: '010-2211-3344', address: '서울시 양천구', joinedDate: '2023-03-22', lastActive: '2시간 전', gender: '남성', callDuration: '10분', callSummary: '가족과의 관계에서 스트레스 호소' },
    { id: 'u17', name: '정옥희', age: 74, emotion: 'caution', desc: 'AI 감정분석: 주의 - 약물 부작용 의심', lastCall: '3시간 전', phone: '010-4455-5566', address: '서울시 강서구', joinedDate: '2022-10-08', lastActive: '3시간 전', gender: '여성', callDuration: '9분', callSummary: '복용 약물에 대한 부작용 호소' },
    { id: 'u18', name: '신두연', age: 70, emotion: 'normal', desc: 'AI 감정분석: 정상 - 활발한 사회활동', lastCall: '4시간 전', phone: '010-6677-7788', address: '서울시 종로구', joinedDate: '2023-02-14', lastActive: '4시간 전', gender: '남성', callDuration: '6분', callSummary: '사회활동 활발, 긍정적 태도' },
    { id: 'u19', name: '김은순', age: 83, emotion: 'caution', desc: 'AI 감정분석: 주의 - 인지 기능 저하', lastCall: '5시간 전', phone: '010-8899-9900', address: '서울시 중구', joinedDate: '2021-11-20', lastActive: '5시간 전', gender: '여성', callDuration: '8분', callSummary: '최근 기억력 감소 호소, 정기 검진 필요' },
    { id: 'u20', name: '조용주', age: 76, emotion: 'normal', desc: 'AI 감정분석: 정상 - 안정적인 상태', lastCall: '6시간 전', phone: '010-1122-2233', address: '서울시 용산구', joinedDate: '2022-07-30', lastActive: '6시간 전', gender: '남성', callDuration: '5분', callSummary: '전반적으로 안정적이고 만족스러운 상태' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const toast = useToast();
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
    const filteredUsers = MOCK.filter(user => {
        const matchesEmotion = filterEmotion === 'all' || user.emotion === filterEmotion;
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.phone.includes(searchTerm);
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

    const handleMemoSave = () => {
        if (memoText.trim()) {
            // 여기서 실제로는 서버에 메모를 저장해야 합니다
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

    const handleDeleteSelected = () => {
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

        // 선택된 사용자 이름 가져오기
        const selectedUsers = paginatedUsers.filter(user => selectedRows.includes(user.id));
        const userNames = selectedUsers.map(u => u.name).join(', ');

        toast({
            title: '사용자 삭제 완료!',
            description: `${userNames}님이 삭제되었습니다.`,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });

        // 선택 초기화
        setSelectedRows([]);
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
            setSelectedRows(paginatedUsers.map(user => user.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (userId, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, userId]);
        } else {
            setSelectedRows(selectedRows.filter(id => id !== userId));
        }
    };

    const getEmotionColor = (emotion) => {
        switch (emotion) {
            case 'urgent': return '#D93025';       // 빨강 - 긴급
            case 'caution': return '#F9AB00';      // 노랑 - 주의
            case 'normal': return '#1B9A59';       // 초록 - 정상
            default: return '#718096';             // 회색 - 알 수 없음
        }
    };

    const getEmotionText = (emotion) => {
        switch (emotion) {
            case 'urgent': return '긴급';
            case 'caution': return '주의';
            case 'normal': return '정상';
            default: return '알 수 없음';
        }
    };

    const bgColor = useColorModeValue('#F5F7FB', 'gray.800');
    const cardBg = useColorModeValue('white', 'gray.700');

    return (
        <Box bg={bgColor} minH="100vh">
            {/* Header */}
            <Box bg="white" shadow="md" px={8} py={4} borderBottom="2px" borderColor="gray.100">
                <VStack spacing={3} align="stretch">
                    <Flex align="center" justify="space-between">
                        <HStack spacing={4}>
                                <Image src={dajungIcon} alt="Dajung Icon" boxSize="24px" />
                            <VStack align="start" spacing={0}>
                                <Heading size="lg" color="gray.800" fontWeight="600">
                                    다정이 관리 시스템
                                </Heading>
                            </VStack>
                        </HStack>
                        
                        <HStack spacing={6}>
                            
                            <HStack spacing={3}>
                                <Button 
                                    leftIcon={<AddIcon />} 
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleAction('사용자 추가', { name: '새 사용자' })}
                                >
                                    사용자 추가
                                </Button>
                                <Button 
                                    leftIcon={<DeleteIcon />} 
                                    colorScheme="red"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                    isDisabled={selectedRows.length === 0}
                                >
                                    {selectedRows.length > 0 ? `사용자 삭제 (${selectedRows.length})` : '사용자 삭제'}
                                </Button>
                                <HStack spacing={2} bg="blue.50" px={3} py={2} borderRadius="md">
                                    <Text fontSize="sm" fontWeight="500" color="gray.800">
                                        김관리
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        시스템 관리자
                                    </Text>
                                </HStack>
                            </HStack>
                        </HStack>
                    </Flex>

                    {/* Action Bar */}
                    <Flex align="center" justify="space-between" wrap="wrap" gap={4} bg="gray.50" p={4} borderRadius="lg">
                        <HStack spacing={3} flex="1" minW="300px">
                            <InputGroup maxW="320px">
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="이름, 주소, 전화번호 검색"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    bg="white"
                                    border="1px"
                                    borderColor="gray.200"
                                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
                                />
                            </InputGroup>

                            <Select 
                                value={filterEmotion} 
                                onChange={(e) => setFilterEmotion(e.target.value)} 
                                maxW="140px"
                                bg="white"
                                borderColor="gray.200"
                            >
                                <option value="all">전체 상태</option>
                                <option value="urgent">긴급</option>
                                <option value="caution">주의</option>
                                <option value="normal">정상</option>
                            </Select>

                        </HStack>

                    </Flex>
                </VStack>
            </Box>

            {/* Main Content - Table */}
            <Container maxW="full" px={6} py={6}>
                <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                    <TableContainer>
                        <Table variant="simple" size="md">
                            <Thead bg="gray.50">
                                <Tr>
                                    <Th px={4} py={3}>
                                        <Checkbox
                                            isChecked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
                                            isIndeterminate={selectedRows.length > 0 && selectedRows.length < paginatedUsers.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </Th>
                                    <Th px={4} py={3}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort('name')}
                                            rightIcon={sortField === 'name' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null}
                                        >
                                            이름
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3}>연락처</Th>
                                    <Th px={4} py={3}>주소</Th>
                                    <Th px={4} py={3}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort('emotion')}
                                            rightIcon={sortField === 'emotion' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null}
                                        >
                                            감정상태
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort('gender')}
                                            rightIcon={sortField === 'gender' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null}
                                        >
                                            성별
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort('joinedDate')}
                                            rightIcon={sortField === 'joinedDate' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null}
                                        >
                                            가입일
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort('lastCall')}
                                            rightIcon={sortField === 'lastCall' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : null}
                                        >
                                            마지막 통화
                                        </Button>
                                    </Th>
                                    <Th px={4} py={3}>액션</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paginatedUsers.map((user) => (
                                    <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                                        <Td px={4} py={3}>
                                            <Checkbox
                                                isChecked={selectedRows.includes(user.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectRow(user.id, e.target.checked);
                                                }}
                                            />
                                        </Td>
                                        <Td px={4} py={3}>
                                            <HStack spacing={3}>
                                                <Avatar size="sm" name={user.name} />
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium">{user.name}</Text>
                                                    <Text fontSize="sm" color="gray.500">{user.age}세</Text>
                                                </VStack>
                                            </HStack>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <Text fontSize="sm">{user.phone}</Text>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <Text fontSize="sm" color="gray.600">{user.address}</Text>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <Badge
                                                bg={getEmotionColor(user.emotion)}
                                                color="white"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="xs"
                                            >
                                                {getEmotionText(user.emotion)}
                                            </Badge>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <Badge
                                                colorScheme={user.gender === '남성' ? 'blue' : 'pink'}
                                                variant="subtle"
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                            >
                                                {user.gender}
                                            </Badge>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <Text fontSize="sm" color="gray.600">{user.joinedDate}</Text>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="sm" color="gray.600">{user.lastCall}</Text>
                                                <Text fontSize="xs" color="gray.500">통화시간: {user.callDuration}</Text>
                                            </VStack>
                                        </Td>
                                        <Td px={4} py={3}>
                                            <HStack spacing={2}>
                                                <Tooltip label="메모 추가" placement="top">
                                                    <IconButton
                                                        icon={<EditIcon />}
                                                        size="sm"
                                                        bg="blue.50"
                                                        color="blue.600"
                                                        border="1px"
                                                        borderColor="blue.200"
                                                        _hover={{ 
                                                            bg: "blue.100", 
                                                            borderColor: "blue.300",
                                                            transform: "scale(1.05)"
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMemoClick(user);
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="상세보기" placement="top">
                                                    <IconButton
                                                        icon={<ViewIcon />}
                                                        size="sm"
                                                        bg="green.50"
                                                        color="green.600"
                                                        border="1px"
                                                        borderColor="green.200"
                                                        _hover={{ 
                                                            bg: "green.100", 
                                                            borderColor: "green.300",
                                                            transform: "scale(1.05)"
                                                        }}
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
                    <Flex align="center" justify="space-between" px={6} py={4} borderTop="1px" borderColor="gray.200">
                        <HStack spacing={4}>
                            <HStack spacing={2}>
                                <Text fontSize="sm" color="gray.600">페이지당 행 수:</Text>
                                <NumberInput
                                    size="sm"
                                    maxW="70px"
                                    value={rowsPerPage}
                                    onChange={(value) => {
                                        setRowsPerPage(parseInt(value));
                                        setCurrentPage(1);
                                    }}
                                    min={5}
                                    max={50}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                                총 {sortedUsers.length}개 행 중 {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)}개 표시
                            </Text>
                        </HStack>

                        <HStack spacing={2}>
                            <IconButton
                                icon={<ChevronLeftIcon />}
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentPage(1)}
                                isDisabled={currentPage === 1}
                                aria-label="첫 페이지"
                            />
                            <IconButton
                                icon={<ChevronLeftIcon />}
                                size="sm"
                                variant="outline"
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
                                        variant={pageNum === currentPage ? "solid" : "outline"}
                                        colorScheme={pageNum === currentPage ? "blue" : "gray"}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            
                            <IconButton
                                icon={<ChevronRightIcon />}
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                                aria-label="다음 페이지"
                            />
                            <IconButton
                                icon={<ChevronRightIcon />}
                                size="sm"
                                variant="outline"
                                onClick={() => setCurrentPage(totalPages)}
                                isDisabled={currentPage === totalPages}
                                aria-label="마지막 페이지"
                            />
                        </HStack>
                    </Flex>
                </Box>
            </Container>

            {/* 메모 추가 모달 */}
            <Modal isOpen={isMemoModalOpen} onClose={handleMemoCancel} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        메모 추가 - {selectedUserForMemo?.name}님
                    </ModalHeader>
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

        </Box>
    );
}
