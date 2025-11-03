import { ROUTE_META, ROUTES } from './routes';
import { Outlet, useMatches } from 'react-router-dom';

export default function App() {
    const matches = useMatches();
    const match = matches.findLast((m) => m.handle);
    const routeMeta = match?.handle || ROUTE_META[ROUTES.NOT_FOUND];

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
