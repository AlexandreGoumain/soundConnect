import { useStudioImagesManager } from "../hooks/useStudioImagesManager.js";
import { MAX_STUDIO_IMAGES } from "../lib/studioImages.js";

export default function StudioImagesManager({
    studioId,
    images = [],
    onImagesChange = () => {},
}) {
    const {
        fileInputRef,
        isUploading,
        deletingFilename,
        isReordering,
        remainingSlots,
        handleFileChange,
        handleDelete,
        handleMove,
        getFilename,
        resolveImageSrc,
    } = useStudioImagesManager({ studioId, images, onImagesChange });

    return (
        <div className="studio-images-manager card">
            <div className="studio-images-manager__header">
                <div>
                    <h3>Images du studio</h3>
                    <p>
                        Jusqu'à {MAX_STUDIO_IMAGES} images. Formats acceptés :
                        JPG, PNG, WEBP, GIF.
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
                                            Aperçu indisponible
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
