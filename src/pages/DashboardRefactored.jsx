import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Heading, Button, Text, Badge, Input, InputGroup, InputLeftElement,
  Select, VStack, HStack, IconButton, useToast, Avatar, Container,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox, useColorModeValue, Tooltip, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { 
  SearchIcon, TimeIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, 
  ChevronRightIcon, AddIcon, EditIcon, ViewIcon
} from '@chakra-ui/icons';
import { Header } from '../components/common/Header';
import { Layout } from '../components/common/Layout';
import { MemoModal } from '../components/common/MemoModal';
import { useClock, useNavigation } from '../hooks';
import { MOCK_USERS } from '../constants/mockData';
import { getEmotionColor, getEmotionText } from '../utils/emotionUtils';
import { USER_STATUS, TABLE_CONFIG } from '../constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const { goToUserAdd, goToUserDetail } = useNavigation();
  const toast = useToast();
  const { timeString, dateString } = useClock();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // 상태 관리
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_CONFIG.DEFAULT_ROWS_PER_PAGE);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [selectedUserForMemo, setSelectedUserForMemo] = useState(null);
  const [memoText, setMemoText] = useState('');

  // 필터링된 사용자 목록
  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesEmotion = filterEmotion === 'all' || user.emotion === filterEmotion;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    return matchesEmotion && matchesSearch;
  });

  // 정렬된 사용자 목록
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'emotion') {
      const emotionOrder = { urgent: 0, caution: 1, normal: 2 };
      const order = emotionOrder[a.emotion] - emotionOrder[b.emotion];
      return sortDirection === 'asc' ? order : -order;
    }
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // 이벤트 핸들러
  const handleAction = (action, user) => {
    if (action === '사용자 추가') {
      goToUserAdd();
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
      setSelectedRows(prev => [...prev, userId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== userId));
    }
  };

  const handleMemoClick = (user) => {
    setSelectedUserForMemo(user);
    setMemoText('');
    setIsMemoModalOpen(true);
  };

  const handleMemoSave = () => {
    if (memoText.trim()) {
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
    }
  };

  const handleMemoCancel = () => {
    setIsMemoModalOpen(false);
    setMemoText('');
    setSelectedUserForMemo(null);
  };

  // 헤더 액션 버튼들
  const headerActions = [
    {
      label: '사용자 추가',
      icon: <AddIcon />,
      colorScheme: 'blue',
      onClick: () => handleAction('사용자 추가', { name: '새 사용자' })
    }
  ];

  return (
    <Layout bg={bgColor}>
      <Header
        title="독거노인 관리 시스템"
        subtitle="Elderly Care Management System v2.1"
        actions={headerActions}
        user={{ name: '김관리', role: '시스템 관리자' }}
      />

      {/* Action Bar */}
      <Flex align="center" justify="space-between" wrap="wrap" gap={4} bg="gray.50" p={4} borderRadius="lg" mb={6}>
        <HStack spacing={4} flex="1" minW="300px">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="이름, 주소, 전화번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            value={filterEmotion}
            onChange={(e) => setFilterEmotion(e.target.value)}
            maxW="150px"
          >
            <option value="all">전체</option>
            <option value="urgent">긴급</option>
            <option value="caution">주의</option>
            <option value="normal">정상</option>
          </Select>
        </HStack>
      </Flex>

      {/* Main Content - Table */}
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="sm">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th px={4} py={3}>
                  <Checkbox
                    isChecked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
                    isIndeterminate={selectedRows.length > 0 && selectedRows.length < paginatedUsers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th px={4} py={3} cursor="pointer" onClick={() => handleSort('name')}>
                  <HStack>
                    <Text>이름</Text>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                    )}
                  </HStack>
                </Th>
                <Th px={4} py={3}>연락처</Th>
                <Th px={4} py={3}>주소</Th>
                <Th px={4} py={3} cursor="pointer" onClick={() => handleSort('emotion')}>
                  <HStack>
                    <Text>감정상태</Text>
                    {sortField === 'emotion' && (
                      sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                    )}
                  </HStack>
                </Th>
                <Th px={4} py={3}>성별</Th>
                <Th px={4} py={3} cursor="pointer" onClick={() => handleSort('joinedDate')}>
                  <HStack>
                    <Text>가입일</Text>
                    {sortField === 'joinedDate' && (
                      sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                    )}
                  </HStack>
                </Th>
                <Th px={4} py={3} cursor="pointer" onClick={() => handleSort('lastCall')}>
                  <HStack>
                    <Text>마지막 통화</Text>
                    {sortField === 'lastCall' && (
                      sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                    )}
                  </HStack>
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
                      onChange={(e) => handleSelectRow(user.id, e.target.checked)}
                    />
                  </Td>
                  <Td px={4} py={3}>
                    <HStack>
                      <Avatar size="sm" name={user.name} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">{user.age}세</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td px={4} py={3}>{user.phone}</Td>
                  <Td px={4} py={3}>{user.address}</Td>
                  <Td px={4} py={3}>
                    <Badge
                      bg={getEmotionColor(user.emotion)}
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {getEmotionText(user.emotion)}
                    </Badge>
                  </Td>
                  <Td px={4} py={3}>{user.gender}</Td>
                  <Td px={4} py={3}>{user.joinedDate}</Td>
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
                            goToUserDetail(user.id);
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
        <Flex justify="space-between" align="center" mt={6}>
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">페이지당 행 수:</Text>
            <NumberInput
              value={rowsPerPage}
              onChange={(value) => {
                setRowsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
              min={5}
              max={100}
              size="sm"
              w="80px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
          
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} / {sortedUsers.length}
            </Text>
            <IconButton
              icon={<ChevronLeftIcon />}
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
            />
            <Text fontSize="sm" minW="60px" textAlign="center">
              {currentPage} / {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              isDisabled={currentPage === totalPages}
            />
          </HStack>
        </Flex>
      </Box>

      {/* 메모 추가 모달 */}
      <MemoModal
        isOpen={isMemoModalOpen}
        onClose={handleMemoCancel}
        user={selectedUserForMemo}
        memoText={memoText}
        setMemoText={setMemoText}
        onSave={handleMemoSave}
      />
    </Layout>
  );
}
