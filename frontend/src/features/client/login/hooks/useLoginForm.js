import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";

export function useLoginForm() {
    const { login, status, user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
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
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await login(email, password);
        } catch (err) {
            setError(err?.response?.data?.message || "Connexion échouée");
        }
    };

    return {
        // State
        email,
        password,
        error,
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