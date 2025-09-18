const API_URL = import.meta.env.VITE_API_URL || "";

const assetsOrigin = (() => {
    if (typeof window === "undefined") return "";
    try {
        return new URL(API_URL, window.location.origin).origin;
    } catch {
        return window.location.origin;
    }
})();

export const MAX_STUDIO_IMAGES = 5;

export const parseStudioImagesField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
            }
        } catch {
            return trimmed
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [trimmed];
    }

    return [];
};

export const getFilenameFromUrl = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
};

export const resolveStudioImageSrc = (url) => {
    if (!url) return "";
    if (/^https?:/i.test(url)) return url;
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return assetsOrigin ? `${assetsOrigin}${normalized}` : normalized;
};

export const resolveStudioImages = (value) =>
    parseStudioImagesField(value).map((image) => resolveStudioImageSrc(image));
