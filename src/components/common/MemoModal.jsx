import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Box,
  Avatar,
  useToast
} from '@chakra-ui/react';

/**
 * 메모 추가 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 모달 닫기 콜백
 * @param {Object} props.user - 사용자 정보
 * @param {string} props.memoText - 메모 텍스트
 * @param {Function} props.setMemoText - 메모 텍스트 설정 함수
 * @param {Function} props.onSave - 저장 콜백
 */
export const MemoModal = ({
  isOpen,
  onClose,
  user,
  memoText,
  setMemoText,
  onSave
}) => {
  const toast = useToast();

  const handleSave = () => {
    if (memoText.trim()) {
      onSave();
      toast({
        title: '메모 저장 완료!',
        description: `${user?.name}님의 메모가 저장되었습니다.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: '메모를 입력해주세요',
        description: '메모 내용을 입력한 후 저장해주세요.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          메모 추가 - {user?.name}님
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                사용자 정보
              </Text>
              <HStack spacing={3}>
                <Avatar size="sm" name={user?.name} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{user?.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user?.age}세 • {user?.address}
                  </Text>
                </VStack>
              </HStack>
            </Box>
            
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                메모 내용
              </Text>
              <Textarea
                placeholder="메모를 입력해주세요..."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                rows={4}
                resize="vertical"
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

