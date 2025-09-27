import { useNavigate } from "react-router-dom";
import { useReviewsSection } from "../hooks/useReviewsSection";
import "../styles/components/_reviews-section.scss";
import ReviewStats from "./shared/ReviewStats.jsx";
import ReviewForm from "./shared/ReviewForm.jsx";
import ReviewsList from "./shared/ReviewsList.jsx";

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
                <ReviewStats stats={stats} />
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
                        <ReviewForm
                            newReview={newReview}
                            availableReservations={availableReservations}
                            handleReviewChange={handleReviewChange}
                            handleRatingChange={handleRatingChange}
                            handleSubmitReview={handleSubmitReview}
                            formatReservationDate={formatReservationDate}
                        />
                    )}
                </div>
            )}

            {!user && (
                <p className="login-prompt">
                    <button type="button" onClick={() => navigate("/login")} className="login-link">Connectez-vous</button>{" "}
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

            <ReviewsList
                reviews={reviews}
                formatDate={formatDate}
                formatReservationDate={formatReservationDate}
            />
        </div>
    );
};

export default ReviewsSection;
