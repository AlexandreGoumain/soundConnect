import { useState } from "react";
import "../../styles/components/_modal.scss";

export default function ReviewModal({
    isOpen,
    onClose,
    onSubmit,
    studioName,
    reservationId,
}) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Veuillez sélectionner une note");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                comment,
                reservation_id: reservationId,
            });
            // Reset form
            setRating(0);
            setComment("");
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setComment("");
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Laisser un avis</h2>
                    <button
                        className="modal-close"
                        onClick={handleCancel}
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Studio</label>
                            <p className="studio-name-display">{studioName}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Note *</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${
                                            star <= (hoveredRating || rating)
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() =>
                                            setHoveredRating(star)
                                        }
                                        onMouseLeave={() => setHoveredRating(0)}
                                        aria-label={`${star} étoile${
                                            star > 1 ? "s" : ""
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="rating-text">
                                    {rating} / 5 étoiles
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="comment">
                                Commentaire (optionnel)
                            </label>
                            <textarea
                                id="comment"
                                className="form-textarea"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Partagez votre expérience..."
                                maxLength={1000}
                            />
                            <p className="char-count">
                                {comment.length} / 1000 caractères
                            </p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? "Envoi..." : "Publier l'avis"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
