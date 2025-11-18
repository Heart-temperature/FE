import { ROUTE_META, ROUTES } from './routes';
import { Outlet, useMatches } from 'react-router-dom';

export default function App() {
    const matches = useMatches();
    const match = matches.findLast((m) => m.handle);
    const routeMeta = match?.handle || ROUTE_META[ROUTES.NOT_FOUND];

    // WebSocket 연결은 통화 시작 시에만 수행 (startCall에서 처리)

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
