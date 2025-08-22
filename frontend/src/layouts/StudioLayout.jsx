import Navbar from "../components/Navbar.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function StudioLayout({ children }) {
    return (
        <ProtectedRoute roles={["studio", "admin"]}>
            <div>
                <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <Navbar links={[{ to: "/studios", label: "Studios" }]} />
                </header>
                <main style={{ padding: 16 }}>{children}</main>
            </div>
        </ProtectedRoute>
    );
}
