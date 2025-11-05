import { Flex, HStack, VStack, Text, Button, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ArrowBackIcon, TimeIcon } from '@chakra-ui/icons';
import { useClock } from '../../hooks/useClock';

/**
 * 공통 헤더 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 헤더 제목
 * @param {string} props.subtitle - 헤더 부제목
 * @param {boolean} props.showBackButton - 뒤로가기 버튼 표시 여부
 * @param {Function} props.onBack - 뒤로가기 콜백
 * @param {Array} props.actions - 액션 버튼들
 * @param {Object} props.user - 사용자 정보
 */
export const Header = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack, 
  actions = [], 
  user 
}) => {
  const { timeString, dateString } = useClock();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Flex 
      as="header" 
      align="center" 
      justify="space-between" 
      p={4} 
      bg={bgColor}
      borderBottom="1px" 
      borderColor="gray.200"
      boxShadow="sm"
    >
      <HStack spacing={4}>
        {showBackButton && (
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={onBack}
            variant="ghost"
            aria-label="뒤로 가기"
          />
        )}
        <VStack align="start" spacing={0}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {title}
          </Text>
          {subtitle && (
            <Text color="gray.500" fontSize="sm">
              {subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
      
      <HStack spacing={6}>
        <HStack spacing={2} bg="gray.50" px={3} py={2} borderRadius="md">
          <TimeIcon color="gray.600" />
          <Text fontSize="sm" fontWeight="500" color="gray.700">
            {dateString} {timeString}
          </Text>
        </HStack>
        
        {actions.length > 0 && (
          <HStack spacing={3}>
            {actions.map((action, index) => (
              <Button
                key={index}
                leftIcon={action.icon}
                colorScheme={action.colorScheme}
                size={action.size || 'sm'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </HStack>
        )}
        
      </HStack>
    </Flex>
  );
};

