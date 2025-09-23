import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { useToast } from "../../../../context/ToastContext.jsx";
import { authApi } from "../../../../lib/apiClient.js";

const DEFAULT_FORM = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export function useChangePassword() {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();

    // Form state
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form handlers
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Form validation
    const validateForm = () => {
        const currentPassword = formData.currentPassword.trim();
        const newPassword = formData.newPassword.trim();
        const confirmPassword = formData.confirmPassword.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showError("Tous les champs sont obligatoires.");
            return false;
        }

        if (newPassword.length < 6) {
            showError("Le nouveau mot de passe doit faire au moins 6 caractères.");
            return false;
        }

        if (newPassword !== confirmPassword) {
            showError("La confirmation du mot de passe ne correspond pas.");
            return false;
        }

        if (currentPassword === newPassword) {
            showError("Le nouveau mot de passe doit être différent de l'ancien.");
            return false;
        }

        return true;
    };

    // Form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await authApi.put("/change-password", {
                currentPassword: formData.currentPassword.trim(),
                newPassword: formData.newPassword.trim(),
            });

            showSuccess("Mot de passe modifié avec succès.");
            setFormData(DEFAULT_FORM);
        } catch (error) {
            const message = error?.response?.data?.message || "Erreur lors de la modification du mot de passe.";
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if user is logged in
    const isUserLoggedIn = Boolean(user?.id);

    return {
        // State
        formData,
        isSubmitting,
        isUserLoggedIn,

        // Handlers
        handleChange,
        handleSubmit,
    };
}