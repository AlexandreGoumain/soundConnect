export const DEFAULT_PROFILE = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    city: "",
    postal_code: "",
};

export const PROFILE_FIELDS = Object.keys(DEFAULT_PROFILE);

export const API_URL = import.meta.env.VITE_API_URL || "";

const assetsOrigin = (() => {
    if (typeof window === "undefined") return "";
    try {
        return new URL(API_URL, window.location.origin).origin;
    } catch {
        return window.location.origin;
    }
})();

export const ACCEPTED_AVATAR_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export const normalizeProfile = (user) => {
    const normalized = { ...DEFAULT_PROFILE };
    if (!user) return normalized;

    for (const field of PROFILE_FIELDS) {
        normalized[field] = user[field] ?? "";
    }

    return normalized;
};

export const computeInitials = (profile) => {
    if (!profile) return "";
    const letters = `${profile.first_name?.charAt(0) ?? ""}${
        profile.last_name?.charAt(0) ?? ""
    }`.trim();
    if (letters) return letters.toUpperCase();
    const usernameInitial = profile.username?.charAt(0) ?? "";
    return usernameInitial.toUpperCase();
};

export const hasProfileChanges = (initialData, formData) => {
    if (!initialData) return false;

    return PROFILE_FIELDS.some((field) => {
        const currentValue = formData[field] ?? "";
        const initialValue = initialData[field] ?? "";
        return currentValue !== initialValue;
    });
};

export const resolveAssetUrl = (value) => {
    if (!value) return "";
    if (/^https?:/i.test(value)) return value;
    const normalized = value.startsWith("/") ? value : `/${value}`;
    return assetsOrigin ? `${assetsOrigin}${normalized}` : normalized;
};

export const deriveRoleLabel = (role) => {
    if (role === "studio") return "Compte studio";
    if (role === "artist") return "Compte artiste";
    return "Compte artiste"; // default label
};

export const deriveDisplayName = (profile) => {
    if (!profile) return "";
    const fullname = `${profile.first_name ?? ""} ${
        profile.last_name ?? ""
    }`.trim();
    if (fullname) return fullname;
    return profile.username ?? "";
};
