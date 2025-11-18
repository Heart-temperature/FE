// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("userToken");

    if (!token) {
        return <Navigate to="/app/login" replace />;
    }

    return children;
}
