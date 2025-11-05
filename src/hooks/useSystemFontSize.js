import { useState, useEffect } from 'react';

/**
 * 사용자의 시스템 폰트 사이즈를 감지하고 웹앱에 반영하는 훅
 * 접근성 설정에서 폰트 크기를 키운 경우에도 웹앱이 반응하도록 함
 */
export const useSystemFontSize = () => {
  const [fontScale, setFontScale] = useState(1);
  const [baseFontSize, setBaseFontSize] = useState(16);

  useEffect(() => {
    const detectSystemFontSize = () => {
      // 루트 요소의 실제 폰트 사이즈 측정
      const htmlElement = document.documentElement;
      const rootFontSize = parseFloat(
        window.getComputedStyle(htmlElement).fontSize
      ) || 16;

      // 또는 임시 요소로 1rem의 실제 크기 측정 (더 정확)
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontSize = '1rem';
      testElement.style.height = '1em';
      testElement.style.width = '1px';
      document.body.appendChild(testElement);

      const remSize = parseFloat(window.getComputedStyle(testElement).fontSize) || 16;
      document.body.removeChild(testElement);

      // 스케일 계산 (1rem의 실제 크기 / 기본 16px)
      const scale = remSize / 16;
      
      setFontScale(scale);
      setBaseFontSize(remSize);

      // CSS 변수로 전역 설정
      document.documentElement.style.setProperty('--system-font-scale', scale);
      document.documentElement.style.setProperty('--system-base-font-size', `${remSize}px`);
    };

    // 초기 실행 (약간의 지연을 주어 렌더링 완료 후 측정)
    const initTimer = setTimeout(detectSystemFontSize, 100);

    // 주기적으로 확인 (사용자가 설정 변경 시 반영)
    const interval = setInterval(detectSystemFontSize, 1000);

    // ResizeObserver로 뷰포트 변경 감지
    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        detectSystemFontSize();
      });
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      document.documentElement.style.removeProperty('--system-font-scale');
      document.documentElement.style.removeProperty('--system-base-font-size');
    };
  }, []);

  return {
    fontScale,
    baseFontSize,
    // 편의 함수: 기본 크기에 스케일 적용
    scaledSize: (size) => size * fontScale,
    // rem 단위로 변환
    toRem: (px) => px / baseFontSize,
    // rem에서 px로 변환 (스케일 적용)
    remToPx: (rem) => rem * baseFontSize,
  };
};
