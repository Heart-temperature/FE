import React from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Image } from '@chakra-ui/react';
import Icon from '../../assets/dajung-icon.png';
import Title from '../../assets/dajung-title.png'; 

export default function UserLoginPage() {
    return (
        <Flex direction="column" align="center" justify="center" minH="100vh" bg="#FBF8F3">
            <Flex direction="column" align="center" w="100%">
                <Image src={Icon} w="150px" />
                <Image src={Title} w="180px" />
            </Flex>

            <Text fontSize="20px" color="#2c1026" mb={7}>
                편안한 일상친구
            </Text>

            <Box bg="white" borderColor="#E5DED5" borderWidth="1px" borderRadius="20px" p={10} w="500px" boxShadow="lg">
                <FormControl mb={6}>
                    <FormLabel fontSize="20px" color="#2c1026" fontWeight="bold">
                        아이디
                    </FormLabel>
                    <Input
                        placeholder="아이디 입력"
                        borderRadius="15px"
                        height="55px"
                        fontSize="16px"
                        borderColor="#BEB8AD"
                        _focus={{
                            borderColor: '#2c1026',
                            borderWidth: '2px',
                            boxShadow: 'none',
                        }}
                        _hover={{ borderColor: '#2c1026' }}
                    />
                </FormControl>

                <FormControl mb={10}>
                    <FormLabel fontSize="20px" color="#2c1026" fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <Input
                        type="password"
                        placeholder="4자리 입력"
                        borderRadius="15px"
                        height="55px"
                        fontSize="16px"
                        borderColor="#BEB8AD"
                        _focus={{
                            borderColor: '#2c1026',
                            borderWidth: '2px',
                            boxShadow: 'none',
                        }}
                        _hover={{ borderColor: '#2c1026' }}
                    />
                </FormControl>

                <Button
                    bg="#2c1026"
                    color="white"
                    w="100%"
                    height="65px"
                    fontSize="24px"
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={{ bg: '#3A5A40' }}
                >
                    로그인
                </Button>
            </Box>

            <Box mt={8} bg="#C7D2C0" p={6} borderRadius="15px" textAlign="center" w="500px">
                <Text fontSize="18px" color="#2c1026">
                    문제가 있으신가요?
                </Text>
                <Text fontSize="18px" fontWeight="bold" color="#2c1026">
                    고객 지원팀: 1234-5678
                </Text>
            </Box>
        </Flex>
    );
}
