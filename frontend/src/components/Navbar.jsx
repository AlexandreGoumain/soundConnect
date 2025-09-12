import { useState } from "react";
import { FiChevronDown, FiMenu, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar({ links }) {
    const location = useLocation();
    const { user, status, logout } = useAuth();
    const { showError } = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
        } catch (err) {
            showError(
                err?.response?.data?.message || "Erreur lors de la déconnexion"
            );
        }
    };

    const toggleDropdown = () => setIsDropdownOpen((v) => !v);
    const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isAuthenticated = status === "authenticated" && user;
    const role = user?.role_name;
    const isStudio = role === "studio";
    const isArtist = role === "artist";

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    SoundConnect
                </Link>

                <ul className="navbar-nav desktop-nav">
                    {links.map((link) => (
                        <li key={link.to} className="navbar-item">
                            <Link
                                to={link.to}
                                className={
                                    location.pathname === link.to
                                        ? "active"
                                        : ""
                                }
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="navbar-actions">
                    <div className="desktop-actions">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-ghost btn-sm login-btn"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary-light btn-sm"
                                >
                                    Inscription
                                </Link>
                            </>
                        ) : (
                            <div className="user-dropdown">
                                <button
                                    className="btn btn-ghost btn-sm user-menu-btn"
                                    onClick={toggleDropdown}
                                >
                                    <FiUser className="user-icon" />
                                    Mon compte
                                    <FiChevronDown className="dropdown-icon" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        {isStudio ? (
                                            <>
                                                <Link
                                                    to="/studio"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Dashboard studio
                                                </Link>
                                                <Link
                                                    to="/studio/studios"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Mes studios
                                                </Link>
                                                <Link
                                                    to="/studio/reservations"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Réservations
                                                </Link>
                                                <hr className="dropdown-divider" />
                                                <Link
                                                    to="/profile"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Profil personnel
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/profile"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Profil
                                                </Link>
                                                <Link
                                                    to="/reservations"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    Mes réservations
                                                </Link>
                                            </>
                                        )}
                                        <hr className="dropdown-divider" />
                                        <button
                                            className="dropdown-item logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        className="btn btn-ghost btn-sm navbar-toggle"
                        onClick={toggleMobileMenu}
                    >
                        <FiMenu />
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <div className="mobile-menu-content">
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`mobile-menu-item ${
                                        location.pathname === link.to
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={closeMobileMenu}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <hr className="mobile-menu-divider" />

                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="mobile-menu-item"
                                        onClick={closeMobileMenu}
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="mobile-menu-item"
                                        onClick={closeMobileMenu}
                                    >
                                        Inscription
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="mobile-user-info">
                                        <FiUser className="mobile-user-icon" />{" "}
                                        Mon compte
                                    </div>
                                    {isStudio ? (
                                        <>
                                            <Link
                                                to="/studio"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Dashboard studio
                                            </Link>
                                            <Link
                                                to="/studio/studios"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Mes studios
                                            </Link>
                                            <Link
                                                to="/studio/reservations"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Réservations
                                            </Link>
                                            <hr className="mobile-menu-divider" />
                                            <Link
                                                to="/profile"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Profil
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Profil
                                            </Link>
                                            <Link
                                                to="/reservations"
                                                className="mobile-menu-item"
                                                onClick={closeMobileMenu}
                                            >
                                                Mes réservations
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        className="mobile-menu-item logout-btn"
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
