import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function UserMenu({ user, setIsAuthenticated, setUser }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Toggle le menu déroulant utilisateur
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        setShowDropdown(false);
        navigate("/");
    };

    // Fonction pour vérifier si l'utilisateur a un rôle spécifique
    const hasRole = (roleName) => {
        if (!user || !user.roles) return false;

        return user.roles.some((role) =>
            typeof role === "object"
                ? role.name === roleName
                : role === roleName
        );
    };

    // Fonction pour obtenir le nom d'affichage de l'utilisateur
    const getUserDisplayName = () => {
        if (!user) return "Utilisateur";

        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }

        return user.username || user.email || "Utilisateur";
    };

    // Fermer le dropdown au clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest(".user-menu")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <li className="relative user-menu">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 text-white hover:text-gray-200 py-2 md:py-0 w-full md:w-auto"
            >
                <FaUser className="text-white" />
                <span>{getUserDisplayName()}</span>
            </button>

            {showDropdown && (
                <div className="mt-2 md:absolute right-0 bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-48 flex flex-col">
                    <Link
                        to="/profile"
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                        Mon profil
                    </Link>
                    <Link
                        to="/bookings"
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                        Mes réservations
                    </Link>
                    {hasRole("Studio") && (
                        <Link
                            to="/manage-studios"
                            className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                            Gérer mes studios
                        </Link>
                    )}
                    {hasRole("Admin") && (
                        <Link
                            to="/admin"
                            className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                            Administration
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left hover:bg-error-light text-error-dark"
                    >
                        Déconnexion
                    </button>
                </div>
            )}
        </li>
    );
}
