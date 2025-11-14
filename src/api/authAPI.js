/**
 * 관리자 로그인 API
 * @param {string} loginId - 관리자 아이디
 * @param {string} loginPw - 관리자 비밀번호
 * @returns {Promise<Object>} 로그인 응답 데이터
 */

import axios from 'axios';
import { base, tr } from 'framer-motion/client';

const BASE_URL = 'http://localhost:8080/webkit';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginAdmin = async (loginId, loginPw) => {
    try {
        const response = await fetch('http://localhost:8080/webkit/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ loginId, loginPw }),
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} - ${responseText}`);
        }

        let result = {};
        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.warn('Response is not JSON:', responseText);
            }
        }

        return result;
    } catch (error) {
        console.error('Login API Error:', error);
        throw error;
    }
};

/**
 * 관리자 회원가입 API
 * @param {Object} userData - 회원가입 정보
 * @returns {Promise<Object>} 회원가입 응답 데이터
 */
export const signUpAdmin = async (userData) => {
    try {
        const response = await fetch('http://localhost:8080/webkit/admin/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            throw new Error(`Sign up failed: ${response.status} - ${responseText}`);
        }

        let result = {};
        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.warn('Response is not JSON:', responseText);
            }
        }

        return result;
    } catch (error) {
        console.error('Sign Up API Error:', error);
        throw error;
    }
};

// 사용자 로그인 API
export const loginUser = async (phoneNum, loginPw) => {
    try {
        // 11자리 숫자를 '010-xxxx-xxxx' 형식으로 변환
        const formattedPhone = `${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 7)}-${phoneNum.slice(7)}`;

        const response = await api.post('/auth/login', {
            loginId: formattedPhone,
            loginPw,
        });

        const data = response.data;

        if (data.token) {
            localStorage.setItem('userToken', data.token);

            // JWT에서 userId 추출 (토큰의 payload에서 sub 필드)
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                const userId = payload.sub; // JWT의 sub 필드가 userId (전화번호)
                if (userId) {
                    localStorage.setItem('userId', userId);
                    console.log('✅ userId 저장:', userId);
                }
            } catch (e) {
                console.error('JWT 파싱 실패:', e);
            }
        }

        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "로그인 실패");
        } else {
            throw new Error("네트워크 오류");
        }
    }
};


// 로그아웃
export const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
};

//로그인 상태 확인
export const getToken = () => {
    return localStorage.getItem('userToken');
};