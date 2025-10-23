import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, getUserDetailRoute } from '../router/routes';

/**
 * 네비게이션 관련 커스텀 훅
 * 라우트 관리를 더 편리하게 해주는 헬퍼 함수들 제공
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 기본 네비게이션 함수들
  const goToHome = () => navigate(ROUTES.HOME);
  const goToDashboard = () => navigate(ROUTES.DASHBOARD);
  const goToDashboardRefactored = () => navigate(ROUTES.DASHBOARD_REFACTORED);
  const goToUserAdd = () => navigate(ROUTES.USER_ADD);
  const goToUserApp = () => navigate(ROUTES.USER_APP);
  const goToUserAppRefactored = () => navigate(ROUTES.USER_APP_REFACTORED);
  
  // 사용자 상세 페이지로 이동
  const goToUserDetail = (userId) => navigate(getUserDetailRoute(userId));
  
  // 뒤로가기
  const goBack = () => navigate(-1);
  
  // 특정 경로로 이동
  const goTo = (path) => navigate(path);
  
  // 현재 경로 확인
  const isCurrentPath = (path) => location.pathname === path;
  const isUserDetailPage = () => location.pathname.startsWith('/user/') && location.pathname !== '/user/add';
  const isUserAddPage = () => location.pathname === '/user/add';
  const isDashboardPage = () => location.pathname === '/' || location.pathname === '/dashboard';
  const isUserAppPage = () => location.pathname === '/app';

  return {
    // 네비게이션 함수들
    goToHome,
    goToDashboard,
    goToDashboardRefactored,
    goToUserAdd,
    goToUserDetail,
    goToUserApp,
    goToUserAppRefactored,
    goBack,
    goTo,
    
    // 현재 상태 확인 함수들
    isCurrentPath,
    isUserDetailPage,
    isUserAddPage,
    isDashboardPage,
    isUserAppPage,
    
    // 현재 위치 정보
    currentPath: location.pathname,
    location
  };
};
