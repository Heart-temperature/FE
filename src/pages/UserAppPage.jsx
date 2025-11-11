import { useEffect, useRef, useState } from 'react';
import { Box, Button, Center, VStack, Text, HStack, useToast, Badge, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CharacterSlider } from '../components/ui/CharacterSlider';
import { Robot } from '../components/ui/Robot';
import { Human } from '../components/ui/Human';
import { VideoCharacter } from '../components/ui/VideoCharacter';
import { VoiceWave } from '../components/ui/VoiceWave';
import { APP_STATES } from '../constants';
import { useSystemFontSize } from '../hooks';

const MotionBox = motion(Box);

export default function UserApp() {
  const [state, setState] = useState(APP_STATES.INTRO);
  const [speaking, setSpeaking] = useState(false);
  const [character, setCharacter] = useState('robot');
  const toast = useToast();
  const ttsRef = useRef(null);

  // 시스템 폰트 사이즈 감지 및 적용
  const { fontScale, scaledSize } = useSystemFontSize();

  // 비디오 파일 경로 (public 폴더에 넣거나 URL로 변경 가능)
  const videoSrc = '/videos/ai-character.mp4';

  // 캐릭터 렌더링 헬퍼 함수
  const renderCharacter = (mode = 'idle') => {
    if (character === 'video') {
      return <VideoCharacter videoSrc={videoSrc} speaking={mode === 'talking'} />;
    } else if (character === 'robot') {
      return <Robot mode={mode} />;
    } else {
      return <Human mode={mode} />;
    }
  };

  // 인트로 → 자동 홈 전환
  useEffect(() => {
    if (state === APP_STATES.INTRO) {
      const timer = setTimeout(() => setState(APP_STATES.HOME), 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // 연결 시뮬레이션
  const startCall = () => {
    setState(APP_STATES.CONNECTING);
    setTimeout(() => {
      setState(APP_STATES.CALLING);
      speak('안녕하세요! 오늘 기분은 어떠세요? 저와 이야기 나눠요.');
      toast({ 
        title: 'AI와 연결되었습니다.', 
        status: 'success', 
        duration: 1200, 
        isClosable: true 
      });
    }, 1500);
  };

  // Web Speech API (간단 TTS)
  const speak = (text) => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      ttsRef.current = utterance;
      synth.speak(utterance);
    } catch (error) {
      // 브라우저 미지원 시에도 UI는 speaking 애니메이션으로 대체 가능
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 2500);
    }
  };

  const endCall = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch (error) {
      // 에러 무시
    }
    setSpeaking(false);
    setState(APP_STATES.ENDED);
  };

  // 공통 컨테이너
  const Screen = ({ children, bg = 'bg' }) => (
    <Box className="user-app-container">
      <Center minH="100vh" bg={bg} px={4}>
        <VStack spacing={6} maxW="480px" w="100%">
          {children}
        </VStack>
      </Center>
    </Box>
  );

  // 각 화면 렌더링
  if (state === APP_STATES.INTRO) {
    return (
      <Screen bg="#E6FFFA">
        <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>
          AI 친구를 불러오는 중…
        </Badge>
        {renderCharacter('idle')}
        <Spinner color="brand.500" size="lg" />
        <Text color="gray.600">잠시만 기다려주세요</Text>
      </Screen>
    );
  }

  if (state === APP_STATES.HOME) {
    return (
      <Screen>
        <CharacterSlider character={character} setCharacter={setCharacter} />
        {renderCharacter('idle')}
        <Text fontSize="xl" color="gray.700">버튼을 눌러 AI와 대화해요.</Text>
        <Button
          size="lg"
          colorScheme="green"
          w="full"
          h="56px"
          borderRadius="xl"
          onClick={startCall}
        >
          AI와 대화하기
        </Button>
        <HStack color="gray.500" fontSize="sm">
          <Badge colorScheme="green">📶 네트워크 정상</Badge>
          <Text>•</Text>
          <Text>도움말 · 설정</Text>
        </HStack>
      </Screen>
    );
  }

  if (state === APP_STATES.CONNECTING) {
    return (
      <Screen bg="#EBF4FF">
        {renderCharacter('idle')}
        <Text fontSize="lg" color="gray.700">AI와 연결 중…</Text>
        <Spinner color="brand.500" size="lg" />
        <Button size="lg" variant="ghost" onClick={() => setState(APP_STATES.HOME)}>
          취소
        </Button>
      </Screen>
    );
  }

  if (state === APP_STATES.CALLING) {
    return (
      <Screen bg="#F0E9FF">
        {renderCharacter(speaking ? 'talking' : 'idle')}
        <Text color="gray.700">
          {speaking ? 'AI가 말하고 있어요' : '말씀하시면 AI가 듣습니다'}
        </Text>
        <VoiceWave />
        <Button
          size="lg"
          colorScheme="red"
          w="full"
          h="56px"
          borderRadius="xl"
          onClick={endCall}
        >
          통화 종료
        </Button>
      </Screen>
    );
  }

  // ENDED 상태
  return (
    <Screen bg="#FFFBEA">
      {renderCharacter('idle')}
      <Text fontSize="xl" color="gray.700">오늘 이야기해주셔서 감사해요 😊</Text>
      <HStack w="full" spacing={3}>
        <Button size="lg" w="full" onClick={() => setState(APP_STATES.HOME)}>
          다시 대화하기
        </Button>
        <Button size="lg" w="full" variant="outline" onClick={() => window.close?.()}>
          앱 닫기
        </Button>
      </HStack>
    </Screen>
  );
}
