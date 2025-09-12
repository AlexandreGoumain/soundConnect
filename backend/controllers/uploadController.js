import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Studio from "../models/Studio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toArray = (imagesField) => {
    if (!imagesField) return [];
    try {
        const parsed = JSON.parse(imagesField);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        // fallback: comma-separated
        if (typeof imagesField === "string") {
            return imagesField
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        return [];
    }
};

export const uploadStudioImages = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate studio and ownership
        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }

        const isOwner = req.user?.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized: You can only upload images for your own studio",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No images uploaded" });
        }

        // max 5 photos per studio
        const existing = toArray(studio.images);
        const maxAllowed = 5;
        if (existing.length + req.files.length > maxAllowed) {
            try {
                for (const f of req.files) {
                    if (f?.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
                }
            } catch (e) {
                console.warn(
                    "Cleanup failed after exceeding max images:",
                    e.message
                );
            }
            return res.status(400).json({
                success: false,
                message: `Maximum ${maxAllowed} images allowed per studio. Currently has ${existing.length}.`,
            });
        }

        // public URLs for uploaded files
        const uploaded = req.files.map((f) => {
            const rel = `/uploads/studios/${id}/${path.basename(f.path)}`;
            return rel.replace(/\\/g, "/");
        });

        const images = [...existing, ...uploaded];

        await Studio.update(id, { images: JSON.stringify(images) });

        res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: { images },
        });
    } catch (error) {
        console.error("Error uploading studio images:", error);
        const message =
            error?.message || "Error uploading images. Please try again.";
        res.status(500).json({ success: false, message });
    }
};

export const deleteStudioImage = async (req, res) => {
    try {
        const { id, filename } = req.params;

        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }

        const isOwner = req.user?.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized: You can only modify images for your own studio",
            });
        }

        const existing = toArray(studio.images);
        const safeName = path.basename(filename);
        const relPath = `/uploads/studios/${id}/${safeName}`;
        const newImages = existing.filter((u) => path.basename(u) !== safeName);

        if (newImages.length === existing.length) {
            return res.status(404).json({
                success: false,
                message: "Image not found on this studio",
            });
        }

        // Delete file from disk if exists
        const absPath = path.join(
            __dirname,
            "..",
            "uploads",
            "studios",
            id,
            safeName
        );
        try {
            if (fs.existsSync(absPath)) {
                fs.unlinkSync(absPath);
            }
        } catch (e) {
            // Log but continue to keep DB consistent
            console.warn("Failed to delete file from disk:", e.message);
        }

        await Studio.update(id, { images: JSON.stringify(newImages) });

        return res.json({
            success: true,
            message: "Image deleted successfully",
            data: { images: newImages },
        });
    } catch (error) {
        console.error("Error deleting studio image:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error deleting image" });
    }
};

export const reorderStudioImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { images } = req.body;

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "images must be a non-empty array",
            });
        }

        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }

        const isOwner = req.user?.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized: You can only modify images for your own studio",
            });
        }

        const existing = toArray(studio.images);

        // Validate the reorder set matches current set
        const byName = (u) => path.basename(u);
        const setA = new Set(existing.map(byName));
        const setB = new Set(images.map(byName));
        if (setA.size !== setB.size || [...setA].some((x) => !setB.has(x))) {
            return res.status(400).json({
                success: false,
                message: "Reorder list must contain exactly the current images",
            });
        }

        // Normalize to relative URLs
        const normalized = images.map((u) => {
            const name = path.basename(u);
            return `/uploads/studios/${id}/${name}`;
        });

        await Studio.update(id, { images: JSON.stringify(normalized) });

        return res.json({
            success: true,
            message: "Images reordered successfully",
            data: { images: normalized },
        });
    } catch (error) {
        console.error("Error reordering studio images:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error reordering images" });
    }
};

export const replaceStudioImage = async (req, res) => {
    try {
        const { id, filename } = req.params;

        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }

        const isOwner = req.user?.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized: You can only modify images for your own studio",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No replacement image uploaded",
            });
        }

        const existing = toArray(studio.images);
        const safeName = path.basename(filename);
        const idx = existing.findIndex((u) => path.basename(u) === safeName);
        if (idx === -1) {
            return res.status(404).json({
                success: false,
                message: "Image not found on this studio",
            });
        }

        // New uploaded path
        const newUrl = `/uploads/studios/${id}/${path.basename(
            req.file.path
        )}`.replace(/\\/g, "/");

        // Delete old file from disk
        const absOld = path.join(
            __dirname,
            "..",
            "uploads",
            "studios",
            id,
            safeName
        );
        try {
            if (fs.existsSync(absOld)) {
                fs.unlinkSync(absOld);
            }
        } catch (e) {
            console.warn("Failed to delete old file:", e.message);
        }

        const updated = [...existing];
        updated[idx] = newUrl;

        await Studio.update(id, { images: JSON.stringify(updated) });

        return res.json({
            success: true,
            message: "Image replaced successfully",
            data: { images: updated },
        });
    } catch (error) {
        console.error("Error replacing studio image:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error replacing image" });
    }
};
