/**
 * WebSocket 메시지 타입별 처리 로직
 */

/**
 * 메시지 타입별 핸들러
 * @param {Object} msg - WebSocket 메시지
 * @param {Object} handlers - 각 메시지 타입별 핸들러 함수들
 * @returns {boolean} 메시지가 처리되었는지 여부
 */
export const handleWebSocketMessage = (msg, handlers) => {
    const msgType = msg.type || 'unknown';

    switch (msgType) {
        case 'ready':
            if (msg.event === 'start' && handlers.onReadyStart) {
                handlers.onReadyStart();
                return true;
            }
            break;

        case 'ended':
            if (msg.event === 'stop' && handlers.onEndedStop) {
                handlers.onEndedStop();
                return true;
            }
            break;

        case 'tts_start':
            if (handlers.onTtsStart) {
                handlers.onTtsStart(msg.text);
                return true;
            }
            break;

        case 'tts_end':
            if (handlers.onTtsEnd) {
                handlers.onTtsEnd();
                return true;
            }
            break;

        case 'stt_status':
            if (handlers.onSttStatus && msg.message) {
                handlers.onSttStatus(msg.message);
                return true;
            }
            break;

        case 'status':
            if (handlers.onStatus && msg.message) {
                handlers.onStatus(msg.message);
                return true;
            }
            break;

        case 'transcription':
            if (handlers.onTranscription) {
                handlers.onTranscription({
                    userText: msg.user_text,
                    assistantText: msg.assistant_text,
                });
                return true;
            }
            break;

        case 'call_summary':
            if (handlers.onCallSummary) {
                handlers.onCallSummary({
                    emotionStatistics: msg.emotion_statistics || {},
                    conversationSummary: msg.conversation_summary || '',
                });
                return true;
            }
            break;

        case 'error':
            if (handlers.onError && msg.message) {
                handlers.onError(msg.message);
                return true;
            }
            break;

        case 'tts_stop':
            if (handlers.onTtsStop) {
                handlers.onTtsStop(msg.message);
                return true;
            }
            break;

        case 'auto_disconnect':
            if (handlers.onAutoDisconnect) {
                handlers.onAutoDisconnect(msg.message);
                return true;
            }
            break;

        default:
            if (handlers.onUnknown) {
                handlers.onUnknown(msg);
            }
            return false;
    }

    return false;
};

/**
 * WebSocket 오류 처리
 * @param {Error} error - WebSocket 오류
 * @param {Function} onError - 오류 핸들러
 */
export const handleWebSocketError = (error, onError) => {
    console.error('❌ WebSocket 에러:', error);
    if (onError) {
        onError(error);
    }
};

/**
 * WebSocket 연결 종료 처리
 * @param {CloseEvent} event - 종료 이벤트
 * @param {Object} handlers - 종료 핸들러 함수들
 */
export const handleWebSocketClose = (event, handlers) => {
    console.log('🔌 WebSocket 연결 종료', event.code, event.reason);

    if (handlers.onClose) {
        handlers.onClose(event);
    }

    // 비정상 종료 감지
    if (handlers.onAbnormalClose && !handlers.isNormalFinish && !handlers.callSummaryReceived) {
        handlers.onAbnormalClose(event);
    }
};

