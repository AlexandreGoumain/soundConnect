import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth.js";
import { apiClient } from "../../../../lib/apiClient.js";
import {
    validateCity,
    validateConfirmPassword,
    validateEmail,
    validateHumanName,
    validatePassword,
    validatePhone,
    validatePostalCode,
    validateUsername,
} from "../../../../lib/validation.js";

// Map backend role names to UI labels/icons
export const ROLE_DISPLAY = {
    artist: { label: "Artiste" },
    studio: { label: "Studio" },
};

export function useRegisterForm() {
    const { register, status, user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState(null);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        postal_code: "",
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch roles on component mount
    useEffect(() => {
        let mounted = true;
        async function fetchRoles() {
            try {
                const res = await apiClient.get("/roles");
                const fetched = res?.data?.data?.roles || [];
                if (!mounted) return;
                setRoles(fetched);
            } catch {
                if (!mounted) return;
                // Could add error handling here if needed
            }
        }
        fetchRoles();
        return () => {
            mounted = false;
        };
    }, []);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Effacer l'erreur du champ quand l'utilisateur commence à taper
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAccountTypeSelect = (role) => {
        const display = ROLE_DISPLAY[role.name] || { label: role.name };
        setAccountType({ id: role.id, name: role.name, label: display.label });
        setStep(2);
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setError(null);
        setFieldErrors({});
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        // Utilisation des utilitaires de validation
        const firstNameError = validateHumanName(formData.first_name, "prénom");
        if (firstNameError) errors.first_name = firstNameError;

        const lastNameError = validateHumanName(formData.last_name, "nom");
        if (lastNameError) errors.last_name = lastNameError;

        const usernameError = validateUsername(formData.username);
        if (usernameError) errors.username = usernameError;

        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) errors.phone = phoneError;

        const cityError = validateCity(formData.city);
        if (cityError) errors.city = cityError;

        const postalCodeError = validatePostalCode(formData.postal_code);
        if (postalCodeError) errors.postal_code = postalCodeError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;

        const confirmPasswordError = validateConfirmPassword(
            formData.password,
            formData.confirmPassword
        );
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

        setFieldErrors(errors);
        const isValid = Object.keys(errors).length === 0;

        return isValid;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation frontend - si elle échoue, on arrête tout
        if (!validateForm()) {
            return;
        }

        // Si on arrive ici, la validation frontend a réussi
        setFieldErrors({});

        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role_id: accountType.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                city: formData.city,
                postal_code: formData.postal_code,
            };

            await register(payload);
            navigate("/");
        } catch (err) {
            const errorMessage = err?.response?.data?.message;
            const validationErrors = err?.response?.data?.errors;

            if (validationErrors && Array.isArray(validationErrors)) {
                // Transformer le tableau d'erreurs en objet fieldErrors
                const errors = {};
                validationErrors.forEach((error) => {
                    errors[error.field] = error.message;
                });
                setFieldErrors(errors);
            } else {
                // Sinon, afficher l'erreur générale
                setError(errorMessage || "Inscription échouée");
            }
        }
    };

    return {
        // State
        step,
        accountType,
        roles,
        formData,
        error,
        fieldErrors,
        showPassword,
        showConfirmPassword,
        status,
        user,

        // Handlers
        handleInputChange,
        handleAccountTypeSelect,
        handleBackToStep1,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
    };
}
