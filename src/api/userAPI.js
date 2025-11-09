/**
 * JWT 토큰 가져오기 (localStorage에서)
 * @returns {string|null} JWT 토큰 (Bearer 제외한 순수 토큰만)
 */
const getToken = () => {
    const adminToken = localStorage.getItem('adminToken');
    const accessToken = localStorage.getItem('accessToken');
    const jwtToken = localStorage.getItem('jwtToken');
    const authHeader = localStorage.getItem('Authorization');
    
    // Authorization 헤더에서 Bearer 토큰이 저장된 경우
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // "Bearer " 제거하고 순수 토큰만 추출
    } else if (authHeader) {
        token = authHeader; // Bearer 없으면 그대로 사용
    } else if (adminToken) {
        token = adminToken;
    } else if (accessToken) {
        token = accessToken;
    } else if (jwtToken) {
        token = jwtToken;
    }
    
    return token;
};

/**
 * 인증 헤더 생성
 * @returns {Object} 헤더 객체
 */
const getHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        // 토큰은 순수 토큰(Bearer 제외)이므로 항상 Bearer 추가
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * 사용자 목록 조회 API
 * @param {number} adminId - 관리자 ID
 * @returns {Promise<Array>} 사용자 목록
 */
export const fetchUserList = async (adminId) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/admin/user-list?adminId=${adminId}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user list: ${response.status}`);
        }

        const responseText = await response.text();
        let userList = [];

        if (responseText && responseText.trim()) {
            try {
                userList = JSON.parse(responseText);
                if (!Array.isArray(userList)) {
                    userList = [userList];
                }
            } catch (e) {
                console.error('Failed to parse user list:', e.message);
            }
        }

        return userList;
    } catch (error) {
        console.error('Fetch User List API Error:', error);
        throw error;
    }
};

/**
 * 사용자 추가 API
 * @param {Object} userData - 사용자 정보
 * @returns {Promise<Object>} 응답 데이터
 */
export const addUser = async (userData) => {
    try {
        const response = await fetch('http://localhost:8080/webkit/admin/relationship-signup', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Response:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.warn('Response is not JSON, treating as success');
                result = { message: 'User added successfully' };
            }
        } else {
            console.log('Empty response body - treating as success');
            result = { message: 'User added successfully' };
        }

        return result;
    } catch (error) {
        console.error('Add User API Error:', error);
        throw error;
    }
};

/**
 * 사용자 정보 수정 API
 * @param {number} userId - 사용자 ID
 * @param {Object} userData - 수정할 사용자 정보
 * @returns {Promise<Object>} 응답 데이터
 */
export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/admin/user-info/update/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Update failed: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.warn('Response is not JSON');
                result = { message: 'User updated successfully' };
            }
        } else {
            result = { message: 'User updated successfully' };
        }

        return result;
    } catch (error) {
        console.error('Update User API Error:', error);
        throw error;
    }
};

/**
 * 사용자 정보 중 메모만 수정 API
 * @param {number} userId - 사용자 ID
 * @param {string} memo - 메모 내용
 * @returns {Promise<Object>} 응답 데이터
 */
export const updateUserInfoMemo = async (userId, memo) => {
    try {
        const headers = getHeaders();
        
        const requestBody = {
            memo: memo || '',
        };
        
        const response = await fetch(`http://localhost:8080/webkit/admin/user-info-memo/${userId}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Update user memo failed: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                result = { message: 'User memo updated successfully' };
            }
        } else {
            result = { message: 'User memo updated successfully' };
        }

        return result;
    } catch (error) {
        console.error('Update User Info Memo API Error:', error);
        throw error;
    }
};

/**
 * 사용자 삭제 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 응답 데이터
 */
