import { useNavigate } from "react-router-dom";
import { useReviewsSection } from "../hooks/useReviewsSection";
import "../styles/components/_reviews-section.scss";
import TextareaField from "./shared/TextareaField.jsx";

//TODO: i can refacto to separate components
//TODO: add pagination

const ReviewsSection = ({ studioId, studioName }) => {
    const {
        reviews,
        stats,
        loading,
        canReview,
        showReviewForm,
        availableReservations,
        newReview,

        user,
        handleSubmitReview,
        handleToggleReviewForm,
        handleReviewChange,
        handleRatingChange,
        formatDate,
        formatReservationDate,
    } = useReviewsSection(studioId);

    const navigate = useNavigate();

    const renderStars = (
        rating,
        interactive = false,
        onRatingChange = null
    ) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? "filled" : ""} ${
                            interactive ? "interactive" : ""
                        }`}
                        onClick={
                            interactive ? () => onRatingChange(star) : undefined
                        }
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="reviews-section loading">
                Chargement des avis...
            </div>
        );
    }

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <h3>Avis sur {studioName}</h3>
                {stats && (
                    <div className="review-stats">
                        <div className="average-rating">
                            <span className="rating-number">
                                {stats.average_rating?.toFixed(1) || "0.0"}
                            </span>
                            {renderStars(Math.round(stats.average_rating || 0))}
                            <span className="total-reviews">
                                ({stats.total_reviews} avis)
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {user && canReview && (
                <div className="add-review-section">
                    <button
                        className="btn btn-primary"
                        onClick={handleToggleReviewForm}
                    >
                        {showReviewForm ? "Annuler" : "Ajouter un avis"}
                    </button>

                    {showReviewForm && (
                        <form
                            className="review-form"
                            onSubmit={handleSubmitReview}
                        >
                            <div className="form-group">
                                <label htmlFor="reservation">
                                    Réservation :
                                </label>
                                <select
                                    id="reservation"
                                    value={newReview.reservation_id}
                                    onChange={(e) =>
                                        handleReviewChange(
                                            "reservation_id",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        Sélectionnez une réservation
                                    </option>
                                    {availableReservations.map(
                                        (reservation) => (
                                            <option
                                                key={reservation.id}
                                                value={reservation.id}
                                            >
                                                {formatReservationDate(
                                                    reservation.start_datetime,
                                                    reservation.end_datetime
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Note :</label>
                                {renderStars(
                                    newReview.rating,
                                    true,
                                    handleRatingChange
                                )}
                            </div>
                            <div className="form-group">
                                <TextareaField
                                    id="comment"
                                    label="Commentaire :"
                                    value={newReview.comment}
                                    onChange={(e) =>
                                        handleReviewChange(
                                            "comment",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Partagez votre expérience..."
                                    rows={4}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Publier l'avis
                            </button>
                        </form>
                    )}
                </div>
            )}

            {!user && (
                <p className="login-prompt">
                    <a onClick={() => navigate("/login")}>Connectez-vous</a>{" "}
                    pour laisser un avis
                </p>
            )}

            {user && !canReview && (
                <p className="review-info">
                    Seuls les artistes peuvent laisser des avis après avoir
                    terminé une réservation
                </p>
            )}

            {user && canReview && availableReservations.length === 0 && (
                <p className="review-info">
                    Aucune réservation terminée disponible pour laisser un avis
                </p>
            )}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">Aucun avis pour le moment</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">
                                        {review.first_name} {review.last_name}
                                    </span>
                                    <span className="review-date">
                                        {formatDate(review.created_at)}
                                    </span>
                                    <span className="reservation-date">
                                        Réservation:{" "}
                                        {formatReservationDate(
                                            review.start_datetime,
                                            review.end_datetime
                                        )}
                                    </span>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            {review.comment && (
                                <p className="review-comment">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsSection;
