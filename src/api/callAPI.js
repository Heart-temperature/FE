// callAPI.js
import axios from 'axios';

let aiSocket = null;

export const startCall = async () => {
    try {
        // 1) 백엔드에서 callInfo 가져오기
        const response = await axios.get('http://localhost:8080/webkit/call/callInfo');
        const data = response.data;

        console.log('📌 callInfo:', data);

        // 2) WebSocket 연결 (이미 연결돼있으면 재연결 방지)
        if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
            aiSocket = new WebSocket('ws://202.31.135.25:8080/ws');

            // WebSocket 연결될 때까지 기다리기
            await new Promise((resolve, reject) => {
                aiSocket.onopen = () => {
                    console.log('✅ WebSocket connected!');
                    resolve();
                };
                aiSocket.onerror = (err) => {
                    console.error('❌ WebSocket error:', err);
                    reject(err);
                };
            });
        }

        // 3) AI 서버로 전송할 메시지 구성
        const payload = {
            type: 'start_call',
            persona: 'dabok',
            politeness: 'jondae',
            user_info: data.user_info,
            conversationSummaries: data.conversationSummaries || [],
            latestConversationSummary: data.latestConversationSummary || '',
        };

        console.log('📤 AI 서버로 보낼 payload:', payload);

        // 4) WebSocket으로 전송
        aiSocket.send(JSON.stringify(payload));

        return { success: true };
    } catch (error) {
        console.error('❌ startCall error:', error);
        return { success: false, error };
    }
};
