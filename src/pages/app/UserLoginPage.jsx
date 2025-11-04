import React from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Image,
    IconButton,
} from '@chakra-ui/react';
import Icon from '../../assets/dajung-icon.png';
import Title from '../../assets/dajung-title.png';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function UserLoginPage() {
    const [show, setShow] = React.useState(false);
    const handleShowToggle = () => setShow(!show);

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="100vh"
            bg="#FBF8F3"
            px={{ base: 4, md: 0 }} // 모바일 양옆 여백 확보
        >
            {/* 로고 영역 */}
            <Flex direction="column" align="center" w="100%" mb={{ base: 4, md: 6 }}>
                <Image src={Icon} w={{ base: '100px', md: '150px' }} />
                <Image src={Title} w={{ base: '140px', md: '180px' }} mt={2} />
            </Flex>

            <Text fontSize={{ base: '24px', md: '28px' }} color="#2c1026" mb={{ base: 5, md: 7 }}>
                편안한 일상친구
            </Text>

            {/* 로그인 박스 */}
            <Box
                bg="white"
                borderColor="#E5DED5"
                borderWidth="1px"
                borderRadius="20px"
                p={{ base: 6, md: 10 }}
                w={{ base: '90%', md: '500px' }}
                boxShadow="lg"
            >
                <FormControl mb={6}>
                    <FormLabel fontSize={{ base: '24px', md: '27px' }} color="#2c1026" fontWeight="bold">
                        아이디 {/*모바일: 18pt, 태블릿 20pt */}
                    </FormLabel>
                    <Input
                        placeholder="아이디 입력"
                        borderRadius="15px"
                        height={{ base: '48px', md: '55px' }}
                        fontSize={{ base: '20px', md: '22px' }}
                        // 모바일: 15pt, 태블릿 16.5pt
                        borderColor="#BEB8AD"
                        _focus={{
                            borderColor: '#2c1026',
                            borderWidth: '2px',
                            boxShadow: 'none',
                        }}
                        _hover={{ borderColor: '#2c1026' }}
                    />
                </FormControl>

                <FormControl mb={8}>
                    <FormLabel fontSize={{ base: '24px', md: '27px' }} color="#2c1026" fontWeight="bold">
                        비밀번호 {/*모바일: 18pt, 태블릿 20pt */}
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: '48px', md: '55px' }}
                            fontSize={{ base: '20px', md: '22px' }}
                            // 모바일: 15pt, 태블릿 16.5pt
                            borderColor="#BEB8AD"
                            _focus={{
                                borderColor: '#2c1026',
                                borderWidth: '2px',
                                boxShadow: 'none',
                            }}
                            _hover={{ borderColor: '#2c1026' }}
                        />
                        <InputRightElement
                            top="50%"
                            transform="translateY(-55%)"
                            pr={2}
                        >
                            <IconButton
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={show ? <ViewOffIcon /> : <ViewIcon />}
                                
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    bg="#2c1026"
                    color="white"
                    w="100%"
                    height={{ base: '50px', md: '65px' }}
                    fontSize={{ base: '22px', md: '24px' }}
                    // 모바일: 16.5pt, 태블릿 18pt
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={{ bg: '#3A5A40' }}
                >
                    로그인
                </Button>
            </Box>

            {/* 고객센터 안내 */}
            <Box
                mt={{ base: 5, md: 8 }}
                bg="#C7D2C0"
                p={{ base: 4, md: 6 }}
                borderRadius="15px"
                textAlign="center"
                w={{ base: '90%', md: '500px' }}
            >
                <Text fontSize={{ base: '20px', md: '22px' }} color="#2c1026">
                    문제가 있으신가요?
                </Text>
                <Text fontSize={{ base: '22px', md: '24px' }} fontWeight="bold" color="#2c1026">
                    고객 지원팀: 1234-5678
                </Text>
            </Box>
        </Flex>
    );
}
