import { useRef, useCallback } from 'react';
import { getAiSocket } from '../api/aiSocket';
import { saveCallSummary } from '../api/callSummaryAPI';
import { handleWebSocketMessage, handleWebSocketError, handleWebSocketClose } from '../utils/websocketMessageHandler';
import { playTtsAudio, stopAllAudios } from '../utils/audioHandler';

/**
 * WebSocket 메시지 핸들러 훅
 * @param {Object} callbacks - 각 이벤트별 콜백 함수들
 * @returns {Object} WebSocket 핸들러 설정 함수
 */
export const useWebSocketHandler = (callbacks = {}) => {
    const isNormalFinishRef = useRef(true);
    const callSummaryReceivedRef = useRef(false);
    const isEndingCallRef = useRef(false); // 통화 종료 중인지 추적

    /**
     * WebSocket 메시지 핸들러 설정
     */
    const setupWebSocketHandler = useCallback(() => {
        const socket = getAiSocket();
        if (!socket) {
            console.error('❌ WebSocket이 없습니다. 핸들러 등록 실패');
            return;
        }

        // 기존 핸들러가 있으면 제거 후 재등록 (통화 재시작 시)
        if (socket.onmessage && socket._handlerRegistered) {
            console.log('⚠️ 기존 WebSocket 핸들러 제거 후 재등록...');
            socket.onmessage = null;
            delete socket._handlerRegistered;
        }

        console.log('='.repeat(50));
        console.log('📡 WebSocket 메시지 핸들러 등록');
        console.log('='.repeat(50));
        
        // 핸들러 등록 플래그 설정
        socket._handlerRegistered = true;

        // 텍스트/JSON 메시지 처리
        socket.onmessage = async (event) => {
            const data = event.data;

            // Blob 데이터 (TTS 오디오) 처리
            if (data instanceof Blob) {
                // 통화 종료 중이면 이전 오디오 모두 중지하고 마지막 오디오만 재생
                const isEndCallAudio = isEndingCallRef.current;
                await playTtsAudio(data, {
                    isEndCallAudio: isEndCallAudio,
                    onStart: () => {
                        if (callbacks.onTtsAudioStart) {
                            callbacks.onTtsAudioStart();
                        }
                    },
                    onEnd: () => {
                        if (callbacks.onTtsAudioEnd) {
                            callbacks.onTtsAudioEnd();
                        }
                    },
                    onError: (error) => {
                        if (callbacks.onTtsAudioError) {
                            callbacks.onTtsAudioError(error);
                        }
                    },
                });
                return;
            }

            // JSON 메시지 처리
            try {
                const msg = JSON.parse(data);
                const msgType = msg.type || 'unknown';
                console.log('📩 AI JSON 메시지 수신:', msgType, msg);

                // 메시지 타입별 처리
                handleWebSocketMessage(msg, {
                    onReadyStart: () => {
                        console.log('✅ 백엔드 녹음 준비 완료');
                        if (callbacks.onReadyStart) {
                            callbacks.onReadyStart();
                        }
                    },
                    onEndedStop: () => {
                        console.log('✅ 백엔드 녹음 종료 - AI 응답 대기');
                        if (callbacks.onEndedStop) {
                            callbacks.onEndedStop();
                        }
                    },
                    onTtsStart: (text) => {
                        console.log('   자막:', text);
                        if (callbacks.onTtsStart) {
                            callbacks.onTtsStart(text);
                        }
                    },
                    onTtsEnd: () => {
                        console.log('   TTS 종료');
                        if (callbacks.onTtsEnd) {
                            callbacks.onTtsEnd();
                        }
                    },
                    onSttStatus: (message) => {
                        console.log('   STT:', message);
                        if (callbacks.onSttStatus) {
                            callbacks.onSttStatus(message);
                        }
                    },
                    onStatus: (message) => {
                        console.log('   상태:', message);
                        if (callbacks.onStatus) {
                            callbacks.onStatus(message);
                        }
                    },
                    onTranscription: ({ userText, assistantText }) => {
                        if (callbacks.onTranscription) {
                            callbacks.onTranscription({ userText, assistantText });
                        }
                    },
                    onCallSummary: async ({ emotionStatistics, conversationSummary }) => {
                        console.log('📊 통화 요약 수신:', { emotionStatistics, conversationSummary });
                        callSummaryReceivedRef.current = true;

                        // 통화 요약 데이터 저장 (강제 종료 시 normalFinish: false)
                        const callSummaryData = {
                            emotion_statistics: emotionStatistics,
                            conversation_summary: conversationSummary,
                            normalFinish: isNormalFinishRef.current,
                        };

                        // 백엔드로 통화 요약 전송
                        try {
                            await saveCallSummary(callSummaryData);
                            console.log('✅ 통화 요약 저장 완료 (normalFinish:', isNormalFinishRef.current, ')');
                            if (callbacks.onCallSummarySaved) {
                                callbacks.onCallSummarySaved();
                            }
                            
                            // 강제 종료인 경우는 이미 리다이렉션되었으므로 추가 처리 불필요
                            // (onAutoDisconnect에서 이미 리다이렉션 처리됨)
                        } catch (error) {
                            console.error('❌ 통화 요약 저장 실패:', error);
                            if (callbacks.onCallSummaryError) {
                                callbacks.onCallSummaryError(error);
                            }
                        }
                    },
                    onError: (message) => {
                        console.error('❌ 서버 에러:', message);
                        if (callbacks.onError) {
                            callbacks.onError(message);
                        }
                    },
                    onTtsStop: (message) => {
                        console.log('🛑 TTS 중단:', message);
                        // TTS 중단 시 모든 오디오 중지
                        stopAllAudios();
                        if (callbacks.onTtsStop) {
                            callbacks.onTtsStop(message);
                        }
                    },
                    onAutoDisconnect: async (message) => {
                        console.log('⚠️ 자동 종료 감지 (30초 침묵):', message);
                        // 강제 종료 플래그 설정
                        isNormalFinishRef.current = false;
                        
                        // 강제 종료 시 즉시 리다이렉션 (call_summary는 백그라운드에서 처리)
                        if (callbacks.onAutoDisconnect) {
                            callbacks.onAutoDisconnect(message);
                        }
                        
                        // 백그라운드에서 call_summary를 기다려서 저장 (리다이렉션 후에도 처리)
                        setTimeout(async () => {
                            if (!callSummaryReceivedRef.current) {
                                console.warn('⚠️ 강제 종료 후 call_summary 미수신, 빈 데이터로 저장 시도');
                                
                                // 빈 데이터로 통화 요약 저장 시도
                                const callSummaryData = {
                                    emotion_statistics: {},
                                    conversation_summary: '',
                                    normalFinish: false,
                                };
                                
                                try {
                                    await saveCallSummary(callSummaryData);
                                    console.log('✅ 강제 종료 통화 요약 저장 완료 (빈 데이터)');
                                } catch (error) {
                                    console.error('❌ 강제 종료 통화 요약 저장 실패:', error);
                                }
                            }
                        }, 3000); // 3초 후 빈 데이터로 저장 시도
                        
                        // onAutoDisconnectComplete는 onAutoDisconnect에서 이미 리다이렉션했으므로 호출하지 않음
                    },
                    onUnknown: (msg) => {
                        console.log('⚠️ 알 수 없는 메시지:', msg);
                    },
                });

                // 메시지 로그 저장 (필요한 경우)
                if (callbacks.onMessage) {
                    callbacks.onMessage(msg);
                }
            } catch {
                console.warn('⚠️ JSON 파싱 실패:', data);
            }
        };

        // WebSocket 오류 처리
        socket.onerror = (error) => {
            handleWebSocketError(error, callbacks.onSocketError);
        };

        // WebSocket 연결 종료 처리
        socket.onclose = (event) => {
            handleWebSocketClose(event, {
                onClose: () => {
                    if (callbacks.onClose) {
                        callbacks.onClose(event);
                    }
                },
                onAbnormalClose: async (event) => {
                    console.warn('⚠️ 비정상 종료 감지 - 통화 요약을 받지 못함');
                    isNormalFinishRef.current = false;

                    // 비정상 종료 시에도 빈 요약 데이터 전송
                    const callSummaryData = {
                        emotion_statistics: {},
                        conversation_summary: '',
                        normalFinish: false,
                    };

                    try {
                        await saveCallSummary(callSummaryData);
                        console.log('✅ 비정상 종료 요약 저장 완료');
                        if (callbacks.onAbnormalClose) {
                            callbacks.onAbnormalClose(event);
                        }
                    } catch (error) {
                        console.error('❌ 비정상 종료 요약 저장 실패:', error);
                    }
                },
                isNormalFinish: isNormalFinishRef.current,
                callSummaryReceived: callSummaryReceivedRef.current,
            });
        };
    }, [callbacks]);

    /**
     * 정상 종료 플래그 설정
     */
    const setNormalFinish = useCallback((value) => {
        isNormalFinishRef.current = value;
    }, []);

    /**
     * 통화 요약 수신 여부 확인
     */
    const hasReceivedCallSummary = useCallback(() => {
        return callSummaryReceivedRef.current;
    }, []);

    /**
     * 통화 종료 시작 (모든 오디오 중지)
     */
    const startEndingCall = useCallback(() => {
        console.log('📞 통화 종료 시작 - 모든 오디오 중지');
        isEndingCallRef.current = true;
        stopAllAudios();
    }, []);

    return {
        setupWebSocketHandler,
        setNormalFinish,
        hasReceivedCallSummary,
        startEndingCall,
    };
};

export default useWebSocketHandler;

