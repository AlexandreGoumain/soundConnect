import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    validateCity,
    validatePostalCode,
} from "../../../../lib/validation.js";

export function useHeroSection() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (error) setError(""); // Clear error when user types
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();

        if (!trimmed) {
            setError("Veuillez saisir une ville ou un code postal");
            return;
        }

        // Check if it looks like a postal code (starts with digits)
        const isPostal = /^\d/.test(trimmed);

        let validationError = null;
        if (isPostal) {
            validationError = validatePostalCode(trimmed);
        } else {
            validationError = validateCity(trimmed);
        }

        if (validationError) {
            setError(validationError);
            return;
        }

        const qs = new URLSearchParams(
            isPostal ? { postal_code: trimmed } : { city: trimmed }
        );
        navigate(`/studios?${qs.toString()}`);
    };

    return {
        query,
        error,
        handleChange,
        handleSubmit,
    };
}