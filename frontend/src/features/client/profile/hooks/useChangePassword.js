import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth.js";
import { useToast } from "../../../../hooks/useToast.js";
import { authApi } from "../../../../lib/apiClient.js";
import {
    validateConfirmPassword,
    validatePassword,
} from "../../../../lib/validation.js";

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
    const [fieldErrors, setFieldErrors] = useState({});

    // Password visibility state
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form handlers
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Effacer l'erreur du champ quand l'utilisateur tape
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        // Validation mot de passe actuel
        if (!formData.currentPassword?.trim()) {
            errors.currentPassword = "Le mot de passe actuel est requis";
        }

        // Validation nouveau mot de passe
        const newPasswordError = validatePassword(formData.newPassword);
        if (newPasswordError) errors.newPassword = newPasswordError;

        // Validation confirmation mot de passe
        const confirmPasswordError = validateConfirmPassword(
            formData.newPassword,
            formData.confirmPassword
        );
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

        // Vérification que les mots de passe sont différents
        if (
            formData.currentPassword &&
            formData.newPassword &&
            formData.currentPassword === formData.newPassword
        ) {
            errors.newPassword =
                "Le nouveau mot de passe doit être différent de l'ancien";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await authApi.put("/change-password", {
                currentPassword: formData.currentPassword.trim(),
                newPassword: formData.newPassword.trim(),
            });

            showSuccess("Mot de passe modifié avec succès.");
            setFormData(DEFAULT_FORM);
        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors && Array.isArray(validationErrors)) {
                const errors = {};
                validationErrors.forEach((error) => {
                    errors[error.field] = error.message;
                });
                setFieldErrors(errors);
            } else {
                const message =
                    error?.response?.data?.message ||
                    "Erreur lors de la modification du mot de passe.";
                showError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Password visibility handlers
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Check if user is logged in
    const isUserLoggedIn = Boolean(user?.id);

    return {
        // State
        formData,
        fieldErrors,
        isSubmitting,
        isUserLoggedIn,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,

        // Handlers
        handleChange,
        handleSubmit,
        toggleCurrentPasswordVisibility,
        toggleNewPasswordVisibility,
        toggleConfirmPasswordVisibility,
    };
}
