// 라우트 경로 상수 정의
export const ROUTES = {
  // 메인 페이지
  HOME: '/',
  DASHBOARD: '/dashboard',
  DASHBOARD_REFACTORED: '/dashboard-refactored',
  
  // 사용자 관련
  USER_DETAIL: '/user/:id',
  USER_ADD: '/user/add',
  
  // 사용자 앱
  USER_APP: '/app',
  USER_APP_REFACTORED: '/app-refactored',
  
  // 404
  NOT_FOUND: '*'
};

// 라우트 헬퍼 함수들
export const getRoute = (routeName, params = {}) => {
  const route = ROUTES[routeName];
  if (!route) return '/';
  
  // 동적 라우트 파라미터 치환
  return Object.keys(params).reduce((path, key) => {
    return path.replace(`:${key}`, params[key]);
  }, route);
};

// 사용자 상세 페이지 경로 생성
export const getUserDetailRoute = (userId) => getRoute('USER_DETAIL', { id: userId });

// 라우트별 메타데이터
export const ROUTE_META = {
  [ROUTES.HOME]: {
    title: '독거노인 관리 시스템',
    description: '메인 대시보드'
  },
  [ROUTES.DASHBOARD]: {
    title: '독거노인 관리 시스템',
    description: '관리자 대시보드'
  },
  [ROUTES.DASHBOARD_REFACTORED]: {
    title: '독거노인 관리 시스템 (리팩토링)',
    description: '리팩토링된 관리자 대시보드'
  },
  [ROUTES.USER_ADD]: {
    title: '사용자 추가',
    description: '새 사용자 등록'
  },
  [ROUTES.USER_APP]: {
    title: 'AI 상담사',
    description: '사용자 앱'
  },
  [ROUTES.USER_APP_REFACTORED]: {
    title: 'AI 상담사 (리팩토링)',
    description: '리팩토링된 사용자 앱'
  }
};
