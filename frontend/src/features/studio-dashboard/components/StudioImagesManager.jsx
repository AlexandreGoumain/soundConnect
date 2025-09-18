import { useMemo, useRef, useState } from "react";
import { useToast } from "../../../context/ToastContext.jsx";
import { uploadsApi } from "../../../lib/apiClient.js";

const MAX_IMAGES = 5;
const API_URL = import.meta.env.VITE_API_URL || "";
let assetsOrigin = "";
if (typeof window !== "undefined") {
    try {
        const parsed = new URL(API_URL, window.location.origin);
        assetsOrigin = parsed.origin;
    } catch {
        assetsOrigin = window.location.origin;
    }
}

const getFilename = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
};

const resolveImageSrc = (url) => {
    if (!url) return "";
    if (/^https?:/i.test(url)) return url;
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return assetsOrigin ? `${assetsOrigin}${normalized}` : normalized;
};

export default function StudioImagesManager({
    studioId,
    images = [],
    onImagesChange = () => {},
}) {
    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    const [isUploading, setIsUploading] = useState(false);
    const [deletingFilename, setDeletingFilename] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    const remainingSlots = useMemo(
        () => Math.max(0, MAX_IMAGES - (images?.length ?? 0)),
        [images]
    );

    const handleFileChange = async (event) => {
        const fileList = Array.from(event.target.files || []);
        if (!fileList.length || !studioId) return;

        const allowedFiles = remainingSlots
            ? fileList.slice(0, remainingSlots)
            : [];

        if (!allowedFiles.length) {
            showToast("Nombre maximum d'images atteint", "info");
            event.target.value = "";
            return;
        }

        try {
            setIsUploading(true);
            const response = await uploadsApi.uploadStudioImages(
                studioId,
                allowedFiles
            );
            const nextImages = response?.data?.images ?? [];
            onImagesChange(nextImages);
            showToast("Images ajout�es", "success");
        } catch (error) {
            const message =
                error.response?.data?.message || "�chec de l'upload des images";
            showToast(message, "error");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const handleDelete = async (imageUrl) => {
        if (!studioId || !imageUrl) return;
        const filename = getFilename(imageUrl);
        if (!filename) return;

        try {
            setDeletingFilename(filename);
            const response = await uploadsApi.deleteStudioImage(
                studioId,
                filename
            );
            const nextImages = response?.data?.images ?? [];
            onImagesChange(nextImages);
            showToast("Image supprim�e", "success");
        } catch (error) {
            const message =
                error.response?.data?.message || "La suppression a �chou�";
            showToast(message, "error");
        } finally {
            setDeletingFilename(null);
        }
    };

    const handleMove = async (index, direction) => {
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
            onImagesChange(nextImages);
            showToast("Ordre des images mis � jour", "success");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Impossible de r�ordonner les images";
            showToast(message, "error");
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="studio-images-manager card">
            <div className="studio-images-manager__header">
                <div>
                    <h3>Images du studio</h3>
                    <p>
                        Jusqu'� {MAX_IMAGES} images. Formats accept�s : JPG,
                        PNG, WEBP, GIF.
                    </p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || remainingSlots === 0}
                    >
                        {isUploading
                            ? "Upload en cours..."
                            : "Ajouter des images"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        style={{ display: "none" }}
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {images?.length ? (
                <div className="studio-images-manager__grid">
                    {images.map((imageUrl, index) => {
                        const filename = getFilename(imageUrl);
                        const isDeleting = deletingFilename === filename;
                        return (
                            <div
                                key={imageUrl || index}
                                className="studio-image-card"
                            >
                                <div className="studio-image-card__preview">
                                    {imageUrl ? (
                                        <img
                                            src={resolveImageSrc(imageUrl)}
                                            alt={`Studio ${index + 1}`}
                                        />
                                    ) : (
                                        <div className="studio-image-card__placeholder">
                                            Aper�u indisponible
                                        </div>
                                    )}
                                </div>
                                <div className="studio-image-card__actions">
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleMove(index, -1)}
                                        disabled={isReordering || index === 0}
                                    >
                                        Monter
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleMove(index, 1)}
                                        disabled={
                                            isReordering ||
                                            index === images.length - 1
                                        }
                                    >
                                        Descendre
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleDelete(imageUrl)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting
                                            ? "Suppression..."
                                            : "Supprimer"}
                                    </button>
                                </div>
                                <div className="studio-image-card__filename">
                                    {filename}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="studio-images-manager__empty">
                    Aucune image pour le moment.
                </div>
            )}

            <div className="studio-images-manager__footer">
                {remainingSlots > 0 ? (
                    <span>
                        Il reste {remainingSlots} emplacement(s) disponible(s).
                    </span>
                ) : (
                    <span>Nombre maximum d'images atteint.</span>
                )}
            </div>
        </div>
    );
}
