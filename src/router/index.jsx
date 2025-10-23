import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import DashboardRefactored from '../pages/DashboardRefactored';
import UserDetail from '../pages/UserDetail';
import UserApp from '../pages/UserApp';
import UserAppRefactored from '../pages/UserAppRefactored';
import UserAdd from '../pages/UserAdd';

/**
 * 애플리케이션 라우터 설정
 * 기존 버전과 리팩토링된 버전을 모두 지원
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* 메인 대시보드 */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard-refactored" element={<DashboardRefactored />} />
      
      {/* 사용자 관련 페이지 */}
      <Route path="/user/:id" element={<UserDetail />} />
      <Route path="/user/add" element={<UserAdd />} />
      
      {/* 사용자 앱 */}
      <Route path="/app" element={<UserApp />} />
      <Route path="/app-refactored" element={<UserAppRefactored />} />
      
      {/* 404 페이지 (향후 추가) */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
  );
};
