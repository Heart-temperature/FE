import { useState } from 'react';

/**
 * 터치 스와이프 제스처 훅
 * @param {Function} onSwipeLeft - 왼쪽 스와이프 콜백
 * @param {Function} onSwipeRight - 오른쪽 스와이프 콜백
 * @param {number} minSwipeDistance - 최소 스와이프 거리 (기본값: 50)
 * @returns {Object} 터치 이벤트 핸들러들
 */
export const useTouchSwipe = (onSwipeLeft, onSwipeRight, minSwipeDistance = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};

