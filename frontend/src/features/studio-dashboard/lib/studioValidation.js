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

    if (!form.name) {
        errors.name = "Le nom du studio est requis.";
    } else if (form.name.length < 2) {
        errors.name = "Le nom doit contenir au moins 2 caractères.";
    } else if (form.name.length > 100) {
        errors.name = "Le nom ne peut pas depasser 100 caractères.";
    }

    if (!form.description) {
        errors.description = "La description est requise.";
    } else if (form.description.length < 10) {
        errors.description =
            "La description doit contenir au moins 10 caractères.";
    } else if (form.description.length > 2000) {
        errors.description =
            "La description ne peut pas depasser 2000 caractères.";
    }

    if (!form.street_number) {
        errors.street_number = "Le numéro de rue est requis.";
    } else if (form.street_number.length > 10) {
        errors.street_number =
            "Le numéro de rue ne peut pas depasser 10 caractères.";
    }

    if (!form.street_name) {
        errors.street_name = "La rue est requise.";
    } else if (form.street_name.length < 2) {
        errors.street_name =
            "Le nom de rue doit contenir au moins 2 caractères.";
    } else if (form.street_name.length > 255) {
        errors.street_name =
            "Le nom de rue ne peut pas dépasser 255 caractères.";
    }

    if (!form.postal_code) {
        errors.postal_code = "Le code postal est requis.";
    } else if (!POSTAL_CODE_REGEX.test(form.postal_code)) {
        errors.postal_code = "Le code postal n'est pas valide.";
    }

    if (!form.city) {
        errors.city = "La ville est requise.";
    } else if (form.city.length < 2) {
        errors.city = "Le nom de la ville doit contenir au moins 2 caractères.";
    } else if (form.city.length > 100) {
        errors.city = "Le nom de la ville ne peut pas dépasser 100 caractères.";
    }

    if (form.country && form.country.length > 100) {
        errors.country = "Le pays ne peut pas dépasser 100 caractères.";
    }

    if (!form.hourly_rate) {
        errors.hourly_rate = "Le tarif horaire est requis.";
    } else {
        const rate = Number(form.hourly_rate);
        if (Number.isNaN(rate)) {
            errors.hourly_rate = "Le tarif horaire doit être un nombre.";
        } else if (rate < 1) {
            errors.hourly_rate = "Le tarif horaire doit être d'au moins 1 EUR.";
        } else if (rate > 999.99) {
            errors.hourly_rate =
                "Le tarif horaire ne peut pas dépasser 999,99 EUR.";
        }
    }

    if (!form.phone) {
        errors.phone = "Le numéro de téléphone est requis.";
    } else if (!PHONE_REGEX.test(form.phone)) {
        errors.phone = "Le numéro de téléphone n'est pas valide.";
    }

    if (!form.email) {
        errors.email = "L'adresse email est requise.";
    } else if (!EMAIL_REGEX.test(form.email)) {
        errors.email = "L'adresse email n'est pas valide.";
    }

    if (form.website) {
        const candidate = form.website.includes("://")
            ? form.website
            : `https://${form.website}`;
        try {
            new URL(candidate);
        } catch {
            errors.website =
                "L'URL du site web n'est pas valide (ajoutez par exemple https://).";
        }
    }

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

    return { isValid: Object.keys(errors).length === 0, errors };
}
