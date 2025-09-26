import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "../../../hooks/useToast.js";
import { uploadsApi } from "../../../lib/apiClient.js";
import { MAX_IMAGE_SIZE, validateImageFiles } from "../../../lib/validation.js";
import {
    MAX_STUDIO_IMAGES,
    getFilenameFromUrl,
    resolveStudioImageSrc,
} from "../lib/studioImages.js";

export function useStudioImagesManager({ studioId, images, onImagesChange }) {
    const { showError, showSuccess, showInfo } = useToast();

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

            // Validation des fichiers avec la fonction centralisée

            const validationError = validateImageFiles(
                fileList,
                MAX_IMAGE_SIZE,
                remainingSlots
            );

            if (validationError) {
                // Utiliser showError au lieu de showToast
                if (showError) {
                    showError(validationError);
                } else {
                    alert(validationError);
                }

                resetInput(input);
                return;
            }

            // Si validation réussie, prendre les fichiers autorisés selon les slots restants
            const allowedFiles = remainingSlots
                ? fileList.slice(0, remainingSlots)
                : fileList;

            if (!allowedFiles.length) {
                showInfo?.("Nombre maximum d'images atteint");
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
                showSuccess?.("Images ajoutées");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "échec de l'upload des images";
                showError?.(message);
            } finally {
                setIsUploading(false);
                resetInput(input);
            }
        },
        [
            onImagesChange,
            remainingSlots,
            resetInput,
            showError,
            showSuccess,
            showInfo,
            studioId,
        ]
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
                showSuccess?.("Image supprimée");
            } catch (error) {
                const message =
                    error.response?.data?.message || "La suppression a échoué";
                showError?.(message);
            } finally {
                setDeletingFilename(null);
            }
        },
        [onImagesChange, showError, showSuccess, studioId]
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
                showSuccess?.("Ordre des images mis à jour");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Impossible de réordonner les images";
                showError?.(message);
            } finally {
                setIsReordering(false);
            }
        },
        [images, onImagesChange, showError, showSuccess, studioId]
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
