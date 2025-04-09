import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isActive } from "../../../utils/responsive/isActive";
import { buttonLinks, links } from "./NavbarLinks";

import "./Navbar.scss";

export default function Navbar() {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

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
        <nav className={menuOpen ? "menu-open" : ""}>
            <div className="nav-header">
                <h1 className="logo" onClick={() => navigate("/")}>
                    SoundConnect
                </h1>
                {isMobile && (
                    <button className="burger-button" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}
            </div>

            <div className={`nav-content ${menuOpen ? "active" : ""}`}>
                <ul className="nav-links">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={
                                    isActive(link.path, pathname)
                                        ? "active"
                                        : ""
                                }
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className="auth-links">
                    {buttonLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={
                                    isActive(link.path, pathname)
                                        ? "active"
                                        : ""
                                }
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
