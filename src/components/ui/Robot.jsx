import { Box, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * 로봇 캐릭터 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.mode - 로봇 모드 ('idle' | 'talking')
 */
export const Robot = ({ mode = 'idle' }) => {
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
        {/* 얼굴 */}
        <Box w="120px" h="120px" bg="#0F172A" borderRadius="full" position="relative">
          {/* 눈 */}
          <MotionBox
            position="absolute" 
            top="40%" 
            left="22%" 
            w="20px" 
            h="12px" 
            bg="#66E3FF" 
            borderRadius="12px"
            animate={{ 
              opacity: [1, 0.8, 1], 
              y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0] 
            }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <MotionBox
            position="absolute" 
            top="40%" 
            right="22%" 
            w="20px" 
            h="12px" 
            bg="#66E3FF" 
            borderRadius="12px"
            animate={{ 
              opacity: [1, 0.8, 1], 
              y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0] 
            }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
          />
          {/* 입(말할 때) */}
          {mode === 'talking' && (
            <MotionBox
              position="absolute" 
              bottom="28%" 
              left="50%" 
              transform="translateX(-50%)"
              w="36px" 
              h="8px" 
              bg="#66E3FF" 
              borderRadius="8px"
              animate={{ scaleY: [0.6, 1.2, 0.8, 1.1, 0.7] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}
        </Box>
      </MotionBox>
      <Text fontSize="lg" color="gray.700">
        {mode === 'talking' ? '말하고 있어요…' : '안녕하세요!'}
      </Text>
    </VStack>
  );
};
