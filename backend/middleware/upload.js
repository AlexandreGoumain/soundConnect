import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirSync = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const allowedMime = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

// Storage for studio images => uploads/studios/:id
const studioImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const studioId = req.params.id;
        const base = path.join(__dirname, "..", "uploads", "studios", studioId);
        try {
            ensureDirSync(base);
            cb(null, base);
        } catch (e) {
            cb(e);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeOriginal = file.originalname
            .replace(/[^a-zA-Z0-9_.-]+/g, "-")
            .replace(/-+/g, "-")
            .toLowerCase();
        cb(null, `${timestamp}-${safeOriginal}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
        return cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
    }
    cb(null, true);
};

export const studioImagesUpload = multer({
    storage: studioImagesStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB per file, max 5 files
});
