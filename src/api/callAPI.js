// callAPI.js
import axios from 'axios';
import { connectAiSocket, getAiSocket } from './aiSocket';

export const startCall = async (character, politeness) => {
    try {
        // 1) 토큰과 userId 가져오기
        const token = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');

        if (!token) {
            console.error('❌ 토큰 없음 (로그인 필요)');
            return { success: false, error: 'No token' };
        }

        if (!userId) {
            console.error('❌ userId 없음 (로그인 필요)');
            return { success: false, error: 'No userId' };
        }

        // 2) 백엔드에서 callInfo 가져오기
        const response = await axios.get(`http://localhost:8080/webkit/call/callInfo/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = response.data;
        console.log('📌 callInfo:', data);

        // 3) WebSocket 연결 (없으면 connectAiSocket가 자동 연결)
        let aiSocket = getAiSocket();
        if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
            console.log('🔌 WebSocket이 닫혀있어서 재연결합니다...');
            aiSocket = await connectAiSocket();
        }

        // 4) payload 생성 (스펙에 맞춰 수정)
        const payload = {
            type: 'start_call',
            persona: character.characterType, // "dabok" | "dajeong"
            speech_style: politeness ? 'formal' : 'casual', // "formal" | "casual"
            user_info: data.user_info,
            conversationSummaries: data.conversationSummaries || [],
            latestConversationSummary: data.latestConversationSummary || '',
        };

        console.log('📤 AI 서버로 보낼 payload:', payload);

        // 5) WebSocket 메시지 전송
        aiSocket.send(JSON.stringify(payload));

        return { success: true };
    } catch (error) {
        console.error('❌ startCall error:', error);
        return { success: false, error };
    }
};

export const endCall = () => {
    try {
        let aiSocket = getAiSocket();

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
