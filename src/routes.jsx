import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/web/DashboardPage';
import UserAddPage from './pages/web/UserAddPage';
import UserDetailPage from './pages/web/UserDetailPage';
import UserEditPage from './pages/web/UserEditPage';
import AdminLoginPage from './pages/web/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';
import UserLoginPage from './pages/app/UserLoginPage';
import MainPage from './pages/app/MainPage';
import CallPage from './pages/app/CallPage';

// 라우트 경로 상수 정의
export const ROUTES = {
    // 관리자 페이지
    ADMIN_LOGIN: '/admin/login',
    HOME: '/',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',

    // 사용자 관련
    USER_DETAIL: '/user/:id',
    USER_EDIT: '/user/:id/edit',
    USER_ADD: '/user/add',

    // 사용자 앱
    USER_APP: '/app',
    USER_APP_LOGIN: '/app/login',
    USER_APP_HOME: '/app/home',
    USER_APP_CALL: '/app/call',

    // 404
    NOT_FOUND: '*',
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
    [ROUTES.ADMIN_LOGIN]: {
        title: '관리자 로그인 - 다정이',
        description: '관리자 로그인',
    },
    [ROUTES.HOME]: {
        title: '다정이',
        description: '관리자 대시보드',
    },
    [ROUTES.DASHBOARD]: {
        title: '다정이',
        description: '관리자 대시보드',
    },
    [ROUTES.LOGIN]: {
        title: '로그인 - 다정이',
        description: '사용자 로그인',
    },
    [ROUTES.FIRST_LOGIN]: {
        title: '초기 비밀번호 변경 - 다정이',
        description: '최초 로그인 시 비밀번호 변경',
    },
    [ROUTES.USER_ADD]: {
        title: '사용자 추가 - 다정이',
        description: '새 사용자 등록',
    },
    [ROUTES.USER_DETAIL]: {
        title: '사용자 상세 - 다정이',
        description: '사용자 상세 정보',
    },
    [ROUTES.USER_APP]: {
        title: '다정이',
        description: '사용자 앱',
    },
    [ROUTES.USER_APP_LOGIN]: {
        title: '로그인 - 다정이',
        description: '사용자 앱 로그인',
    },
    [ROUTES.USER_APP_HOME]: {
        title: '다정이',
        description: '사용자 앱 홈 화면',
    },
    [ROUTES.USER_APP_CALL]: {
        title: '통화 중 - 다정이',
        description: 'AI 상담 통화 화면',
    },
    [ROUTES.NOT_FOUND]: {
        title: '페이지를 찾을 수 없습니다',
        description: '404 페이지',
    },
};

export const router = createBrowserRouter([
    {
        // 관리자 로그인 (App.jsx 외부)
        path: ROUTES.ADMIN_LOGIN,
        element: <AdminLoginPage />,
        handle: ROUTE_META[ROUTES.ADMIN_LOGIN],
    },
    {
        // App.jsx (공통 레이아웃)
        element: <App />,

        // App.jsx의 <Outlet>을 통해 렌더링될 자식 페이지들
        children: [
            {
                path: ROUTES.HOME,
                element: <DashboardPage />,
                handle: ROUTE_META[ROUTES.HOME],
            },
            {
                path: ROUTES.DASHBOARD,
                element: <DashboardPage />,
                handle: ROUTE_META[ROUTES.DASHBOARD],
            },
            {
                path: ROUTES.LOGIN,
                element: <UserLoginPage />,
                handle: ROUTE_META[ROUTES.LOGIN],
            },
            {
                path: ROUTES.USER_ADD,
                element: <UserAddPage />,
                handle: ROUTE_META[ROUTES.USER_ADD],
            },
            {
                path: ROUTES.USER_DETAIL,
                element: <UserDetailPage />,
                handle: ROUTE_META[ROUTES.USER_DETAIL],
            },
            {
                path: ROUTES.USER_EDIT,
                element: <UserEditPage />,
                handle: {
                    title: '사용자 정보 수정 - 다정이',
                    description: '사용자 정보 수정',
                },
            },
            {
                path: ROUTES.USER_APP,
                element: <Navigate to={ROUTES.USER_APP_HOME} replace />,
                handle: ROUTE_META[ROUTES.USER_APP],
            },
            {
                path: ROUTES.USER_APP_LOGIN,
                element: <UserLoginPage />,
                handle: ROUTE_META[ROUTES.USER_APP_LOGIN],
            },
            {
                path: ROUTES.USER_APP_HOME,
                element: <MainPage />,
                handle: ROUTE_META[ROUTES.USER_APP_HOME],
            },
            {
                path: ROUTES.USER_APP_CALL,
                element: <CallPage />,
                handle: ROUTE_META[ROUTES.USER_APP_CALL],
            },
            {
                // 404 Not Found (일치하는 경로가 없을 때)
                path: ROUTES.NOT_FOUND,
                element: <NotFoundPage />,
                handle: ROUTE_META[ROUTES.NOT_FOUND],
            },
        ],
    },
]);
