import { useState, useRef, useCallback } from 'react';

/**
 * 오디오 녹음을 위한 커스텀 훅
 * WebSocket을 통한 실시간 오디오 스트리밍 지원
 */
export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);

    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);
    const sourceRef = useRef(null);
    const wsRef = useRef(null);

    /**
     * 녹음 시작
     * @param {WebSocket} websocket - 오디오 데이터를 전송할 WebSocket 연결
     */
    const startRecording = useCallback(async (websocket) => {
        try {
            setError(null);

            // WebSocket 연결 확인
            if (!websocket || websocket.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket이 연결되지 않았습니다');
            }

            wsRef.current = websocket;

            // 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            streamRef.current = stream;

            // 오디오 컨텍스트 생성 (16kHz 샘플레이트)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000,
            });

            audioContextRef.current = audioContext;

            // 오디오 소스 생성
            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            // ScriptProcessor를 사용하여 오디오 데이터 처리
            // 4096 샘플 버퍼, 1 입력 채널, 1 출력 채널
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            // 오디오 프로세싱 이벤트 핸들러
            processor.onaudioprocess = (e) => {
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                    return;
                }

                // Float32 오디오 데이터 가져오기
                const inputData = e.inputBuffer.getChannelData(0);

                // Float32를 Int16으로 변환 (AI 서버가 기대하는 형식)
                const int16Data = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    // -1.0 ~ 1.0 범위를 -32768 ~ 32767로 변환
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                }

                // WebSocket으로 바이너리 데이터 전송
                try {
                    wsRef.current.send(int16Data.buffer);
                } catch (err) {
                    console.error('오디오 전송 실패:', err);
                }
            };

            // 오디오 노드 연결
            source.connect(processor);
            processor.connect(audioContext.destination);

            // 녹음 시작 메시지 전송
            websocket.send(
                JSON.stringify({
                    type: 'start',
                    lang: 'ko',
                })
            );

            setIsRecording(true);
            console.log('🎤 녹음 시작');
        } catch (err) {
            console.error('녹음 시작 오류:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * 녹음 중지
     */
    const stopRecording = useCallback(() => {
        try {
            // 스트림 중지
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            // 오디오 노드 연결 해제
            if (processorRef.current) {
                processorRef.current.disconnect();
                processorRef.current.onaudioprocess = null;
                processorRef.current = null;
            }

            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current = null;
            }

            // 오디오 컨텍스트 종료
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }

            // 녹음 중지 메시지 전송
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: 'stop',
                    })
                );
            }

            wsRef.current = null;
            setIsRecording(false);
            console.log('⏹️ 녹음 중지');
        } catch (err) {
            console.error('녹음 중지 오류:', err);
            setError(err.message);
        }
    }, []);

    /**
     * 토글 녹음 (시작/중지)
     */
    const toggleRecording = useCallback(
        async (websocket) => {
            if (isRecording) {
                stopRecording();
            } else {
                await startRecording(websocket);
            }
        },
        [isRecording, startRecording, stopRecording]
    );

    return {
        isRecording,
        error,
        startRecording,
        stopRecording,
        toggleRecording,
    };
};

export default useAudioRecorder;
