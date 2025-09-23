import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { apiClient } from "../../../../lib/apiClient.js";

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
    };

    const handleAccountTypeSelect = (role) => {
        const display = ROLE_DISPLAY[role.name] || { label: role.name };
        setAccountType({ id: role.id, name: role.name, label: display.label });
        setStep(2);
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setError(null);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Form validation
    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }

        return true;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

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
            setError(err?.response?.data?.message || "Inscription échouée");
        }
    };

    return {
        // State
        step,
        accountType,
        roles,
        formData,
        error,
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