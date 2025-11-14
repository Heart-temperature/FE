import React, { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, VStack, Box, Image, Divider, IconButton, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMicrophone, FaStop } from 'react-icons/fa';

import DabokVideo from '../../video/dabok.webm';
import DajeongVideo from '../../video/dajeung.webm';
import useAppSettings from '../../hooks/useAppSettings';
import useAudioRecorder from '../../hooks/useAudioRecorder';

import { endCall, startCall } from '../../api/callAPI';
import { getAiSocket } from '../../api/aiSocket';

const MotionBox = motion(Flex);
const MotionText = motion(Text);

export default function CallPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const { fontSizeLevel, setFontSizeLevel, isHighContrast, toggleHighContrast, fs, callBtnH } = useAppSettings();

    const [isTalking, setIsTalking] = useState(false); // AI가 말하는 중
    const [isUserTalking, setIsUserTalking] = useState(false); // 사용자가 말하는 중
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [userText, setUserText] = useState(''); // 사용자 음성인식 텍스트
    const [aiText, setAiText] = useState(''); // AI 응답 텍스트
    const [isCallActive, setIsCallActive] = useState(false); // 통화 활성화 상태

    const videoRef = useRef(null); // video 태그 ref
    const audioRef = useRef(null); // TTS 오디오 재생용 ref

    // 오디오 녹음 훅
    const { isRecording, error: recordError, toggleRecording } = useAudioRecorder();

    // 전달받은 캐릭터 정보
    const character = location.state?.character || {
        name: '다정이',
        characterType: 'dajeong',
        color: '#2196F3',
    };

    const politeness = location.state?.politeness || 'jondae';

    // 오디오 재생 함수
    const playAudio = useCallback(async (audioData) => {
        try {
            const arrayBuffer =
                audioData instanceof Blob
                    ? await audioData.arrayBuffer()
                    : audioData instanceof ArrayBuffer
                    ? audioData
                    : audioData.buffer;
            const size = arrayBuffer.byteLength;
            console.log(`🎵 재생 시작: ${size} bytes`);

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: 16000,
                });
            }

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
                console.log(`🔊 AudioContext 재개됨`);
            }

            if (arrayBuffer.byteLength < 2) {
                console.warn(`⚠️ 오디오 데이터가 너무 작음: ${arrayBuffer.byteLength} bytes`);
                return;
            }

            const audioDataInt16 = new Int16Array(arrayBuffer);
            const float32Array = new Float32Array(audioDataInt16.length);

            for (let i = 0; i < audioDataInt16.length; i++) {
                float32Array[i] = audioDataInt16[i] / 32768.0;
            }

            const audioBuffer = audioContextRef.current.createBuffer(1, float32Array.length, 16000);
            audioBuffer.getChannelData(0).set(float32Array);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);

            source.onended = () => {
                console.log(`✅ 재생 완료 (${audioBuffer.duration.toFixed(2)}초)`);
                setIsTalking(false);
            };

            source.start(0);
            console.log(`▶️ 재생 시작됨 (${audioBuffer.duration.toFixed(2)}초)`);
            setIsTalking(true);
        } catch (error) {
            console.error('❌ 재생 오류:', error);
        }
    }, []);

    // WebSocket 메시지 핸들러
    const handleMessage = useCallback((data) => {
        console.log(`📨 수신: ${data.type || data.event || 'unknown'}`, data);

        switch (data.type || data.event) {
            case 'start':
                console.log(`📞 통화 시작: ${data.message || '통화 거는 중...'}`);
                setCurrentSubtitle(data.message || '통화 거는 중...');
                break;
            case 'system':
                console.log(`💬 시스템: ${data.message || ''}`);
                break;
            case 'ready':
                if (data.event === 'start') {
                    console.log('✅ 음성 녹음 준비 완료');
                }
                break;
            case 'ended':
                if (data.event === 'stop') {
                    console.log('✅ 음성 녹음 종료 완료');
                }
                break;
            case 'status':
                console.log(`📊 상태: ${data.message}`);
                setCurrentSubtitle(data.message || '');
                break;
            case 'stt_status':
                console.log(`🎙️ STT 진행 중: ${data.message}`);
                setCurrentSubtitle('음성을 분석 중입니다...');
                break;
            case 'tts_start':
                console.log(`🔊 TTS 시작: "${data.text}"`);
                setCurrentSubtitle(data.text || '');
                setIsTalking(true);
                break;
            case 'tts_end':
                console.log(`🔊 TTS 종료`);
                setIsTalking(false);
                break;
            case 'transcription':
                setTranscriptions((prev) => [
                    ...prev,
                    { type: 'user', text: data.user_text },
                    { type: 'assistant', text: data.assistant_text },
                ]);
                setCurrentSubtitle(data.assistant_text || '');
                break;
            case 'call_summary':
                console.log('📊 통화 요약:', data);
                console.log('📊 감정 통계:', data.emotion_statistics);
                console.log('📝 대화 요약:', data.conversation_summary);
                // TODO: 통화 요약 데이터를 저장하거나 표시
                setCurrentSubtitle('통화가 종료되었습니다.');
                break;
            case 'auto_disconnect':
                console.warn(`⚠️ 비정상 종료: ${data.message}`);
                setCurrentSubtitle('통화가 비정상적으로 종료되었습니다.');
                break;
            case 'error':
                console.error(`❌ 오류: ${data.message}`);
                if (data.message === 'no active session') {
                    console.error('녹음 세션이 활성화되지 않았습니다.');
                } else {
                    setCurrentSubtitle(`오류: ${data.message}`);
                }
                break;
        }
    }, []);

    // 음성 에너지 계산
    const calculateEnergy = (audioData) => {
        let sum = 0;
        for (let i = 0; i < audioData.length; i++) {
            sum += audioData[i] * audioData[i];
        }
        return Math.sqrt(sum / audioData.length);
    };

    // 음성 감지
    const detectSpeech = (audioData) => {
        const energy = calculateEnergy(audioData);
        return energy > VAD_CONFIG.energyThreshold;
    };

    // 통화 시작 - 마이크 초기화
    useEffect(() => {
        const initCall = async () => {
            if (!location.state) return;

            try {
                // 1. 통화 시작 API 호출
                try {
                    await startCall(character, politeness);
                    console.log('📞 통화 시작 API 호출 완료');
                } catch (apiError) {
                    console.error('❌ 통화 시작 API 실패:', apiError.message);
                    alert(apiError.message || '통화를 시작할 수 없습니다.');
                    navigate('/app/home');
                    return;
                }

                // 2. 마이크 권한 요청
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 16000,
                    },
                });
                console.log('🎤 마이크 획득');

                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                        sampleRate: 16000,
                    });
                }

                await new Promise((resolve) => setTimeout(resolve, 100));

                const source = audioContextRef.current.createMediaStreamSource(stream);
                const processor = audioContextRef.current.createScriptProcessor(VAD_CONFIG.frameSize, 1, 1);

                // VAD 상태 초기화
                vadStateRef.current = {
                    isSpeaking: false,
                    silenceFrames: 0,
                    speechFrames: 0,
                    preRollBuffer: [],
                    isSending: false,
                    audioChunks: [],
                };

                processor.onaudioprocess = (e) => {
                    const socket = getAiSocket();
                    if (!socket || socket.readyState !== WebSocket.OPEN) {
                        return;
                    }

                    const inputData = e.inputBuffer.getChannelData(0);
                    const int16Data = new Int16Array(inputData.length);

                    for (let i = 0; i < inputData.length; i++) {
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                    }

                    // 프리롤 버퍼에 추가
                    vadStateRef.current.preRollBuffer.push(int16Data.buffer);
                    if (vadStateRef.current.preRollBuffer.length > VAD_CONFIG.preRollFrames) {
                        vadStateRef.current.preRollBuffer.shift();
                    }

                    // VAD로 음성 감지
                    const hasSpeech = detectSpeech(inputData);
                    if (hasSpeech) {
                        vadStateRef.current.speechFrames++;
                        vadStateRef.current.silenceFrames = 0;

                        // 음성 시작 감지
                        if (
                            !vadStateRef.current.isSpeaking &&
                            vadStateRef.current.speechFrames >= VAD_CONFIG.speechStartFrames
                        ) {
                            vadStateRef.current.isSpeaking = true;
                            vadStateRef.current.isSending = true;
                            vadStateRef.current.audioChunks = [];

                            console.log('🎤 음성 시작 감지 - start 이벤트 전송');
                            setIsUserTalking(true);

                            socket.send(
                                JSON.stringify({
                                    type: 'start',
                                    lang: 'ko',
                                })
                            );

                            // 프리롤 버퍼 포함해서 전송 시작
                            for (const chunk of vadStateRef.current.preRollBuffer) {
                                vadStateRef.current.audioChunks.push(chunk);
                                socket.send(chunk);
                            }
                        }

                        // 음성 중이면 계속 전송
                        if (vadStateRef.current.isSpeaking && vadStateRef.current.isSending) {
                            vadStateRef.current.audioChunks.push(int16Data.buffer);
                            socket.send(int16Data.buffer);
                        }
                    } else {
                        vadStateRef.current.speechFrames = 0;

                        if (vadStateRef.current.isSpeaking) {
                            vadStateRef.current.silenceFrames++;

                            // 무음 중에도 계속 전송
                            if (vadStateRef.current.isSending) {
                                vadStateRef.current.audioChunks.push(int16Data.buffer);
                                socket.send(int16Data.buffer);
                            }

                            // 음성 종료 감지
                            if (vadStateRef.current.silenceFrames >= VAD_CONFIG.silenceEndFrames) {
                                if (vadStateRef.current.audioChunks.length >= VAD_CONFIG.minSpeechFrames) {
                                    console.log(
                                        `🎤 음성 종료 감지 - stop 이벤트 전송 (${vadStateRef.current.audioChunks.length} 프레임)`
                                    );

                                    socket.send(
                                        JSON.stringify({
                                            type: 'stop',
                                        })
                                    );
                                } else {
                                    console.log(
                                        `🎤 너무 짧은 음성 - 무시 (${vadStateRef.current.audioChunks.length} 프레임)`
                                    );
                                }

                                vadStateRef.current.isSpeaking = false;
                                vadStateRef.current.isSending = false;
                                vadStateRef.current.silenceFrames = 0;
                                vadStateRef.current.speechFrames = 0;
                                vadStateRef.current.audioChunks = [];
                                setIsUserTalking(false);
                            }
                        }
                    }
                };

                source.connect(processor);
                processor.connect(audioContextRef.current.destination);
                audioStreamRef.current = stream;
                audioSourceRef.current = source;
                audioProcessorRef.current = processor;
                setIsCallActive(true);
                console.log('✅ 통화 시작 (로컬 VAD 활성화)');
            } catch (error) {
                console.error('❌ 마이크 오류:', error);
                alert('마이크 권한이 필요합니다.');
                navigate('/app/home');
            }
        };

        initCall();
    }, [location.state, character, politeness, navigate]);

    // WebSocket 메시지 리스너
    useEffect(() => {
        if (location.state) {
            const { character, politeness } = location.state;
            // 통화 시작 API 호출
            startCall(character, politeness);
            setIsCallActive(true);
            setCurrentSubtitle('통화가 시작되었습니다. 마이크 버튼을 눌러 말씀해주세요.');
        }
    }, [location.state]);

    // isTalking 상태에 따라 video 재생/정지
    useEffect(() => {
        if (!videoRef.current) return;

        if (isTalking && !isUserTalking) {
            videoRef.current.play().catch((e) => {
                console.log('Video play failed:', e);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isTalking, isUserTalking]);

    const handleEndCall = useCallback(() => {
        console.log('📴 통화 종료');

        // VAD 상태 초기화
        vadStateRef.current = {
            isSpeaking: false,
            silenceFrames: 0,
            speechFrames: 0,
            preRollBuffer: [],
            isSending: false,
            audioChunks: [],
        };

        if (audioProcessorRef.current) {
            audioProcessorRef.current.disconnect();
            audioProcessorRef.current = null;
        }
        if (audioSourceRef.current) {
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }

        endCall();
        setIsTalking(false);
        setIsCallActive(false);
        navigate('/app/home');
    }, [navigate]);

    // 페이지 언로드 시 정리
    useEffect(() => {
        const socket = getAiSocket();
        if (!socket) return;

        socket.onmessage = async (event) => {
            const data = event.data;

            // 🎧 1) 오디오 Blob/ArrayBuffer 메시지 처리 (TTS)
            if (data instanceof Blob || data instanceof ArrayBuffer) {
                console.log('🎵 AI 오디오 수신:', data);
                handleTTSAudio(data);
                return;
            }

            // 📝 2) JSON 텍스트 메시지 처리
            try {
                const msg = JSON.parse(data);
                console.log('📩 AI JSON 메시지 수신:', msg);
                handleWebSocketMessage(msg);
            } catch (err) {
                console.warn('⚠ JSON 파싱 실패 메시지:', data);
            }
        };

        // 에러 및 연결 종료 처리
        socket.onerror = (error) => {
            console.error('❌ WebSocket 오류:', error);
            toast({
                title: 'WebSocket 오류',
                description: '서버 연결에 문제가 발생했습니다.',
                status: 'error',
                duration: 3000,
            });
        };

        socket.onclose = () => {
            console.log('🔌 WebSocket 연결 종료');
            setIsCallActive(false);
        };

        return () => {
            // cleanup
        };
    }, [toast]);

    // WebSocket 메시지 처리 함수
    const handleWebSocketMessage = (msg) => {
        const { type, text, message } = msg;

        switch (type) {
            case 'stt_result':
                // STT 결과 (사용자 음성인식 결과)
                console.log('👤 사용자 발화:', text);
                setUserText(text);
                setCurrentSubtitle(`나: ${text}`);
                setIsUserTalking(false);
                break;

            case 'stt_status':
                // STT 처리 중
                console.log('🎤 STT 처리:', message);
                setCurrentSubtitle(message || 'STT 처리 중...');
                break;

            case 'tts_start':
                // TTS 시작 (AI 응답 텍스트)
                console.log('🤖 AI 응답:', text);
                setAiText(text);
                setCurrentSubtitle(text);
                setIsTalking(true);
                break;

            case 'tts_end':
                // TTS 종료
                console.log('🔊 TTS 재생 완료');
                setIsTalking(false);
                setCurrentSubtitle('마이크 버튼을 눌러 말씀해주세요.');
                break;

            case 'ready':
                // 녹음 준비 완료
                if (msg.event === 'start') {
                    console.log('✅ 녹음 준비 완료');
                    setIsUserTalking(true);
                    setCurrentSubtitle('듣고 있습니다...');
                }
                break;

            case 'error':
                // 에러 메시지
                console.error('❌ 서버 오류:', message);
                toast({
                    title: '오류 발생',
                    description: message || '알 수 없는 오류가 발생했습니다.',
                    status: 'error',
                    duration: 3000,
                });
                setIsTalking(false);
                setIsUserTalking(false);
                break;

            case 'call_summary':
                // 통화 요약
                console.log('📊 통화 요약:', msg);
                break;

            case 'auto_disconnect':
                // 자동 종료
                console.log('⚠️ 자동 종료:', message);
                toast({
                    title: '통화 종료',
                    description: message || '통화가 자동으로 종료되었습니다.',
                    status: 'warning',
                    duration: 3000,
                });
                handleEndCall();
                break;

            default:
                console.log('📨 기타 메시지:', msg);
        }
    };

    // TTS 오디오 재생 처리
    const handleTTSAudio = async (audioData) => {
        try {
            // Blob 또는 ArrayBuffer를 Blob으로 변환
            const blob = audioData instanceof Blob ? audioData : new Blob([audioData], { type: 'audio/wav' });

            // Blob URL 생성
            const url = URL.createObjectURL(blob);

            // 오디오 재생
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onplay = () => {
                console.log('🔊 TTS 오디오 재생 시작');
                setIsTalking(true);
            };

            audio.onended = () => {
                console.log('✅ TTS 오디오 재생 완료');
                setIsTalking(false);
                URL.revokeObjectURL(url);
            };

            audio.onerror = (e) => {
                console.error('❌ TTS 오디오 재생 오류:', e);
                setIsTalking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.error('❌ TTS 오디오 처리 오류:', error);
            setIsTalking(false);
        }
    };

    // 녹음 에러 처리
    useEffect(() => {
        if (recordError) {
            toast({
                title: '녹음 오류',
                description: recordError,
                status: 'error',
                duration: 3000,
            });
        }
    }, [recordError, toast]);

    // 녹음 버튼 클릭 핸들러
    const handleRecordClick = async () => {
        const socket = getAiSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            toast({
                title: 'WebSocket 연결 안 됨',
                description: '서버에 연결되지 않았습니다.',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (isTalking) {
            toast({
                title: 'AI가 말하는 중',
                description: 'AI가 말을 마칠 때까지 기다려주세요.',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        try {
            await toggleRecording(socket);
        } catch (error) {
            console.error('녹음 토글 오류:', error);
        }
    };

    // 통화 종료 핸들러
    const handleEndCall = () => {
        // 녹음 중이면 중지
        if (isRecording) {
            const socket = getAiSocket();
            if (socket) {
                toggleRecording(socket);
            }
        }

        // TTS 오디오 중지
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // 통화 종료 API 호출
        endCall();
        setIsTalking(false);
        setIsCallActive(false);
        navigate('/app/home'); // MainPage로 돌아가기
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={isHighContrast ? '#000000' : 'white'} px={3}>
            {/* 메인 로그인 카드 */}
            <Box p={{ base: 5, md: 14 }} w="full" maxW="530px">
                <VStack spacing={6} align="stretch">
                    {/* 캐릭터 영역 */}
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        w="100%"
                        h="450px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                        borderRadius="15px"
                        position="relative"
                    >
                        {/* video 태그로 webm 재생 제어 */}
                        <Box
                            as="video"
                            ref={videoRef}
                            src={character.characterType === 'dabok' ? DabokVideo : DajeongVideo}
                            loop
                            muted
                            playsInline
                            w="100%"
                            h="70%"
                            objectFit="cover"
                            onError={(e) => {
                                console.error('Video 로드 실패:', e.target.src);
                            }}
                        />

                        {/* 상태 표시 배지 */}
                        <HStack position="absolute" top="15px" right="15px" spacing={2}>
                            {isUserTalking && (
                                <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                                    🎤 말하는 중
                                </Badge>
                            )}
                            {isTalking && (
                                <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                                    🔊 AI 응답 중
                                </Badge>
                            )}
                        </HStack>
                    </MotionBox>

                    {/* 현재 자막 */}
                    <Box mt={2}>
                        <AnimatePresence mode="wait">
                            <MotionText
                                key={currentSubtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                fontSize={fs}
                                fontWeight="700"
                                color={isHighContrast ? '#FFFFFF' : '#000000'}
                                textAlign="center"
                                py={5}
                                borderRadius="15px"
                                minH="90px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                w="full"
                            >
                                {currentSubtitle}
                            </MotionText>
                        </AnimatePresence>
                    </Box>

                    {/* 녹음 버튼 */}
                    <Flex justifyContent="center" mt={4}>
                        <IconButton
                            icon={isRecording ? <FaStop /> : <FaMicrophone />}
                            onClick={handleRecordClick}
                            size="lg"
                            w="80px"
                            h="80px"
                            borderRadius="50%"
                            bg={isRecording ? '#F44336' : isHighContrast ? '#FFD700' : character.color || '#2196F3'}
                            color={isHighContrast ? '#000000' : 'white'}
                            border={isHighContrast ? '3px solid white' : 'none'}
                            boxShadow={
                                isRecording ? '0 0 20px rgba(244, 67, 54, 0.6)' : '0 4px 14px rgba(33, 150, 243, 0.3)'
                            }
                            _hover={{
                                transform: 'scale(1.1)',
                                boxShadow: isRecording
                                    ? '0 0 30px rgba(244, 67, 54, 0.8)'
                                    : '0 6px 20px rgba(33, 150, 243, 0.5)',
                            }}
                            _active={{
                                transform: 'scale(0.95)',
                            }}
                            transition="all 0.2s"
                            animation={isRecording ? 'pulse 1.5s infinite' : 'none'}
                            aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
                            isDisabled={!isCallActive || isTalking}
                        />
                    </Flex>

                    {/* 녹음 상태 표시 */}
                    {isRecording && (
                        <MotionText
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            fontSize="sm"
                            color={isHighContrast ? '#FFFFFF' : '#F44336'}
                            textAlign="center"
                            mt={2}
                            fontWeight="600"
                        >
                            🔴 녹음 중...
                        </MotionText>
                    )}

                    {/* <Box
                        bg="white"
                        borderRadius="10px"
                        p={3}
                        h="200px"
                        overflowY="auto"
                        mt={4}
                        boxShadow="0 0 10px rgba(0,0,0,0.1)"
                    >
                        {aiMessages.map((m, idx) => (
                            <Text key={idx} color="black" mb={2}>
                                👉 {m.message || JSON.stringify(m)}
                            </Text>
                        ))}
                    </Box> */}

                    {/* 통화 종료 버튼 */}
                    <Button
                        w="full"
                        bg={isHighContrast ? '#FFD700' : '#F44336'}
                        color={isHighContrast ? '#000000' : 'white'}
                        onClick={handleEndCall}
                        fontSize={fs}
                        fontWeight="700"
                        height={callBtnH}
                        borderRadius="15px"
                        border={isHighContrast ? '3px solid white' : 'none'}
                        boxShadow="0 4px 14px rgba(244, 67, 54, 0.3)"
                        mt={2}
                        _hover={{
                            bg: isHighContrast ? '#FFEB3B' : '#D32F2F',
                            transform: 'translateY(-2px)',
                            boxShadow: isHighContrast
                                ? '0 6px 20px rgba(255, 215, 0, 0.4)'
                                : '0 6px 20px rgba(244, 67, 54, 0.4)',
                        }}
                        _active={{
                            bg: isHighContrast ? '#FFC107' : '#C62828',
                            transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                    >
                        통화 종료
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}
