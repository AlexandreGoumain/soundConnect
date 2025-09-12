import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { StudioFilterProvider } from "../context/StudioFilterContext.jsx";

export default function StudioLayout() {
    return (
        <ProtectedRoute roles={["studio"]}>
            <div className="main-layout">
                <header>
                    <Navbar
                        links={[
                            { to: "/studio", label: "Dashboard" },
                            { to: "/studio/studios", label: "Mes studios" },
                            {
                                to: "/studio/reservations",
                                label: "Réservations",
                            },
                        ]}
                    />
                </header>
                <main className="main-layout-content">
                    <StudioFilterProvider>
                        <Outlet />
                    </StudioFilterProvider>
                </main>
            </div>
        </ProtectedRoute>
    );
}

