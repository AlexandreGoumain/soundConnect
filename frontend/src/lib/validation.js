// Utilitaires de validation partagés
// Ces règles correspondent aux validations backend

// Regex utilitaires
const HUMAN_NAME_PATTERN = /^[a-zA-Z\u00C0-\u017F\s\-']+$/; // Lettres, accents, espaces, tirets, apostrophes uniquement
const PLACE_NAME_PATTERN = /^[a-zA-Z\u00C0-\u017F\s\-'.]+$/; // Lettres, accents, espaces, tirets, apostrophes, points pour les villes
const STREET_NAME_PATTERN = /^[a-zA-Z0-9\u00C0-\u017F\s\-'.,()]+$/; // Lettres, chiffres, accents, espaces, tirets, apostrophes, points, virgules, parenthèses pour les rues

// Fonction utilitaire pour valider les noms de personnes (prénom, nom)
export const validateHumanName = (name, fieldName = "nom") => {
    if (!name?.trim()) {
        return `Le ${fieldName} est requis`;
    }
    if (name.trim().length < 2) {
        return `Le ${fieldName} doit contenir au moins 2 caractères`;
    }
    if (name.trim().length > 50) {
        return `Le ${fieldName} ne peut pas dépasser 50 caractères`;
    }
    if (!HUMAN_NAME_PATTERN.test(name.trim())) {
        return `Le ${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes`;
    }
    return null;
};

// Fonction utilitaire pour valider les noms de lieux (ville, etc.)
export const validatePlaceName = (
    name,
    fieldName = "lieu",
    maxLength = 100
) => {
    if (!name?.trim()) {
        return `La ${fieldName} est requise`;
    }
    if (name.trim().length < 2) {
        return `La ${fieldName} doit contenir au moins 2 caractères`;
    }
    if (name.trim().length > maxLength) {
        return `La ${fieldName} ne peut pas dépasser ${maxLength} caractères`;
    }
    if (!PLACE_NAME_PATTERN.test(name.trim())) {
        return `La ${fieldName} ne peut contenir que des lettres, espaces, tirets, apostrophes et points`;
    }
    return null;
};

// Fonction utilitaire pour valider les noms de rues
export const validateStreetName = (
    name,
    fieldName = "rue",
    maxLength = 255
) => {
    if (!name?.trim()) {
        return `La ${fieldName} est requise`;
    }
    if (name.trim().length < 2) {
        return `La ${fieldName} doit contenir au moins 2 caractères`;
    }
    if (name.trim().length > maxLength) {
        return `La ${fieldName} ne peut pas dépasser ${maxLength} caractères`;
    }
    if (!STREET_NAME_PATTERN.test(name.trim())) {
        return `La ${fieldName} ne peut contenir que des lettres, chiffres, espaces, tirets, apostrophes, points, virgules et parenthèses`;
    }
    return null;
};

export const ValidationRules = {
    email: {
        required: "L'email est requis",
        invalid: "L'email n'est pas valide",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
        required: "Le mot de passe est requis",
        minLength: "Le mot de passe doit contenir au moins 6 caractères",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        patternMessage:
            "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
    },

    username: {
        required: "Le nom d'utilisateur est requis",
        minLength: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        maxLength: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
        pattern: /^[a-zA-Z0-9\u00C0-\u017F_-]+$/,
        patternMessage:
            "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores",
    },

    firstName: {
        required: "Le prénom est requis",
        minLength: "Le prénom doit contenir au moins 2 caractères",
        maxLength: "Le prénom ne peut pas dépasser 50 caractères",
    },

    lastName: {
        required: "Le nom est requis",
        minLength: "Le nom doit contenir au moins 2 caractères",
        maxLength: "Le nom ne peut pas dépasser 50 caractères",
    },

    phone: {
        required: "Le téléphone est requis",
        maxLength: "Le numéro de téléphone ne peut pas dépasser 20 caractères",
    },

    city: {
        required: "La ville est requise",
        maxLength: "La ville ne peut pas dépasser 100 caractères",
    },

    postalCode: {
        required: "Le code postal est requis",
        maxLength: "Le code postal ne peut pas dépasser 10 caractères",
    },
};

// Fonctions de validation
export const validateEmail = (email) => {
    if (!email?.trim()) {
        return ValidationRules.email.required;
    }
    if (!ValidationRules.email.pattern.test(email)) {
        return ValidationRules.email.invalid;
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password) {
        return ValidationRules.password.required;
    }
    if (password.length < 6) {
        return ValidationRules.password.minLength;
    }
    if (!ValidationRules.password.pattern.test(password)) {
        return ValidationRules.password.patternMessage;
    }
    return null;
};

export const validateUsername = (username) => {
    if (!username?.trim()) {
        return ValidationRules.username.required;
    }
    if (username.trim().length < 3) {
        return ValidationRules.username.minLength;
    }
    if (username.trim().length > 50) {
        return ValidationRules.username.maxLength;
    }
    if (!ValidationRules.username.pattern.test(username)) {
        return ValidationRules.username.patternMessage;
    }
    return null;
};

export const validateFirstName = (firstName) => {
    return validateHumanName(firstName, "prénom");
};

export const validateLastName = (lastName) => {
    return validateHumanName(lastName, "nom");
};

export const validatePhone = (phone) => {
    if (!phone?.trim()) {
        return ValidationRules.phone.required;
    }
    if (phone.trim().length > 20) {
        return ValidationRules.phone.maxLength;
    }
    return null;
};

export const validateCity = (city) => {
    return validatePlaceName(city, "ville", 100);
};

export const validateCountry = (country) => {
    if (!country?.trim()) {
        return null; // Optionnel
    }
    return validatePlaceName(country, "pays", 100);
};

export const validatePostalCode = (postalCode) => {
    if (!postalCode?.trim()) {
        return ValidationRules.postalCode.required;
    }
    if (postalCode.trim().length > 10) {
        return ValidationRules.postalCode.maxLength;
    }
    return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return "La confirmation du mot de passe est requise";
    }
    if (password !== confirmPassword) {
        return "Les mots de passe ne correspondent pas";
    }
    return null;
};

// Validations spécifiques aux studios
export const validateStudioName = (name) => {
    if (!name?.trim()) {
        return "Le nom du studio est requis";
    }
    if (name.trim().length < 2) {
        return "Le nom doit contenir au moins 2 caractères";
    }
    if (name.trim().length > 100) {
        return "Le nom ne peut pas dépasser 100 caractères";
    }
    return null;
};

export const validateDescription = (description) => {
    if (!description?.trim()) {
        return "La description est requise";
    }
    if (description.trim().length < 10) {
        return "La description doit contenir au moins 10 caractères";
    }
    if (description.trim().length > 2000) {
        return "La description ne peut pas dépasser 2000 caractères";
    }
    return null;
};

export const validateStreetNumber = (streetNumber) => {
    if (!streetNumber?.trim()) {
        return "Le numéro de rue est requis";
    }
    if (streetNumber.trim().length > 10) {
        return "Le numéro de rue ne peut pas dépasser 10 caractères";
    }
    return null;
};

export const validateHourlyRate = (hourlyRate) => {
    if (!hourlyRate?.toString().trim()) {
        return "Le tarif horaire est requis";
    }
    const rate = Number(hourlyRate.toString().replace(",", "."));
    if (Number.isNaN(rate)) {
        return "Le tarif horaire doit être un nombre";
    }
    if (rate < 1) {
        return "Le tarif horaire doit être d'au moins 1 EUR";
    }
    if (rate > 999.99) {
        return "Le tarif horaire ne peut pas dépasser 999,99 EUR";
    }
    return null;
};

export const validateWebsite = (website) => {
    if (!website?.trim()) {
        return null; // Optionnel
    }
    const candidate = website.includes("://") ? website : `https://${website}`;
    try {
        new URL(candidate);
        return null;
    } catch {
        return "L'URL du site web n'est pas valide (ajoutez par exemple https://)";
    }
};

// Validation d'images
export const ACCEPTED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo pour les images de studio
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 Mo pour les avatars

export const validateImageFile = (
    file,
    maxSize = MAX_IMAGE_SIZE,
    context = "image"
) => {
    if (!file) {
        return "Aucun fichier sélectionné";
    }

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        return "Format de fichier non supporté. Utilisez JPG, PNG, WEBP ou GIF";
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));

        return `L'${context} doit faire moins de ${maxSizeMB} Mo`;
    }

    return null;
};

export const validateImageFiles = (
    files,
    maxSize = MAX_IMAGE_SIZE,
    maxCount = null
) => {
    if (!files || files.length === 0) {
        return "Aucun fichier sélectionné";
    }

    if (maxCount && files.length > maxCount) {
        return `Vous ne pouvez sélectionner que ${maxCount} fichier(s) maximum`;
    }

    const invalidFiles = [];
    const oversizedFiles = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
            invalidFiles.push(file.name);
        } else if (file.size > maxSize) {
            oversizedFiles.push(file.name);
        }
    }

    if (invalidFiles.length > 0) {
        const errorMsg = `Format(s) non supporté(s): ${invalidFiles.join(
            ", "
        )}. Utilisez JPG, PNG, WEBP ou GIF`;

        return errorMsg;
    }

    if (oversizedFiles.length > 0) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        const errorMsg = `Fichier(s) trop volumineux: ${oversizedFiles.join(
            ", "
        )}. Taille maximum: ${maxSizeMB} Mo`;

        return errorMsg;
    }

    return null;
};
