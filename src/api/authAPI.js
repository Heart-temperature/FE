/**
 * 관리자 로그인 API
 * @param {string} loginId - 관리자 아이디
 * @param {string} loginPw - 관리자 비밀번호
 * @returns {Promise<Object>} 로그인 응답 데이터
 */
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

