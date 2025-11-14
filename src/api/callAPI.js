// callAPI.js
import axios from 'axios';

let aiSocket = null;

export const startCall = async (character, politeness) => {
    try {
        // politeness 변환
        const politenessValue = politeness ? 'formal' : 'casual';

        // 1) 백엔드에서 callInfo 가져오기
        const response = await axios.get('http://localhost:8080/webkit/call/callInfo');
        const data = response.data;

        console.log('📌 callInfo:', data);

        // 2) WebSocket 연결 준비
        if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
            aiSocket = new WebSocket('ws://202.31.135.25:8080/ws');

            await new Promise((resolve, reject) => {
                aiSocket.onopen = () => resolve();
                aiSocket.onerror = (err) => reject(err);
            });
        }

        // 3) AI 서버로 전달할 payload 구성
        const payload = {
            type: 'start_call',
            persona: character.characterType, // 캐릭터에서 characterType 쓰기
            speechStyle: politenessValue, // formal이면 존댓말, casual이면 반말
            user_info: data.user_info,
            conversationSummaries: data.conversationSummaries || [],
            latestConversationSummary: data.latestConversationSummary || '',
        };

        console.log('📤 AI 서버로 보낼 payload:', payload);

        // 4) WebSocket 전송
        aiSocket.send(JSON.stringify(payload));

        return { success: true };
    } catch (error) {
        console.error('❌ startCall error:', error);
        return { success: false, error };
    }
};

export const endCall = () => {
    try {
        // WebSocket 준비 확인
        if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
            console.warn('⚠ WebSocket is not connected. Cannot send stop_call.');
            return { success: false, error: 'WebSocket not connected' };
        }

        // AI 서버로 전달할 payload 구성
        const payload = {
            type: 'stop_call',
        };

        console.log('📤 AI 서버로 보낼 payload:', payload);

        // WebSocket 전송
        aiSocket.send(JSON.stringify(payload));

        return { success: true };
    } catch (error) {
        console.error('❌ endCall error:', error);
        return { success: false, error };
    }
};
