// src/hooks/useLogin.js
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export default function useLogin() {
    const navigate = useNavigate();
    const toast = useToast();

    /**
     * 로그인 로직을 처리하는 함수
     * @param {object} credentials - 로그인 자격 증명 (userId, password)
     */
    const loginUser = ({ userId, password }) => {
        // 1. 유효성 검사
        if (!userId.trim() || !password.trim()) {
            toast({
                title: '아이디와 비밀번호를 입력해주세요',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return; // 유효성 검사 실패 시 중단
        }

        // 2. (선택) 실제 API 로그인 로직
        // 예: try {
        //   const response = await fetch('/api/login', {
        //     method: 'POST',
        //     body: JSON.stringify({ userId, password }),
        //   });
        //   if (!response.ok) throw new Error('로그인 실패');
        // } catch (error) {
        //   toast({ title: '로그인 실패', description: error.message, status: 'error', ... });
        //   return;
        // }

        // 3. 로그인 성공 처리
        toast({
            title: '로그인 성공',
            description: `${userId}님 환영합니다!`,
            status: 'success',
            duration: 1500,
            isClosable: true,
        });

        // 4. 페이지 이동
        navigate('/dashboard');
    };

    // 로그인 함수를 반환
    return { loginUser };
}
