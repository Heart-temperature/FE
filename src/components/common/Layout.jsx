import { Box, Container, useColorModeValue } from '@chakra-ui/react';

/**
 * 공통 레이아웃 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트들
 * @param {string} props.bg - 배경색
 * @param {boolean} props.fullWidth - 전체 너비 사용 여부
 * @param {string} props.maxW - 최대 너비
 */
export const Layout = ({ 
  children, 
  bg, 
  fullWidth = false, 
  maxW = '6xl' 
}) => {
  const defaultBg = useColorModeValue('gray.50', 'gray.900');
  const backgroundColor = bg || defaultBg;

  return (
    <Box minH="100vh" bg={backgroundColor}>
      {fullWidth ? (
        <Box p={6}>
          {children}
        </Box>
      ) : (
        <Container maxW={maxW} py={8}>
          {children}
        </Container>
      )}
    </Box>
  );
};




