import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
    const { status, user } = useAuth();
    const location = useLocation();

    if (status === "idle" || status === "loading") {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (Array.isArray(roles) && roles.length > 0) {
        const allowed = roles.includes(user.role_name);
        if (!allowed) return <Navigate to="/" replace />;
    }

    return children ?? <Outlet />;
}
