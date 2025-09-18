import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "../../../context/ToastContext.jsx";
import { uploadsApi } from "../../../lib/apiClient.js";
import {
    MAX_STUDIO_IMAGES,
    getFilenameFromUrl,
    resolveStudioImageSrc,
} from "../lib/studioImages.js";

const ACCEPTED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
];

export function useStudioImagesManager({ studioId, images, onImagesChange }) {
    const { showToast } = useToast();
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingFilename, setDeletingFilename] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    const remainingSlots = useMemo(
        () => Math.max(0, MAX_STUDIO_IMAGES - (images?.length ?? 0)),
        [images]
    );

    const resetInput = useCallback((input) => {
        if (input) {
            input.value = "";
        }
    }, []);

    const handleFileChange = useCallback(
        async (event) => {
            const input = event.target;
            const fileList = Array.from(input.files || []);

            if (!fileList.length || !studioId) {
                resetInput(input);
                return;
            }

            const filtered = fileList.filter((file) =>
                ACCEPTED_IMAGE_TYPES.includes(file.type)
            );

            if (!filtered.length) {
                showToast?.(
                    "Les formats autorisés sont JPG, PNG, WEBP ou GIF.",
                    "error"
                );
                resetInput(input);
                return;
            }

            const allowedFiles = remainingSlots
                ? filtered.slice(0, remainingSlots)
                : [];

            if (!allowedFiles.length) {
                showToast?.("Nombre maximum d'images atteint", "info");
                resetInput(input);
                return;
            }

            try {
                setIsUploading(true);
                const response = await uploadsApi.uploadStudioImages(
                    studioId,
                    allowedFiles
                );
                const nextImages = response?.data?.images ?? [];
                onImagesChange?.(nextImages);
                showToast?.("Images ajoutées", "success");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "échec de l'upload des images";
                showToast?.(message, "error");
            } finally {
                setIsUploading(false);
                resetInput(input);
            }
        },
        [onImagesChange, remainingSlots, resetInput, showToast, studioId]
    );

    const handleDelete = useCallback(
        async (imageUrl) => {
            if (!studioId || !imageUrl) return;
            const filename = getFilenameFromUrl(imageUrl);
            if (!filename) return;

            try {
                setDeletingFilename(filename);
                const response = await uploadsApi.deleteStudioImage(
                    studioId,
                    filename
                );
                const nextImages = response?.data?.images ?? [];
                onImagesChange?.(nextImages);
                showToast?.("Image supprimée", "success");
            } catch (error) {
                const message =
                    error.response?.data?.message || "La suppression a échoué";
                showToast?.(message, "error");
            } finally {
                setDeletingFilename(null);
            }
        },
        [onImagesChange, showToast, studioId]
    );

    const handleMove = useCallback(
        async (index, direction) => {
            if (!studioId || !images?.length) return;
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= images.length) return;

            const reordered = [...images];
            const temp = reordered[index];
            reordered[index] = reordered[targetIndex];
            reordered[targetIndex] = temp;

            try {
                setIsReordering(true);
                const response = await uploadsApi.reorderStudioImages(
                    studioId,
                    reordered
                );
                const nextImages = response?.data?.images ?? reordered;
                onImagesChange?.(nextImages);
                showToast?.("Ordre des images mis à jour", "success");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Impossible de réordonner les images";
                showToast?.(message, "error");
            } finally {
                setIsReordering(false);
            }
        },
        [images, onImagesChange, showToast, studioId]
    );

    return {
        fileInputRef,
        isUploading,
        deletingFilename,
        isReordering,
        remainingSlots,
        handleFileChange,
        handleDelete,
        handleMove,
        getFilename: getFilenameFromUrl,
        resolveImageSrc: resolveStudioImageSrc,
    };
}
