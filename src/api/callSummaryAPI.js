// callSummaryAPI.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/webkit';

/**
 * 통화 요약 저장 API
 * @param {Object} callSummary - 통화 요약 데이터
 * @param {Object} callSummary.emotion_statistics - 감정 통계
 * @param {string} callSummary.conversation_summary - 대화 요약
 * @param {boolean} callSummary.normalFinish - 정상 종료 여부
 * @returns {Promise<Object>} API 응답
 */
export const saveCallSummary = async (callSummary) => {
    try {
        const token = localStorage.getItem('userToken');

        if (!token) {
            console.error('❌ 토큰 없음 (로그인 필요)');
            throw new Error('로그인이 필요합니다.');
        }

        console.log('📤 통화 요약 전송:', callSummary);

        const response = await axios.post(
            `${BASE_URL}/call/summary`,
            {
                emotion_statistics: callSummary.emotion_statistics,
                conversation_summary: callSummary.conversation_summary,
                normalFinish: callSummary.normalFinish,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            }
        );

        console.log('✅ 통화 요약 저장 완료:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ 통화 요약 저장 오류:', error);
        
        let errorMessage = '통화 요약 저장 중 오류가 발생했습니다.';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
            } else if (error.response.status === 404) {
                errorMessage = '통화 요약 API를 찾을 수 없습니다.';
            } else {
                errorMessage = `서버 오류: ${error.response.status}`;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

