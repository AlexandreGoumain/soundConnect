import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Studio from "../models/Studio.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_IMAGES = 5;

class UploadError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const ensureDirSync = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const toArray = (imagesField) => {
    if (!imagesField) return [];
    if (Array.isArray(imagesField)) return imagesField;

    if (typeof imagesField === "string") {
        try {
            const parsed = JSON.parse(imagesField);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            return imagesField
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean);
        }

        return [imagesField];
    }

    return [];
};

const normalizeImages = (images, studioId) =>
    images.map((url) => `/uploads/studios/${studioId}/${path.basename(url)}`);

const cleanupFiles = (files = []) => {
    for (const file of files) {
        try {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (error) {
            console.warn("Failed to cleanup file", file?.path, error.message);
        }
    }
};

async function getOwnedStudioOrThrow(studioId, user) {
    const studio = await Studio.findById(studioId);

    if (!studio) {
        throw new UploadError(404, "Studio not found");
    }

    if (studio.owner_id !== user?.id) {
        throw new UploadError(
            403,
            "Unauthorized: You can only modify images for your own studio"
        );
    }

    return studio;
}

export async function appendStudioImages(studioId, user, files = []) {
    if (!files?.length) {
        throw new UploadError(400, "No images uploaded");
    }

    const studio = await getOwnedStudioOrThrow(studioId, user);

    const existing = toArray(studio.images);
    if (existing.length + files.length > MAX_IMAGES) {
        cleanupFiles(files);
        throw new UploadError(
            400,
            `Maximum ${MAX_IMAGES} images allowed per studio. Currently has ${existing.length}.`
        );
    }

    const uploaded = files.map((file) =>
        `/uploads/studios/${studioId}/${path.basename(file.path)}`.replace(
            /\\/g,
            "/"
        )
    );

    const images = normalizeImages([...existing, ...uploaded], studioId);

    await Studio.update(studioId, { images: JSON.stringify(images) });

    return images;
}

export async function removeStudioImage(studioId, user, filename) {
    const studio = await getOwnedStudioOrThrow(studioId, user);

    const existing = toArray(studio.images);
    const safeName = path.basename(filename);
    const filtered = existing.filter((url) => path.basename(url) !== safeName);

    if (filtered.length === existing.length) {
        throw new UploadError(404, "Image not found on this studio");
    }

    const normalized = normalizeImages(filtered, studioId);

    await Studio.update(studioId, { images: JSON.stringify(normalized) });

    const relative = path.join("uploads", "studios", studioId, safeName);
    const absolute = path.join(__dirname, "..", relative);

    try {
        if (fs.existsSync(absolute)) {
            fs.unlinkSync(absolute);
        }
    } catch (error) {
        console.warn("Failed to delete file", absolute, error.message);
    }

    return normalized;
}

export async function reorderStudioImages(studioId, user, images = []) {
    if (!Array.isArray(images) || images.length === 0) {
        throw new UploadError(400, "Images array is required");
    }

    const studio = await getOwnedStudioOrThrow(studioId, user);

    const existing = toArray(studio.images);
    const existingNames = new Set(existing.map((url) => path.basename(url)));
    const incomingNames = new Set(images.map((url) => path.basename(url)));

    if (
        existingNames.size !== incomingNames.size ||
        [...existingNames].some((name) => !incomingNames.has(name))
    ) {
        throw new UploadError(
            400,
            "Reorder list must contain exactly the current images"
        );
    }

    const normalized = normalizeImages(images, studioId);

    await Studio.update(studioId, { images: JSON.stringify(normalized) });

    return normalized;
}

export async function replaceStudioImage(
    studioId,
    user,
    filename,
    file
) {
    if (!file) {
        throw new UploadError(400, "No replacement image uploaded");
    }

    const studio = await getOwnedStudioOrThrow(studioId, user);

    const existing = toArray(studio.images);
    const safeName = path.basename(filename);
    const index = existing.findIndex((url) => path.basename(url) === safeName);

    if (index === -1) {
        cleanupFiles([file]);
        throw new UploadError(404, "Image not found on this studio");
    }

    const newUrl = `/uploads/studios/${studioId}/${path.basename(file.path)}`.replace(
        /\\/g,
        "/"
    );

    const relative = path.join("uploads", "studios", studioId, safeName);
    const absolute = path.join(__dirname, "..", relative);

    try {
        if (fs.existsSync(absolute)) {
            fs.unlinkSync(absolute);
        }
    } catch (error) {
        console.warn("Failed to delete old file", absolute, error.message);
    }

    const updated = [...existing];
    updated[index] = newUrl;

    const normalized = normalizeImages(updated, studioId);

    await Studio.update(studioId, { images: JSON.stringify(normalized) });

    return normalized;
}

export async function uploadUserAvatar(userId, requester, file) {
    if (!file) {
        throw new UploadError(400, "No image uploaded");
    }

    if (requester?.id !== userId) {
        cleanupFiles([file]);
        throw new UploadError(
            403,
            "Unauthorized: You can only update your own avatar"
        );
    }

    const dbUser = await User.findById(userId);

    if (!dbUser) {
        cleanupFiles([file]);
        throw new UploadError(404, "User not found");
    }

    const base = path.join(__dirname, "..", "uploads", "users", userId);
    ensureDirSync(base);

    const safeName = path.basename(file.filename || file.path);
    const destinationPath = path.join(base, safeName);

    if (file.path !== destinationPath) {
        fs.renameSync(file.path, destinationPath);
    }

    if (dbUser.avatar_url) {
        const oldRelative = dbUser.avatar_url.startsWith("/")
            ? dbUser.avatar_url.slice(1)
            : dbUser.avatar_url;
        const oldAbsolute = path.join(__dirname, "..", oldRelative);
        try {
            if (fs.existsSync(oldAbsolute) && oldAbsolute !== destinationPath) {
                fs.unlinkSync(oldAbsolute);
            }
        } catch (error) {
            console.warn("Failed to delete old avatar", error.message);
        }
    }

    const relative = `/uploads/users/${userId}/${safeName}`.replace(/\\/g, "/");

    await User.update(userId, { avatar_url: relative });

    return relative;
}

export { UploadError };

