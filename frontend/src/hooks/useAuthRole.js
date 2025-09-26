import { useAuth } from "./useAuth.js";

/**
 * Hook pour gérer l'authentification et les rôles de manière centralisée
 */
export function useAuthRole() {
    const { user, status, logout } = useAuth();

    // État d'authentification
    const isAuthenticated = status === "authenticated" && user;

    // Informations de rôle
    const role = user?.role_name;
    const isStudio = role === "studio";
    const isArtist = role === "artist";

    // Fonctions utilitaires
    const hasRole = (requiredRole) => role === requiredRole;
    const hasAnyRole = (roles) => roles.includes(role);

    return {
        // État utilisateur
        user,
        status,
        isAuthenticated,

        // Rôles
        role,
        isStudio,
        isArtist,

        // Fonctions utilitaires
        hasRole,
        hasAnyRole,
        logout,
    };
}