export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/admin/user-delete/${userId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Delete failed: ${response.status} - ${errorData}`);
        }

        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Delete User API Error:', error);
        throw error;
    }
};

/**
 * 사용자 메모 추가 API
 * @param {number} userId - 사용자 ID
 * @param {string} memoDetail - 메모 내용
 * @returns {Promise<Object>} 응답 데이터
 */
export const addUserMemo = async (userId, memoDetail) => {
    try {
        const headers = getHeaders();
        
        const requestBody = {
            userId: userId,
            memo_detail: memoDetail,
        };
        
        const response = await fetch('http://localhost:8080/webkit/admin/user-memo', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Add memo failed: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                result = { message: 'Memo added successfully' };
            }
        } else {
            result = { message: 'Memo added successfully' };
        }

        return result;
    } catch (error) {
        console.error('Add User Memo API Error:', error);
        throw error;
    }
};

/**
 * 사용자 메모 수정 API
 * @param {number} memoId - 메모 ID
 * @param {string} memoDetail - 메모 내용
 * @returns {Promise<Object>} 응답 데이터
 */
export const updateUserMemo = async (memoId, memoDetail) => {
    try {
        if (!memoId) {
            throw new Error('Memo ID is required');
        }
        
        const headers = getHeaders();
        
        const requestBody = {
            memo_id: memoId,
            memo_detail: memoDetail,
        };
        
        const url = `http://localhost:8080/webkit/admin/user-memo/${memoId}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(requestBody),
        }).catch((fetchError) => {
            // 네트워크 에러 처리
            console.error('Network error:', fetchError);
            throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
        });

        if (!response.ok) {
            const errorData = await response.text().catch(() => 'No error details');
            throw new Error(`Update memo failed: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                result = { message: 'Memo updated successfully' };
            }
        } else {
            result = { message: 'Memo updated successfully' };
        }

        return result;
    } catch (error) {
        console.error('Update User Memo API Error:', error);
        throw error;
    }
};

/**
 * 사용자 마지막 감정상태 조회 API
 * @param {string} userLoginId - 사용자 로그인 ID (전화번호)
 * @returns {Promise<Object>} 감정상태 데이터
 */
export const getLastEmotion = async (userLoginId) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/record/last-emotion/${userLoginId}?user_login_id=${userLoginId}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            // 404, 403 등의 경우 데이터 없음으로 처리 (403은 백엔드 인증 문제이지만 데이터 없음으로 처리)
            if (response.status === 404 || response.status === 403) {
                return null;
            }
            throw new Error(`Failed to fetch emotion: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return null;
            }
        }

        return null;
    } catch (error) {
        // 네트워크 에러 등은 조용히 처리 (null 반환)
        return null;
    }
};

/**
 * 사용자 마지막 통화 정보 조회 API
 * @param {string} userLoginId - 사용자 로그인 ID (전화번호)
 * @returns {Promise<Object>} 통화 정보 데이터
 */
export const getLastCall = async (userLoginId) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/record/last-call/${userLoginId}?user_login_id=${userLoginId}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            // 404, 403 등의 경우 데이터 없음으로 처리 (403은 백엔드 인증 문제이지만 데이터 없음으로 처리)
            if (response.status === 404 || response.status === 403) {
                return null;
            }
            throw new Error(`Failed to fetch call: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return null;
            }
        }

        return null;
    } catch (error) {
        // 네트워크 에러 등은 조용히 처리 (null 반환)
        return null;
    }
};

/**
 * 사용자 상세 정보 조회 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 사용자 상세 정보
 */
export const getUserInfo = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/webkit/admin/user-info/${userId}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch user info: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return null;
            }
        }

        return null;
    } catch (error) {
        console.error('Get User Info API Error:', error);
        return null;
    }
};

/**
 * 감정 변화 그래프 데이터 조회 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 감정 변화 데이터
 */
export const getEmotionGraph = async (userId) => {
    try {
        const headers = getHeaders();
        
        const response = await fetch(`http://localhost:8080/webkit/record/emotion-graph/${userId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Failed to fetch emotion graph: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                const data = JSON.parse(responseText);
                return Array.isArray(data) ? data : [];
            } catch (e) {
                return [];
            }
        }

        return [];
    } catch (error) {
        return [];
    }
};

/**
 * 사용자 전체 통화 기록 조회 API (call-detail의 전 단계)
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 통화 기록 배열
 */
