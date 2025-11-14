import { Box, VStack, HStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useCharacterSlider } from '../../hooks/useCharacterSlider';
import { useTouchSwipe } from '../../hooks/useTouchSwipe';
import { ANIMATION_CONFIG } from '../../constants';

const MotionBox = motion(Box);

/**
 * 캐릭터 슬라이더 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.character - 현재 선택된 캐릭터
 * @param {Function} props.setCharacter - 캐릭터 설정 함수
 */
export const CharacterSlider = ({ character, setCharacter }) => {
  const { currentIndex, characters, nextCharacter, prevCharacter } = useCharacterSlider(character);
  
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchSwipe(
    nextCharacter,
    prevCharacter
  );

  return (
    <VStack spacing={6} w="full">
      <Text fontSize="lg" color="gray.700" fontWeight="bold">
        AI 상담사를 선택해주세요
      </Text>
      
      {/* 캐릭터 슬라이드 영역 */}
      <Box position="relative" w="full" maxW="400px">
        <HStack justify="space-between" align="center" w="full">
          {/* 이전 버튼 */}
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="이전 상담사"
            onClick={prevCharacter}
            size="md"
            variant="ghost"
            colorScheme="gray"
            _hover={{ bg: 'gray.100' }}
          />
          
          {/* 캐릭터 슬라이드 컨테이너 */}
          <Box 
            flex="1" 
            mx={3}
            overflow="hidden"
            position="relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
          >
            <Box position="relative" w="full" h="160px" overflow="hidden">
              {/* 모든 캐릭터를 가로로 배치 */}
              <MotionBox
                w="200%"
                h="full"
                display="flex"
                animate={{ x: `-${currentIndex * 50}%` }}
                transition={ANIMATION_CONFIG.SPRING}
              >
                {characters.map((char, index) => (
                  <Box key={char.id} w="50%" h="full" display="flex" alignItems="center" justifyContent="center">
                    <MotionBox
                      initial={{ opacity: 0.6, scale: 0.85 }}
                      animate={{ 
                        opacity: index === currentIndex ? 1 : 0.6,
                        scale: index === currentIndex ? 1 : 0.85
                      }}
                      transition={ANIMATION_CONFIG.EASE_IN_OUT}
                    >
                      <VStack spacing={2}>
                        <Box
                          w="120px"
                          h="120px"
                          borderRadius="full"
                          bg="white"
                          boxShadow="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="4xl"
                          border="2px solid"
                          borderColor={char.color + '.200'}
                        >
                          {char.emoji}
                        </Box>
                        <Text 
                          fontSize="sm" 
                          fontWeight="bold" 
                          color={char.color + '.600'}
                        >
                          {char.name}
                        </Text>
                      </VStack>
                    </MotionBox>
                  </Box>
                ))}
              </MotionBox>
            </Box>
            
            {/* 스와이프 안내 텍스트 */}
            <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
              좌우로 밀어서 변경
            </Text>
          </Box>
          
          {/* 다음 버튼 */}
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="다음 상담사"
            onClick={nextCharacter}
            size="md"
            variant="ghost"
            colorScheme="gray"
            _hover={{ bg: 'gray.100' }}
          />
        </HStack>
        
        {/* 하단 인디케이터 */}
        <HStack justify="center" mt={3} spacing={2}>
          {characters.map((char, index) => (
            <MotionBox
              key={char.id}
              w="6px"
              h="6px"
              borderRadius="full"
              bg={index === currentIndex ? char.color + '.500' : 'gray.300'}
              cursor="pointer"
              onClick={() => setCharacter(char.id)}
              animate={{
                scale: index === currentIndex ? 1.2 : 1,
                opacity: index === currentIndex ? 1 : 0.6
              }}
              transition={ANIMATION_CONFIG.QUICK}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </HStack>
      </Box>
    </VStack>
  );
};




