// 사용자 관련 상수
export const USER_STATUS = {
  URGENT: 'urgent',
  CAUTION: 'caution',
  NORMAL: 'normal'
};

export const USER_GENDER = {
  MALE: '남성',
  FEMALE: '여성'
};

export const EMOTION_COLORS = {
  [USER_STATUS.URGENT]: '#D93025',
  [USER_STATUS.CAUTION]: '#F9AB00',
  [USER_STATUS.NORMAL]: '#1B9A59'
};

export const EMOTION_TEXTS = {
  [USER_STATUS.URGENT]: '긴급',
  [USER_STATUS.CAUTION]: '주의',
  [USER_STATUS.NORMAL]: '정상'
};

// 캐릭터 관련 상수
export const CHARACTERS = [
  { id: 'robot', name: '로봇 상담사', emoji: '🤖', color: 'blue' },
  { id: 'human', name: '사람 상담사', emoji: '👨‍⚕️', color: 'green' }
];

// 앱 상태 상수
export const APP_STATES = {
  INTRO: 'intro',
  HOME: 'home',
  CONNECTING: 'connecting',
  CALLING: 'calling',
  ENDED: 'ended'
};

// 테이블 관련 상수
export const TABLE_CONFIG = {
  DEFAULT_ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 20, 50]
};

// 애니메이션 상수
export const ANIMATION_CONFIG = {
  SPRING: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.6
  },
  EASE_IN_OUT: {
    duration: 0.4,
    ease: "easeInOut"
  },
  QUICK: {
    duration: 0.3,
    ease: "easeInOut"
  }
};

