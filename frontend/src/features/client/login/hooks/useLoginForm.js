import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth.js";
import { validateEmail, validatePassword } from "../../../../lib/validation.js";

export function useLoginForm() {
    const { login, status, user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    // Form handlers
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Effacer l'erreur du champ email
        if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Effacer l'erreur du champ password
        if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: null }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        const emailError = validateEmail(email);
        if (emailError) errors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) errors.password = passwordError;

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation frontend
        if (!validateForm()) {
            return;
        }

        setFieldErrors({});

        try {
            await login(email, password);
        } catch (err) {
            const errorMessage = err?.response?.data?.message;
            const validationErrors = err?.response?.data?.errors;

            if (validationErrors && Array.isArray(validationErrors)) {
                const errors = {};
                validationErrors.forEach((error) => {
                    errors[error.field] = error.message;
                });
                setFieldErrors(errors);
            } else {
                setError(errorMessage || "Connexion échouée");
            }
        }
    };

    return {
        // State
        email,
        password,
        error,
        fieldErrors,
        showPassword,
        status,
        user,

        // Handlers
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
        togglePasswordVisibility,
    };
}
