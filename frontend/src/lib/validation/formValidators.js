import {
    validateCity,
    validateConfirmPassword,
    validateEmail,
    validateHumanName,
    validatePassword,
    validatePhone,
    validatePostalCode,
    validateUsername,
} from "../validation.js";

/**
 * Validation pour le formulaire d'inscription
 */
export const validateRegistrationForm = (formData) => {
    const errors = {};

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

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

/**
 * Validation pour le formulaire de profil
 */
export const validateProfileForm = (dataToValidate) => {
    const errors = {};

    const firstNameError = validateHumanName(
        dataToValidate.first_name,
        "prénom"
    );
    if (firstNameError) errors.first_name = firstNameError;

    const lastNameError = validateHumanName(
        dataToValidate.last_name,
        "nom"
    );
    if (lastNameError) errors.last_name = lastNameError;

    const usernameError = validateUsername(dataToValidate.username);
    if (usernameError) errors.username = usernameError;

    const emailError = validateEmail(dataToValidate.email);
    if (emailError) errors.email = emailError;

    // Champs optionnels - seulement valider s'ils ne sont pas vides
    if (dataToValidate.phone && dataToValidate.phone.trim()) {
        const phoneError = validatePhone(dataToValidate.phone);
        if (phoneError) errors.phone = phoneError;
    }

    if (dataToValidate.city && dataToValidate.city.trim()) {
        const cityError = validateCity(dataToValidate.city);
        if (cityError) errors.city = cityError;
    }

    if (dataToValidate.postal_code && dataToValidate.postal_code.trim()) {
        const postalCodeError = validatePostalCode(dataToValidate.postal_code);
        if (postalCodeError) errors.postal_code = postalCodeError;
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

/**
 * Validation pour les filtres de recherche de studios
 */
export const validateSearchFilters = (filters) => {
    const errors = {};

    // Validation de la ville (optionnelle)
    if (filters.city && filters.city.trim()) {
        const cityError = validateCity(filters.city);
        if (cityError) errors.city = cityError;
    }

    // Validation du code postal (optionnel)
    if (filters.postalCode && filters.postalCode.trim()) {
        const postalCodeError = validatePostalCode(filters.postalCode);
        if (postalCodeError) errors.postalCode = postalCodeError;
    }

    // Validation des tarifs
    if (filters.minRate && filters.minRate.trim()) {
        const minRate = Number(filters.minRate);
        if (isNaN(minRate) || minRate < 0) {
            errors.minRate = "Le tarif minimum doit être un nombre positif";
        } else if (minRate > 999.99) {
            errors.minRate = "Le tarif minimum ne peut pas dépasser 999,99 EUR";
        }
    }

    if (filters.maxRate && filters.maxRate.trim()) {
        const maxRate = Number(filters.maxRate);
        if (isNaN(maxRate) || maxRate < 0) {
            errors.maxRate = "Le tarif maximum doit être un nombre positif";
        } else if (maxRate > 999.99) {
            errors.maxRate = "Le tarif maximum ne peut pas dépasser 999,99 EUR";
        }
    }

    // Validation des tarifs min/max
    if (filters.minRate && filters.maxRate) {
        const minRate = Number(filters.minRate);
        const maxRate = Number(filters.maxRate);
        if (!isNaN(minRate) && !isNaN(maxRate) && minRate > maxRate) {
            errors.maxRate = "Le tarif maximum doit être supérieur au tarif minimum";
        }
    }

    // Validation de la durée
    if (filters.duration) {
        const duration = Number(filters.duration);
        if (isNaN(duration) || duration < 1 || duration > 12) {
            errors.duration = "La durée doit être entre 1 et 12 heures";
        }
    }

    // Validation de la date de disponibilité (optionnelle)
    if (filters.availableOn && filters.availableOn.trim()) {
        const selectedDate = new Date(filters.availableOn);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            errors.availableOn = "La date de disponibilité ne peut pas être dans le passé";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

/**
 * Validation pour les avis (reviews)
 */
export const validateReview = (reviewData) => {
    const errors = {};

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        errors.rating = "Veuillez sélectionner une note entre 1 et 5";
    }

    if (!reviewData.reservation_id) {
        errors.reservation_id = "Veuillez sélectionner une réservation";
    }

    if (reviewData.comment) {
        if (reviewData.comment.length > 1000) {
            errors.comment = "Le commentaire ne peut pas dépasser 1000 caractères";
        } else if (reviewData.comment.length < 10) {
            errors.comment = "Le commentaire doit contenir au moins 10 caractères";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};