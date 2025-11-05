import { Box, Flex, Text } from '@chakra-ui/react';

export default function MainPage() {
    return (
        <Flex direction="column" align="center" justify="center" minH="100vh" bg="#FBF8F3">
            <Box  px={4} py={3}>
                <Text>This Page is MainPage</Text>
            </Box>
        </Flex>
    );
}