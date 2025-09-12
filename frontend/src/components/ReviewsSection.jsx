import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiClient } from "../lib/apiClient";
import "./ReviewsSection.scss";

const ReviewsSection = ({ studioId, studioName }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [availableReservations, setAvailableReservations] = useState([]);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: "",
        reservation_id: "",
    });

    useEffect(() => {
        fetchReviews();
        fetchStats();
        if (user) {
            checkCanReview();
            fetchAvailableReservations();
        }
    }, [studioId, user]);

    const fetchReviews = async () => {
        try {
            const response = await apiClient.get(
                `/reviews?studio_id=${studioId}`
            );
            setReviews(response.data.data);
        } catch {
            showToast("Erreur lors du chargement des avis", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await apiClient.get(
                `/reviews/studio/${studioId}/stats`
            );
            setStats(response.data.data);
        } catch {
            showToast("Erreur lors du chargement des stats", "error");
        }
    };

    const checkCanReview = async () => {
        try {
            const response = await apiClient.get(
                `/reviews/studio/${studioId}/can-review`
            );
            setCanReview(response.data.data.canReview);
        } catch {
            showToast(
                "Erreur lors de la vérification de la possibilité de laisser un avis",
                "error"
            );
        }
    };

    const fetchAvailableReservations = async () => {
        try {
            const response = await apiClient.get(
                `/reviews/studio/${studioId}/reservations`
            );
            setAvailableReservations(response.data.data);
        } catch {
            showToast(
                "Erreur lors du chargement des réservations disponibles",
                "error"
            );
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!newReview.rating) {
            showToast("Veuillez sélectionner une note", "error");
            return;
        }

        if (!newReview.reservation_id) {
            showToast("Veuillez sélectionner une réservation", "error");
            return;
        }

        try {
            await apiClient.post("/reviews", {
                studio_id: studioId,
                reservation_id: newReview.reservation_id,
                rating: newReview.rating,
                comment: newReview.comment,
            });

            showToast("Avis ajouté avec succès!", "success");
            setShowReviewForm(false);
            setNewReview({ rating: 0, comment: "", reservation_id: "" });
            fetchReviews();
            fetchStats();
            checkCanReview();
            fetchAvailableReservations();
        } catch (error) {
            console.error("Error submitting review:", error);
            showToast(
                "Erreur lors de l'ajout de l'avis, veuillez réessayer plus tard",
                "error"
            );
        }
    };

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatReservationDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.toLocaleDateString("fr-FR")} ${start.toLocaleTimeString(
            "fr-FR",
            { hour: "2-digit", minute: "2-digit" }
        )} - ${end.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
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
                        onClick={() => setShowReviewForm(!showReviewForm)}
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
                                        setNewReview({
                                            ...newReview,
                                            reservation_id: e.target.value,
                                        })
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
                                {renderStars(newReview.rating, true, (rating) =>
                                    setNewReview({ ...newReview, rating })
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Commentaire :</label>
                                <textarea
                                    id="comment"
                                    value={newReview.comment}
                                    onChange={(e) =>
                                        setNewReview({
                                            ...newReview,
                                            comment: e.target.value,
                                        })
                                    }
                                    placeholder="Partagez votre expérience..."
                                    rows="4"
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
                    <a href="/login">Connectez-vous</a> pour laisser un avis
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
