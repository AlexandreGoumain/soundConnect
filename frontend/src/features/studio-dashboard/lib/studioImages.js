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
