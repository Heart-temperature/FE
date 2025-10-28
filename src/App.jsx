import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardRefactored from './pages/DashboardRefactored';
import UserDetail from './pages/UserDetail';
import UserAdd from './pages/UserAdd';
import UserApp from './pages/UserApp';
import UserAppRefactored from './pages/UserAppRefactored';
import { ROUTES } from './routes';

export default function App() {
    return (
        <Routes>
            {/* 메인 대시보드 */}
            <Route path={ROUTES.HOME} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD_REFACTORED} element={<DashboardRefactored />} />

            {/* 사용자 관련 페이지 */}
            <Route path={ROUTES.USER_DETAIL} element={<UserDetail />} />
            <Route path={ROUTES.USER_ADD} element={<UserAdd />} />

            {/* 사용자 앱 */}
            <Route path={ROUTES.USER_APP} element={<UserApp />} />
            <Route path={ROUTES.USER_APP_REFACTORED} element={<UserAppRefactored />} />

            {/* 404 페이지 */}
            <Route path={ROUTES.NOT_FOUND} element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
    );
}
