import {
    validateCity,
    validateCountry,
    validateDescription,
    validateEmail,
    validateHourlyRate,
    validatePhone,
    validatePostalCode,
    validateStreetName,
    validateStreetNumber,
    validateStudioName,
    validateWebsite,
} from "../../../lib/validation.js";

const DEFAULT_COUNTRY = "France";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_REGEX = /^[0-9+()\s.-]{6,20}$/;
const POSTAL_CODE_REGEX = /^[0-9A-Za-z\s-]{3,10}$/;

export const MAX_TAGS_COUNT = 10;
export const MAX_TAGS_LENGTH = 50;

const toStringValue = (value) =>
    value === null || value === undefined ? "" : String(value);

const splitTokens = (raw, pattern) =>
    toStringValue(raw)
        .split(pattern)
        .map((item) => item.trim())
        .filter(Boolean);

const dedupeTokens = (list, resolver = (value) => value.toLowerCase()) => {
    const seen = new Set();
    const unique = [];
    for (const item of list) {
        const key = resolver(item);
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(item);
    }
    return unique;
};

export { DEFAULT_COUNTRY };

export function sanitizeStudioForm(form = {}) {
    const sanitized = {
        name: "",
        description: "",
        street_number: "",
        street_name: "",
        postal_code: "",
        city: "",
        country: DEFAULT_COUNTRY,
        hourly_rate: "",
        phone: "",
        email: "",
        website: "",
        equipment_list: "",
        tags: "",
    };

    sanitized.name = toStringValue(form.name).trim();
    sanitized.description = toStringValue(form.description).trim();
    sanitized.street_number = toStringValue(form.street_number).trim();
    sanitized.street_name = toStringValue(form.street_name).trim();
    sanitized.postal_code = toStringValue(form.postal_code).trim();
    sanitized.city = toStringValue(form.city).trim();

    const countryValue = toStringValue(form.country).trim();
    sanitized.country = countryValue || DEFAULT_COUNTRY;

    const rawRate = toStringValue(form.hourly_rate).replace(",", ".").trim();
    sanitized.hourly_rate = rawRate.replace(/\s+/g, "");

    sanitized.phone = toStringValue(form.phone).trim();
    sanitized.email = toStringValue(form.email).trim().toLowerCase();

    sanitized.website = toStringValue(form.website).trim();

    const equipments = dedupeTokens(
        splitTokens(form.equipment_list, /[\n,;]+/)
    );
    sanitized.equipment_list = equipments.join("\n");

    const tags = dedupeTokens(splitTokens(form.tags, /[,\n;]+/));
    const limitedTags = [];
    for (const tag of tags) {
        if (limitedTags.length >= MAX_TAGS_COUNT) break;
        const prospective = [...limitedTags, tag];
        const joined = prospective.join(", ");
        if (joined.length > MAX_TAGS_LENGTH) continue;
        limitedTags.push(tag);
    }
    sanitized.tags = limitedTags.join(", ");

    return sanitized;
}

export function validateStudioForm(form = {}) {
    const errors = {};

    // Utilisation des utilitaires de validation partagés
    const nameError = validateStudioName(form.name);
    if (nameError) errors.name = nameError;

    const descriptionError = validateDescription(form.description);
    if (descriptionError) errors.description = descriptionError;

    const streetNumberError = validateStreetNumber(form.street_number);
    if (streetNumberError) errors.street_number = streetNumberError;

    const streetNameError = validateStreetName(form.street_name);
    if (streetNameError) errors.street_name = streetNameError;

    const postalCodeError = validatePostalCode(form.postal_code);
    if (postalCodeError) errors.postal_code = postalCodeError;

    const cityError = validateCity(form.city);
    if (cityError) errors.city = cityError;

    const countryError = validateCountry(form.country);
    if (countryError) errors.country = countryError;

    const hourlyRateError = validateHourlyRate(form.hourly_rate);
    if (hourlyRateError) errors.hourly_rate = hourlyRateError;

    const phoneError = validatePhone(form.phone);
    if (phoneError) errors.phone = phoneError;

    const emailError = validateEmail(form.email);
    if (emailError) errors.email = emailError;

    const websiteError = validateWebsite(form.website);
    if (websiteError) errors.website = websiteError;

    if (form.equipment_list && form.equipment_list.length > 5000) {
        errors.equipment_list =
            "La liste des équipements ne peut pas dépasser 5000 caractères.";
    }

    const tagCount = splitTokens(form.tags, /[,\n;]+/).length;
    if (tagCount > MAX_TAGS_COUNT) {
        errors.tags = `Vous pouvez ajouter jusqu'à ${MAX_TAGS_COUNT} tags.`;
    }

    const tagString = toStringValue(form.tags);
    if (tagString.length > MAX_TAGS_LENGTH) {
        errors.tags =
            errors.tags ||
            `La liste de tags ne peut pas dépasser ${MAX_TAGS_LENGTH} caractères.`;
    }

    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
}
