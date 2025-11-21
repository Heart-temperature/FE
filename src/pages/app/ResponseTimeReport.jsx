import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Divider } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import useAppSettings from '../../hooks/useAppSettings';

export default function ResponseTimeReport() {
    const navigate = useNavigate();
    const { isHighContrast, fs, inputH } = useAppSettings();
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = () => {
        try {
            const storageKey = 'responseTimeData';
            const data = localStorage.getItem(storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                setReportData(parsed);
            } else {
                setReportData({ conversations: [], totalConversations: 0 });
            }
        } catch (error) {
            console.error('❌ 보고서 데이터 로드 실패:', error);
            setReportData({ conversations: [], totalConversations: 0 });
        }
    };

    const clearReportData = () => {
        if (window.confirm('모든 응답 속도 데이터를 삭제하시겠습니까?')) {
            localStorage.removeItem('responseTimeData');
            setReportData({ conversations: [], totalConversations: 0 });
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (!reportData) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'}>
                <Text fontSize={fs} color={isHighContrast ? '#FFFFFF' : '#000000'}>
                    데이터를 불러오는 중...
                </Text>
            </Flex>
        );
    }

    const { conversations, totalConversations } = reportData;
    const averageResponseTime = conversations.length > 0
        ? (conversations.reduce((sum, conv) => sum + conv.responseTimeMs, 0) / conversations.length / 1000).toFixed(2)
        : '0.00';
    const minResponseTime = conversations.length > 0
        ? Math.min(...conversations.map(conv => conv.responseTimeMs)) / 1000
        : 0;
    const maxResponseTime = conversations.length > 0
        ? Math.max(...conversations.map(conv => conv.responseTimeMs)) / 1000
        : 0;

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3} py={8}>
            <Box p={{ base: 5, md: 8 }} w="full" maxW="900px">
                <VStack spacing={6} align="stretch">
                    {/* 헤더 */}
                    <HStack justify="space-between" align="center">
                        <Button
                            leftIcon={<ChevronLeftIcon />}
                            onClick={() => navigate(ROUTES.USER_APP_HOME)}
                            bg={isHighContrast ? '#FFFFFF' : '#E3F2FD'}
                            color={isHighContrast ? '#000000' : '#2196F3'}
                            fontSize={fs}
                            h={inputH}
                            fontWeight="700"
                            borderRadius="15px"
                            border="3px solid"
                            borderColor={isHighContrast ? '#FFFFFF' : '#90CAF9'}
                            _hover={{
                                bg: isHighContrast ? '#FFD700' : '#64B5F6',
                                transform: 'translateY(-2px)',
                            }}
                            _active={{
                                transform: 'translateY(0)',
                            }}
                            transition="all 0.2s"
                        >
                            뒤로
                        </Button>
                        <Text
                            fontSize={fs}
                            fontWeight="700"
                            color={isHighContrast ? '#FFFFFF' : '#000000'}
                        >
                            응답 속도 보고서
                        </Text>
                        <Box w="100px" /> {/* 공간 맞추기 */}
                    </HStack>

                    <Divider borderColor={isHighContrast ? '#FFFFFF' : '#2196F3'} />

                    {/* 통계 요약 */}
                    <Box
                        bg={isHighContrast ? '#1a1a1a' : '#F5F5F5'}
                        p={6}
                        borderRadius="15px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                    >
                        <VStack spacing={4} align="stretch">
                            <Text
                                fontSize={fs}
                                fontWeight="700"
                                color={isHighContrast ? '#FFFFFF' : '#000000'}
                                textAlign="center"
                                mb={2}
                            >
                                📊 통계 요약
                            </Text>
                            <HStack justify="space-around" wrap="wrap" spacing={4}>
                                <VStack spacing={2}>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="600"
                                        color={isHighContrast ? '#FFD700' : '#2196F3'}
                                    >
                                        총 대화 횟수
                                    </Text>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="700"
                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                    >
                                        {totalConversations}회
                                    </Text>
                                </VStack>
                                <VStack spacing={2}>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="600"
                                        color={isHighContrast ? '#FFD700' : '#2196F3'}
                                    >
                                        평균 응답 속도
                                    </Text>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="700"
                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                    >
                                        {averageResponseTime}초
                                    </Text>
                                </VStack>
                                <VStack spacing={2}>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="600"
                                        color={isHighContrast ? '#FFD700' : '#2196F3'}
                                    >
                                        최소 응답 속도
                                    </Text>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="700"
                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                    >
                                        {minResponseTime.toFixed(2)}초
                                    </Text>
                                </VStack>
                                <VStack spacing={2}>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="600"
                                        color={isHighContrast ? '#FFD700' : '#2196F3'}
                                    >
                                        최대 응답 속도
                                    </Text>
                                    <Text
                                        fontSize={fs}
                                        fontWeight="700"
                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                    >
                                        {maxResponseTime.toFixed(2)}초
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* 상세 기록 테이블 */}
                    <Box
                        bg={isHighContrast ? '#1a1a1a' : '#F5F5F5'}
                        p={6}
                        borderRadius="15px"
                        border="3px solid"
                        borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                    >
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="center">
                                <Text
                                    fontSize={fs}
                                    fontWeight="700"
                                    color={isHighContrast ? '#FFFFFF' : '#000000'}
                                >
                                    📝 상세 기록
                                </Text>
                                {conversations.length > 0 && (
                                    <Button
                                        onClick={clearReportData}
                                        bg={isHighContrast ? '#FF4444' : '#F44336'}
                                        color="white"
                                        fontSize={fs}
                                        h={inputH}
                                        fontWeight="700"
                                        borderRadius="15px"
                                        border="3px solid"
                                        borderColor={isHighContrast ? '#FFFFFF' : '#D32F2F'}
                                        _hover={{
                                            bg: isHighContrast ? '#FF6666' : '#E53935',
                                            transform: 'translateY(-2px)',
                                        }}
                                        _active={{
                                            transform: 'translateY(0)',
                                        }}
                                        transition="all 0.2s"
                                    >
                                        데이터 삭제
                                    </Button>
                                )}
                            </HStack>

                            {conversations.length === 0 ? (
                                <Text
                                    fontSize={fs}
                                    color={isHighContrast ? '#FFFFFF' : '#666666'}
                                    textAlign="center"
                                    py={8}
                                >
                                    아직 대화 기록이 없습니다.
                                </Text>
                            ) : (
                                <TableContainer>
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th
                                                    fontSize={fs}
                                                    color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                    borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                >
                                                    번호
                                                </Th>
                                                <Th
                                                    fontSize={fs}
                                                    color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                    borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                >
                                                    날짜/시간
                                                </Th>
                                                <Th
                                                    fontSize={fs}
                                                    color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                    borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                >
                                                    응답 속도
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {conversations.slice().reverse().map((conv, index) => (
                                                <Tr key={conv.timestamp}>
                                                    <Td
                                                        fontSize={fs}
                                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                        borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                    >
                                                        {conversations.length - index}
                                                    </Td>
                                                    <Td
                                                        fontSize={fs}
                                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                        borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                    >
                                                        {formatDate(conv.timestamp)}
                                                    </Td>
                                                    <Td
                                                        fontSize={fs}
                                                        color={isHighContrast ? '#FFFFFF' : '#000000'}
                                                        borderColor={isHighContrast ? '#FFFFFF' : '#E0E0E0'}
                                                        fontWeight="600"
                                                    >
                                                        {conv.responseTimeSec}초 ({conv.responseTimeMs}ms)
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )}
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        </Flex>
    );
}

