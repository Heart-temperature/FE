import { HStack, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * 음성 파형 컴포넌트
 */
export const VoiceWave = () => (
  <HStack spacing={1} h="20px" align="end" aria-label="음성 파형">
    {[...Array(8)].map((_, i) => (
      <MotionBox 
        key={i} 
        w="6px" 
        bg="brand.500" 
        borderRadius="sm"
        animate={{ height: ['4px','18px','8px','16px','6px'] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07 }}
      />
    ))}
  </HStack>
);
