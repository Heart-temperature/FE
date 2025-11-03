import React from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Image } from '@chakra-ui/react';

export default function UserLoginPage() {
    return (
        <Flex direction="column" align="center" justify="center" minH="100vh" bg="#EAF4FF">
            
            <Image src="../../public/dajung-icon.png" alt="dajung-icon" />
            <Image src="../../public/dajung_blue-removebg.png" alt="dajung-blue" />

            <Text fontSize="20px" color="#003A96" mb={10}>
                편하게 접속하세요
            </Text>

            <Box bg="white" borderRadius="20px" p={10} w="500px" boxShadow="lg">
                <FormControl mb={6}>
                    <FormLabel fontSize="20px" color="#003A96" fontWeight="bold">
                        아이디
                    </FormLabel>
                    <Input
                        placeholder="아이디 입력"
                        borderRadius="15px"
                        height="55px"
                        fontSize="16px"
                        borderColor="#A8C7FF"
                        _focus={{ borderColor: '#0057FF' }}
                    />
                </FormControl>

                <FormControl mb={10}>
                    <FormLabel fontSize="20px" color="#003A96" fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <Input
                        type="password"
                        placeholder="4자리 입력"
                        borderRadius="15px"
                        height="55px"
                        fontSize="16px"
                        borderColor="#A8C7FF"
                        _focus={{ borderColor: '#0057FF' }}
                    />
                </FormControl>

                <Button
                    bg="#0057FF"
                    color="white"
                    w="100%"
                    height="65px"
                    fontSize="24px"
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={{ bg: '#0046cc' }}
                >
                    로그인
                </Button>
            </Box>

            <Box mt={8} bg="#D7E7FF" p={6} borderRadius="15px" textAlign="center" w="500px">
                <Text fontSize="18px" color="#003A96">
                    문제가 있으신가요?
                </Text>
                <Text fontSize="18px" fontWeight="bold" color="#003A96">
                    고객 지원팀: 1234-5678
                </Text>
            </Box>
        </Flex>
    );
}
