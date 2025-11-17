// src/hooks/usePersistentSettings.jsx
import { useState, useEffect } from 'react';

function usePersistentSettings() {
    // ✅ 로컬스토리지에서 초기값 불러오기
    const [fontSizeLevel, setFontSizeLevel] = useState(() => {
        const saved = localStorage.getItem('fontSizeLevel');
        return saved ? parseInt(saved) : 1;
    });

    const [isHighContrast, setIsHighContrast] = useState(() => {
        return localStorage.getItem('isHighContrast') === 'true';
    });

    // ✅ 변경 시 로컬스토리지에 저장
    useEffect(() => {
        localStorage.setItem('fontSizeLevel', fontSizeLevel);
    }, [fontSizeLevel]);

    useEffect(() => {
        localStorage.setItem('isHighContrast', isHighContrast);
    }, [isHighContrast]);

    // ✅ 크기 관련 공통 값 정의
    const fontSizeLevels = ['작게', '보통', '크게'];
    const fontSizes = ['1.5rem', '1.9rem', '2.5rem'];
    const buttonHeights = ['50px', '55px', '65px'];
    const inputHeights = ['70px', '85px', '110px'];
    const callButtonHeights = ['70px', '85px', '110px'];
    const arrowButtonSizes = ['30px', '40px', '50px'];
    const arrowIconSizes = [6, 8, 10];
    const aiImageSizes = ['160px', '200px', '240px'];
    const imageCircleSizes = ['130', '150', '170'];

    // ✅ 계산된 값
    const fs = fontSizes[fontSizeLevel];
    const btnH = buttonHeights[fontSizeLevel];
    const inputH = inputHeights[fontSizeLevel];
    const callBtnH = callButtonHeights[fontSizeLevel];
    const arrowBtnSize = arrowButtonSizes[fontSizeLevel];
    const arrowIconSize = arrowIconSizes[fontSizeLevel];
    const aiImgSize = aiImageSizes[fontSizeLevel];
    const imgCircleHeight = imageCircleSizes[fontSizeLevel];

    // ✅ 고대비 토글 함수
    const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

    return {
        // 상태값
        fontSizeLevel,
        setFontSizeLevel,
        isHighContrast,
        setIsHighContrast,
        toggleHighContrast,
        // 크기 설정 값
        fontSizeLevels,
        fs,
        btnH,
        inputH,
        callBtnH,
        arrowBtnSize,
        arrowIconSize,
        aiImgSize,
        imgCircleHeight,
    };
}

export default usePersistentSettings;
