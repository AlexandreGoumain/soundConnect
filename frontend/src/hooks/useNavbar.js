import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthRole } from "./useAuthRole.js";
import { useToast } from "./useToast.js";

export function useNavbar() {
    const location = useLocation();
    const { isAuthenticated, isStudio, logout } = useAuthRole();
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

    const closeDropdown = () => setIsDropdownOpen(false);

    return {
        // Navigation state
        location,
        isAuthenticated,
        isStudio,

        // UI state
        isDropdownOpen,
        isMobileMenuOpen,

        // Handlers
        handleLogout,
        toggleDropdown,
        toggleMobileMenu,
        closeMobileMenu,
        closeDropdown,
    };
}