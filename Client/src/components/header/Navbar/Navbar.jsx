import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // État d'authentification
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Vérifier si l'utilisateur est connecté au chargement du composant
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setIsAuthenticated(true);
                setUser(parsedUser);
                console.log("Utilisateur connecté:", parsedUser);
            } catch (error) {
                console.error(
                    "Erreur lors du parsing des données utilisateur:",
                    error
                );
                // En cas d'erreur de parsing, on nettoie les données corrompues
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    // Toggle le menu mobile
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Fermer le menu au changement de page
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Surveiller le redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <nav
            className={`w-full bg-primary-600 shadow-md sticky top-0 z-50 ${
                menuOpen ? "pb-4 md:pb-0" : ""
            }`}
        >
            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                <Logo />
                {isMobile && (
                    <MobileMenuButton
                        menuOpen={menuOpen}
                        toggleMenu={toggleMenu}
                    />
                )}

                {!isMobile && (
                    <div className="flex items-center">
                        <NavLinks />
                        <ul className="flex items-center gap-4 ml-6">
                            {isAuthenticated ? (
                                <UserMenu
                                    user={user}
                                    setIsAuthenticated={setIsAuthenticated}
                                    setUser={setUser}
                                />
                            ) : (
                                <AuthButtons />
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {isMobile && menuOpen && (
                <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex-col">
                    <NavLinks />
                    <ul className="flex flex-col gap-4 my-4 border-t pt-4">
                        {isAuthenticated ? (
                            <UserMenu
                                user={user}
                                setIsAuthenticated={setIsAuthenticated}
                                setUser={setUser}
                            />
                        ) : (
                            <AuthButtons />
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