export const getCallRecords = async (userId) => {
    try {
        const headers = getHeaders();
        const response = await fetch(`http://localhost:8080/webkit/record/user/${userId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Failed to fetch call records: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                const data = JSON.parse(responseText);
                return Array.isArray(data) ? data : [];
            } catch (e) {
                return [];
            }
        }

        return [];
    } catch (error) {
        return [];
    }
};

/**
 * AI 대화 히스토리 조회 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 대화 히스토리
 */
export const getCallDetail = async (userId) => {
    try {
        // 1️⃣ 먼저 전체 통화 기록 조회
        const callRecords = await getCallRecords(userId);
        
        if (!callRecords || callRecords.length === 0) {
            return [];
        }

        // 2️⃣ 가장 최근 통화의 ID 추출 (배열의 마지막 항목 또는 첫 항목, 백엔드 정렬에 따라)
        // 보통 최근 항목이 배열의 처음이거나 끝이므로, 대부분의 경우 마지막 항목을 선택
        const mostRecentRecord = callRecords[0] || callRecords[callRecords.length - 1];
        const callRecordId = mostRecentRecord.id || mostRecentRecord.call_id;
        
        const headers = getHeaders();
        
        // 3️⃣ 해당 ID로 상세 정보 조회
        const response = await fetch(`http://localhost:8080/webkit/record/call-detail/${callRecordId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 404) {
                return [];
            }
            throw new Error(`Failed to fetch call detail: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                const data = JSON.parse(responseText);
                return Array.isArray(data) ? data : [data];
            } catch (e) {
                return [];
            }
        }

        return [];
    } catch (error) {
        return [];
    }
};

/**
 * 사용자 메모 조회 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 메모 목록
 */
export const getUserMemos = async (userId) => {
    try {
        const headers = getHeaders();
        
        const response = await fetch(`http://localhost:8080/webkit/admin/user-memo/${userId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Failed to fetch user memos: ${response.status}`);
        }

        const responseText = await response.text();
        
        if (responseText && responseText.trim()) {
            try {
                // JSON 파싱 시도
                const data = JSON.parse(responseText);
                
                // 배열이 아닌 경우 처리
                if (Array.isArray(data)) {
                    // 순환 참조가 있는 경우를 대비해 필요한 필드만 추출
                    const cleanData = data.map(memo => ({
                        id: memo.id,
                        memoDetail: memo.memoDetail || memo.memo_detail || memo.content,
                        createdAt: memo.createdAt || memo.created_at || memo.date,
                        author: memo.author || '관리자',
                    }));
                    return cleanData;
                } else if (data && typeof data === 'object') {
                    // 단일 객체인 경우 배열로 감싸기
                    return [{
                        id: data.id,
                        memoDetail: data.memoDetail || data.memo_detail || data.content,
                        createdAt: data.createdAt || data.created_at || data.date,
                        author: data.author || '관리자',
                    }];
                } else {
                    return [];
                }
            } catch (e) {
                return [];
            }
        }

        return [];
    } catch (error) {
        console.error('Get User Memos API Error:', error);
        return [];
    }
};

/**
 * 사용자 메모 삭제 API
 * @param {number} memoId - 메모 ID
 * @returns {Promise<Object>} 응답 데이터
 */
export const deleteUserMemo = async (memoId) => {
    try {
        if (!memoId) {
            throw new Error('Memo ID is required');
        }
        
        const headers = getHeaders();
        
        const response = await fetch(`http://localhost:8080/webkit/admin/user-memo/${memoId}`, {
            method: 'DELETE',
            headers: headers,
        }).catch((fetchError) => {
            console.error('Network error:', fetchError);
            throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
        });

        if (!response.ok) {
            const errorData = await response.text().catch(() => 'No error details');
            throw new Error(`Delete memo failed: ${response.status} - ${errorData}`);
        }

        const responseText = await response.text();
        
        let result = {};

        if (responseText && responseText.trim()) {
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                result = { message: 'Memo deleted successfully' };
            }
        } else {
            result = { message: 'Memo deleted successfully' };
        }

        return result;
    } catch (error) {
        console.error('Delete User Memo API Error:', error);
        throw error;
    }
};

