import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../lib/apiClient.js";
import { useToast } from "../hooks/useToast.js";
import { AuthContext } from "../contexts/AuthContext.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("idle");
    const { showError, showSuccess } = useToast();

    const fetchProfile = useCallback(async () => {
        try {
            setStatus("loading");

            const res = await authApi.profile();

            setUser(res?.data?.user ?? null);
            setStatus(res?.data?.user ? "authenticated" : "unauthenticated");
        } catch {
            setUser(null);
            setStatus("unauthenticated");
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const login = useCallback(
        async (email, password) => {
            try {
                const res = await authApi.login({ email, password });

                setUser(res?.data?.user ?? null);
                setStatus(
                    res?.data?.user ? "authenticated" : "unauthenticated"
                );

                if (res?.data?.user) {
                    showSuccess("Connexion réussie !");
                }

                return res;
            } catch (error) {
                const message = "Erreur lors de la connexion";
                showError(message);
                throw error;
            }
        },
        [showError, showSuccess]
    );

    const register = useCallback(
        async (payload) => {
            try {
                const res = await authApi.register(payload);

                setUser(res?.data?.user ?? null);
                setStatus(
                    res?.data?.user ? "authenticated" : "unauthenticated"
                );

                if (res?.data?.user) {
                    showSuccess("Inscription réussie !");
                }

                return res;
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Erreur lors de l'inscription";
                showError(message);
                throw error;
            }
        },
        [showError, showSuccess]
    );

    const logout = useCallback(async () => {
        try {
            await authApi.logout();

            setUser(null);
            setStatus("unauthenticated");
            showSuccess("Déconnexion réussie");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Erreur lors de la déconnexion";
            showError(message);
        }
    }, [showError, showSuccess]);

    const value = useMemo(
        () => ({
            user,
            status,
            login,
            register,
            logout,
            refresh: fetchProfile,
        }),
        [user, status, login, register, logout, fetchProfile]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
