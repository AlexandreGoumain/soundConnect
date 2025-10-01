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
              ...(user.role === "artist"
                  ? [{ to: "/reservations", label: "Mes réservations" }]
                  : []),
          ]
        : [
              { to: "/", label: "Accueil" },
              { to: "/studios", label: "Rechercher" },
          ];

    return (
        <div className="main-layout">
            <a href="#main-content" className="skip-link">
                Aller au contenu principal
            </a>
            <a href="#main-navigation" className="skip-link">
                Aller à la navigation
            </a>

            <header id="main-navigation">
                <Navbar links={navigationLinks} />
            </header>

            <main
                id="main-content"
                className="main-layout-content"
                tabIndex={-1}
            >
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
