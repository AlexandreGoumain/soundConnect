import { Link } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute roles={["admin"]}>
            <div>
                <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <nav style={{ display: "flex", gap: 12 }}>
                        <Link to="/admin">Admin Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                    </nav>
                </header>
                <main style={{ padding: 16 }}>{children}</main>
            </div>
        </ProtectedRoute>
    );
}
