import { Box, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * 사람 캐릭터 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.mode - 사람 모드 ('idle' | 'talking')
 */
export const Human = ({ mode = 'idle' }) => {
  return (
    <VStack spacing={3}>
      <MotionBox
        w="180px" 
        h="180px" 
        borderRadius="full" 
        bg="white" 
        boxShadow="lg"
        display="grid" 
        placeItems="center"
        animate={mode === 'talking'
          ? { 
              scale: [1, 1.06, 1], 
              boxShadow: [
                '0 10px 20px rgba(0,0,0,0.08)',
                '0 16px 32px rgba(0,0,0,0.12)',
                '0 10px 20px rgba(0,0,0,0.08)'
              ] 
            }
          : { scale: [1, 1.02, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Box w="120px" h="120px" bg="#F4A261" borderRadius="full" position="relative">
          {/* 머리카락 */}
          <Box
            position="absolute" 
            top="-10px" 
            left="50%" 
            transform="translateX(-50%)"
            w="100px" 
            h="40px" 
            bg="#8B4513" 
            borderRadius="50px 50px 0 0"
          />
          
          {/* 눈 */}
          <MotionBox
            position="absolute" 
            top="35%" 
            left="25%" 
            w="16px" 
            h="16px" 
            bg="#2D3748" 
            borderRadius="full"
            animate={{ 
              scale: [1, 0.8, 1], 
              y: mode === 'talking' ? [0, -1, 0] : [0, 0, 0] 
            }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <MotionBox
            position="absolute" 
            top="35%" 
            right="25%" 
            w="16px" 
            h="16px" 
            bg="#2D3748" 
            borderRadius="full"
            animate={{ 
              scale: [1, 0.8, 1], 
              y: mode === 'talking' ? [0, -1, 0] : [0, 0, 0] 
            }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
          />
          
          {/* 눈썹 */}
          <Box position="absolute" top="30%" left="20%" w="20px" h="3px" bg="#8B4513" borderRadius="2px" />
          <Box position="absolute" top="30%" right="20%" w="20px" h="3px" bg="#8B4513" borderRadius="2px" />
          
          {/* 코 */}
          <Box position="absolute" top="50%" left="50%" transform="translateX(-50%)" w="6px" h="8px" bg="#E76F51" borderRadius="3px" />
          
          {/* 입 */}
          <MotionBox
            position="absolute" 
            bottom="25%" 
            left="50%" 
            transform="translateX(-50%)"
            w={mode === 'talking' ? "24px" : "16px"} 
            h={mode === 'talking' ? "12px" : "4px"}
            bg="#E76F51" 
            borderRadius="8px"
            animate={mode === 'talking' ? { scaleY: [0.6, 1.2, 0.8, 1.1, 0.7] } : {}}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          
          {/* 귀 */}
          <Box position="absolute" top="45%" left="5%" w="12px" h="20px" bg="#F4A261" borderRadius="6px" />
          <Box position="absolute" top="45%" right="5%" w="12px" h="20px" bg="#F4A261" borderRadius="6px" />
        </Box>
      </MotionBox>
      <Text fontSize="lg" color="gray.700">
        {mode === 'talking' ? '말하고 있어요…' : '안녕하세요!'}
      </Text>
    </VStack>
  );
};



