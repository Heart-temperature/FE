import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, Center, VStack, Text, HStack, useToast, Badge, Spinner, IconButton
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

const MotionBox = motion(Box)

export default function UserApp() {
  const [state, setState] = useState('intro') // intro | home | connecting | calling | ended
  const [speaking, setSpeaking] = useState(false)
  const [character, setCharacter] = useState('robot') // robot | human
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const toast = useToast()
  const ttsRef = useRef(null)

  // 인트로 → 자동 홈 전환
  useEffect(() => {
    if (state === 'intro') {
      const tm = setTimeout(() => setState('home'), 1500)
      return () => clearTimeout(tm)
    }
  }, [state])

  // 연결 시뮬레이션
  function startCall() {
    setState('connecting')
    // 1.5초 후 통화중으로
    setTimeout(() => {
      setState('calling')
      speak('안녕하세요! 오늘 기분은 어떠세요? 저와 이야기 나눠요.')
      toast({ title: 'AI와 연결되었습니다.', status: 'success', duration: 1200, isClosable: true })
    }, 1500)
  }

  // Web Speech API (간단 TTS)
  function speak(text) {
    try {
      const synth = window.speechSynthesis
      const uttr = new SpeechSynthesisUtterance(text)
      uttr.lang = 'ko-KR'
      uttr.onstart = () => setSpeaking(true)
      uttr.onend = () => setSpeaking(false)
      ttsRef.current = uttr
      synth.speak(uttr)
    } catch (_) {
      // 브라우저 미지원 시에도 UI는 speaking 애니메이션으로 대체 가능
      setSpeaking(true)
      setTimeout(() => setSpeaking(false), 2500)
    }
  }

  function endCall() {
    try {
      window.speechSynthesis?.cancel()
    } catch {}
    setSpeaking(false)
    setState('ended')
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      // 왼쪽으로 스와이프 - 다음 캐릭터
      const characters = ['robot', 'human']
      const currentIndex = characters.indexOf(character)
      const nextIndex = (currentIndex + 1) % characters.length
      setCharacter(characters[nextIndex])
    }
    if (isRightSwipe) {
      // 오른쪽으로 스와이프 - 이전 캐릭터
      const characters = ['robot', 'human']
      const currentIndex = characters.indexOf(character)
      const prevIndex = (currentIndex - 1 + characters.length) % characters.length
      setCharacter(characters[prevIndex])
    }
  }

  // 공통 컨테이너
  const Screen = ({ children, bg = 'bg' }) => (
    <Center minH="100vh" bg={bg} px={4}>
      <VStack spacing={6} maxW="480px" w="100%">
        {children}
      </VStack>
    </Center>
  )

  // 로봇 캐릭터
  const Robot = ({ mode = 'idle' }) => {
    return (
      <VStack spacing={3}>
        <MotionBox
          w="180px" h="180px" borderRadius="full" bg="white" boxShadow="lg"
          display="grid" placeItems="center"
          animate={mode === 'talking'
            ? { scale: [1, 1.06, 1], boxShadow: ['0 10px 20px rgba(0,0,0,0.08)','0 16px 32px rgba(0,0,0,0.12)','0 10px 20px rgba(0,0,0,0.08)'] }
            : { scale: [1, 1.02, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box w="120px" h="120px" bg="#0F172A" borderRadius="full" position="relative">
            <MotionBox
              position="absolute" top="40%" left="22%" w="20px" h="12px" bg="#66E3FF" borderRadius="12px"
              animate={{ opacity: [1, 0.8, 1], y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <MotionBox
              position="absolute" top="40%" right="22%" w="20px" h="12px" bg="#66E3FF" borderRadius="12px"
              animate={{ opacity: [1, 0.8, 1], y: mode === 'talking' ? [0, -2, 0] : [0, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
            />
            {mode === 'talking' && (
              <MotionBox
                position="absolute" bottom="28%" left="50%" transform="translateX(-50%)"
                w="36px" h="8px" bg="#66E3FF" borderRadius="8px"
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
    )
  }

  // 사람 캐릭터
  const Human = ({ mode = 'idle' }) => {
    return (
      <VStack spacing={3}>
        <MotionBox
          w="180px" h="180px" borderRadius="full" bg="white" boxShadow="lg"
          display="grid" placeItems="center"
          animate={mode === 'talking'
            ? { scale: [1, 1.06, 1], boxShadow: ['0 10px 20px rgba(0,0,0,0.08)','0 16px 32px rgba(0,0,0,0.12)','0 10px 20px rgba(0,0,0,0.08)'] }
            : { scale: [1, 1.02, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box w="120px" h="120px" bg="#F4A261" borderRadius="full" position="relative">
            {/* 머리카락 */}
            <Box
              position="absolute" top="-10px" left="50%" transform="translateX(-50%)"
              w="100px" h="40px" bg="#8B4513" borderRadius="50px 50px 0 0"
            />
            
            {/* 눈 */}
            <MotionBox
              position="absolute" top="35%" left="25%" w="16px" h="16px" bg="#2D3748" borderRadius="full"
              animate={{ scale: [1, 0.8, 1], y: mode === 'talking' ? [0, -1, 0] : [0, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <MotionBox
              position="absolute" top="35%" right="25%" w="16px" h="16px" bg="#2D3748" borderRadius="full"
              animate={{ scale: [1, 0.8, 1], y: mode === 'talking' ? [0, -1, 0] : [0, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
            />
            
            {/* 눈썹 */}
            <Box position="absolute" top="30%" left="20%" w="20px" h="3px" bg="#8B4513" borderRadius="2px" />
            <Box position="absolute" top="30%" right="20%" w="20px" h="3px" bg="#8B4513" borderRadius="2px" />
            
            {/* 코 */}
            <Box position="absolute" top="50%" left="50%" transform="translateX(-50%)" w="6px" h="8px" bg="#E76F51" borderRadius="3px" />
            
            {/* 입 */}
            <MotionBox
              position="absolute" bottom="25%" left="50%" transform="translateX(-50%)"
              w={mode === 'talking' ? "24px" : "16px"} h={mode === 'talking' ? "12px" : "4px"}
              bg="#E76F51" borderRadius="8px"
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
    )
  }

  // 캐릭터 슬라이드 컴포넌트
  const CharacterSlider = () => {
    const characters = [
      { id: 'robot', name: '로봇 상담사', emoji: '🤖', color: 'blue' },
      { id: 'human', name: '사람 상담사', emoji: '👨‍⚕️', color: 'green' }
    ]
    
    const currentIndex = characters.findIndex(char => char.id === character)
    
    const nextCharacter = () => {
      const nextIndex = (currentIndex + 1) % characters.length
      setCharacter(characters[nextIndex].id)
    }
    
    const prevCharacter = () => {
      const prevIndex = (currentIndex - 1 + characters.length) % characters.length
      setCharacter(characters[prevIndex].id)
    }

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
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
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
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.6
                  }}
                >
                  {characters.map((char, index) => (
                    <Box key={char.id} w="50%" h="full" display="flex" alignItems="center" justifyContent="center">
                      <MotionBox
                        initial={{ opacity: 0.6, scale: 0.85 }}
                        animate={{ 
                          opacity: index === currentIndex ? 1 : 0.6,
                          scale: index === currentIndex ? 1 : 0.85
                        }}
                        transition={{ 
                          duration: 0.4,
                          ease: "easeInOut"
                        }}
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
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </HStack>
        </Box>
      </VStack>
    )
  }

  // 파형(간단 CSS 애니메이션)
  const Wave = () => (
    <HStack spacing={1} h="20px" align="end" aria-label="음성 파형">
      {[...Array(8)].map((_, i) => (
        <MotionBox key={i} w="6px" bg="brand.500" borderRadius="sm"
          animate={{ height: ['4px','18px','8px','16px','6px'] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07 }}
        />
      ))}
    </HStack>
  )

  // 각 화면
  if (state === 'intro') {
    return (
      <Screen bg="#E6FFFA">
        <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>AI 친구를 불러오는 중…</Badge>
        {character === 'robot' ? <Robot mode="idle" /> : <Human mode="idle" />}
        <Spinner color="brand.500" size="lg" />
        <Text color="gray.600">잠시만 기다려주세요</Text>
      </Screen>
    )
  }

  if (state === 'home') {
    return (
      <Screen>
        <CharacterSlider />
        {character === 'robot' ? <Robot mode="idle" /> : <Human mode="idle" />}
        <Text fontSize="xl" color="gray.700">버튼을 눌러 AI와 대화해요.</Text>
        <Button size="lg" colorScheme="green" w="full" h="56px" borderRadius="xl" onClick={startCall}>
          AI와 대화하기
        </Button>
        <HStack color="gray.500" fontSize="sm">
          <Badge colorScheme="green">📶 네트워크 정상</Badge>
          <Text>•</Text>
          <Text>도움말 · 설정</Text>
        </HStack>
      </Screen>
    )
  }

  if (state === 'connecting') {
    return (
      <Screen bg="#EBF4FF">
        {character === 'robot' ? <Robot mode="idle" /> : <Human mode="idle" />}
        <Text fontSize="lg" color="gray.700">AI와 연결 중…</Text>
        <Spinner color="brand.500" size="lg" />
        <Button size="lg" variant="ghost" onClick={() => setState('home')}>취소</Button>
      </Screen>
    )
  }

  if (state === 'calling') {
    return (
      <Screen bg="#F0E9FF">
        {character === 'robot' ? <Robot mode={speaking ? 'talking' : 'idle'} /> : <Human mode={speaking ? 'talking' : 'idle'} />}
        <Text color="gray.700">{speaking ? 'AI가 말하고 있어요' : '말씀하시면 AI가 듣습니다'}</Text>
        <Wave />
        <Button size="lg" colorScheme="red" w="full" h="56px" borderRadius="xl" onClick={endCall}>
          통화 종료
        </Button>
      </Screen>
    )
  }

  // ended
  return (
    <Screen bg="#FFFBEA">
      {character === 'robot' ? <Robot mode="idle" /> : <Human mode="idle" />}
      <Text fontSize="xl" color="gray.700">오늘 이야기해주셔서 감사해요 😊</Text>
      <HStack w="full" spacing={3}>
        <Button size="lg" w="full" onClick={() => setState('home')}>다시 대화하기</Button>
        <Button size="lg" w="full" variant="outline" onClick={() => window.close?.()}>
          앱 닫기
        </Button>
      </HStack>
    </Screen>
  )
}