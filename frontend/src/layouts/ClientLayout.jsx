import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function ClientLayout() {
    const { user } = useAuth();

    const navigationLinks = user
        ? [
              { to: "/", label: "Accueil" },
              { to: "/studios", label: "Rechercher" },
          ]
        : [
              { to: "/", label: "Accueil" },
              { to: "/studios", label: "Rechercher" },
          ];

    return (
        <div className="main-layout">
            <header>
                <Navbar links={navigationLinks} />
            </header>

            <main className="main-layout-content">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
