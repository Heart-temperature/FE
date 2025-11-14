// callAPI.js
import axios from 'axios';
import { connectAiSocket, getAiSocket } from './aiSocket';

export const startCall = async (character, politeness) => {
    try {
        console.log('='.repeat(50));
        console.log('📞 통화 시작 요청');

        // 1) 토큰 가져오기
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('❌ 토큰 없음 (로그인 필요)');
            return { success: false, error: 'No token' };
        }

        // 2) 백엔드에서 callInfo 가져오기
        console.log('📡 백엔드에서 callInfo 가져오는 중...');
        const response = await axios.get('http://localhost:8080/webkit/call/callInfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = response.data;
        console.log('✅ callInfo 수신:', data);

        // 3) WebSocket 연결 확인 및 재연결
        let aiSocket = getAiSocket();
        console.log('🔍 WebSocket 상태 확인:', aiSocket ? aiSocket.readyState : 'null');

        if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
            console.log('🔌 WebSocket 재연결 시작...');
            aiSocket = await connectAiSocket();
            console.log('✅ WebSocket 연결 완료');
        } else {
            console.log('✅ WebSocket 이미 연결됨');
        }

        // WebSocket이 완전히 OPEN 상태인지 다시 확인
        if (aiSocket.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket이 OPEN 상태가 아닙니다:', aiSocket.readyState);
            // OPEN 상태가 될 때까지 대기
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('WebSocket 연결 타임아웃'));
                }, 5000);

                const checkState = setInterval(() => {
                    console.log('⏳ WebSocket 상태 대기 중:', aiSocket.readyState);
                    if (aiSocket.readyState === WebSocket.OPEN) {
                        clearInterval(checkState);
                        clearTimeout(timeout);
                        resolve();
                    } else if (aiSocket.readyState === WebSocket.CLOSED || aiSocket.readyState === WebSocket.CLOSING) {
                        clearInterval(checkState);
                        clearTimeout(timeout);
                        reject(new Error('WebSocket 연결 실패'));
                    }
                }, 100);
            });
            console.log('✅ WebSocket OPEN 상태 확인됨');
        }

        // 4) payload 생성
        const payload = {
            type: 'start_call',
            persona: character.characterType,
            speech_style: politeness ? 'formal' : 'casual',
            user_info: data.user_info,
            conversationSummaries: data.conversationSummaries || [],
            latestConversationSummary: data.latestConversationSummary || '',
        };

        console.log('📤 AI 서버로 payload 전송');
        console.log('   페르소나:', payload.persona);
        console.log('   말투:', payload.speech_style);
        console.log('   WebSocket 상태:', aiSocket.readyState, '(1=OPEN)');

        // 5) WebSocket 메시지 전송
        aiSocket.send(JSON.stringify(payload));

        console.log('✅ 통화 시작 메시지 전송 완료');
        console.log('='.repeat(50));

        return { success: true };
    } catch (error) {
        console.error('='.repeat(50));
        console.error('❌ startCall 오류:', error);
        console.error('   메시지:', error.message);
        console.error('='.repeat(50));
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
