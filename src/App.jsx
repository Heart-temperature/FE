import { ROUTE_META, ROUTES } from './routes';
import { Outlet, useMatches } from 'react-router-dom';
import { useEffect } from 'react';
import { connectAiSocket } from './api/aiSocket';

export default function App() {
    const matches = useMatches();
    const match = matches.findLast((m) => m.handle);
    const routeMeta = match?.handle || ROUTE_META[ROUTES.NOT_FOUND];

    // 앱 시작 시 AI WebSocket 연결
    useEffect(() => {
        connectAiSocket()
            .then(() => console.log('🚀 앱 시작 - AI WebSocket 연결됨'))
            .catch((err) => console.error('⚠️ AI WebSocket 초기 연결 실패:', err));
    }, []);

    return (
        <>
            <title>{routeMeta.title}</title>
            <meta name="description" content={routeMeta.description} />

            <main className="app-container">
                <Outlet />
            </main>
        </>
    );
}
