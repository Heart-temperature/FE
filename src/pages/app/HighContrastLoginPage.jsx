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
    HStack,
    Switch,
} from '@chakra-ui/react';
import Icon from '../../assets/dajung-icon.png';
import Title from '../../assets/dajung-white.png';
import { ViewIcon, ViewOffIcon, MinusIcon, AddIcon } from '@chakra-ui/icons';

export default function HighContrastLoginPage() {
    const [show, setShow] = React.useState(false);
    const handleShowToggle = () => setShow(!show);

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="100vh"
            bg="black"
            px={{ base: 4, md: 0 }}
            color="white"
        >
            {/* 로고 */}
            <Flex direction="column" align="center" w="100%" mb={{ base: 4, md: 6 }}>
                <Image src={Icon} w={{ base: '100px', md: '150px' }} />
                <Image src={Title} w={{ base: '140px', md: '180px' }} mt={2} />
            </Flex>

            <Text fontSize={{ base: '24px', md: '28px' }} fontWeight="bold" mb={{ base: 5, md: 7 }}>
                편안한 일상친구
            </Text>

            {/* 로그인 박스 */}
            <Box
                bg="black"
                borderColor="white"
                borderWidth="3px"
                borderRadius="20px"
                p={{ base: 6, md: 10 }}
                w={{ base: '90%', md: '500px' }}
            >
                <FormControl mb={6}>
                    <FormLabel fontSize={{ base: '24px', md: '27px' }} fontWeight="bold">
                        아이디
                    </FormLabel>
                    <Input
                        placeholder="아이디 입력"
                        borderRadius="15px"
                        height={{ base: '48px', md: '55px' }}
                        fontSize={{ base: '20px', md: '22px' }}
                        bg="white"
                        color="black"
                        borderColor="white"
                        _focus={{
                            borderColor: 'yellow',
                            borderWidth: '3px',
                            boxShadow: 'none',
                        }}
                    />
                </FormControl>

                <FormControl mb={8}>
                    <FormLabel fontSize={{ base: '24px', md: '27px' }} fontWeight="bold">
                        비밀번호
                    </FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder="비밀번호 입력"
                            borderRadius="15px"
                            height={{ base: '48px', md: '55px' }}
                            fontSize={{ base: '20px', md: '22px' }}
                            bg="white"
                            color="black"
                            borderColor="white"
                            _focus={{
                                borderColor: 'yellow',
                                borderWidth: '3px',
                                boxShadow: 'none',
                            }}
                        />
                        <InputRightElement top="50%" transform="translateY(-55%)" pr={2}>
                            <IconButton
                                variant="unstyled"
                                onClick={handleShowToggle}
                                icon={show ? <ViewOffIcon color="white" /> : <ViewIcon color="white" />}
                                _hover={{ color: 'yellow' }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    bg="yellow"
                    color="black"
                    w="100%"
                    height={{ base: '50px', md: '65px' }}
                    fontSize={{ base: '22px', md: '24px' }}
                    fontWeight="bold"
                    borderRadius="20px"
                    _hover={{ bg: 'white' }}
                >
                    로그인
                </Button>
            </Box>

            {/* 설정 박스 */}
            <Flex
                direction="row"
                wrap="nowrap"
                align="center"
                justify="center"
                gap={6}
                p={4}
                bg="transparent"
                borderRadius="15px"
                w="100%"
                maxW="900px"
                mx="auto"
            >
                <IconButton
                    aria-label="Decrease font size"
                    icon={<MinusIcon />}
                    bg="white"
                    color="black"
                    _hover={{ bg: 'yellow' }}
                    size="lg"
                    rounded="full"
                />

                <Text fontSize="lg" fontWeight="bold" color="white">
                    글자 크기
                </Text>

                <IconButton
                    aria-label="Increase font size"
                    icon={<AddIcon />}
                    bg="white"
                    color="black"
                    _hover={{ bg: 'yellow', color: 'black' }}
                    size="lg"
                    rounded="full"
                />

                <Button
                    bg="#3A5A40"
                    color="white"
                    _hover={{ bg: '#4C7152' }}
                    _active={{ bg: '#2E4634' }}
                    fontWeight="bold"
                    px={6}
                    py={6}
                    fontSize="lg"
                    borderRadius="lg"
                    whiteSpace="nowrap"
                >
                    고대비 끄기
                </Button>
            </Flex>
        </Flex>
    );
}
