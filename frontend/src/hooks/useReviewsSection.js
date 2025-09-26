import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { apiClient } from "../lib/apiClient";
import { validateReview } from "../lib/validation/formValidators.js";

export function useReviewsSection(studioId) {
    const { user } = useAuth();
    const { showToast } = useToast();

    // State management
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
    const [reviewErrors, setReviewErrors] = useState({});

    // API calls
    const fetchReviews = useCallback(async () => {
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
    }, [studioId, showToast]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await apiClient.get(
                `/reviews/studio/${studioId}/stats`
            );
            setStats(response.data.data);
        } catch {
            showToast("Erreur lors du chargement des stats", "error");
        }
    }, [studioId, showToast]);

    const checkCanReview = useCallback(async () => {
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
    }, [studioId, showToast]);

    const fetchAvailableReservations = useCallback(async () => {
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
    }, [studioId, showToast]);

    // Effects
    useEffect(() => {
        fetchReviews();
        fetchStats();
        if (user) {
            checkCanReview();
            fetchAvailableReservations();
        }
    }, [
        studioId,
        user,
        fetchReviews,
        fetchStats,
        checkCanReview,
        fetchAvailableReservations,
    ]);

    // Form validation
    const validateReviewForm = () => {
        const { errors, isValid } = validateReview(newReview);
        setReviewErrors(errors);
        return isValid;
    };

    // Handlers
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!validateReviewForm()) {
            return;
        }

        setReviewErrors({});

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
            const validationErrors = error.response?.data?.errors;

            if (validationErrors && Array.isArray(validationErrors)) {
                const errors = {};
                validationErrors.forEach((error) => {
                    errors[error.field] = error.message;
                });
                setReviewErrors(errors);
            } else {
                showToast(
                    "Erreur lors de l'ajout de l'avis, veuillez réessayer plus tard",
                    "error"
                );
            }
        }
    };

    const handleToggleReviewForm = () => {
        setShowReviewForm(!showReviewForm);
    };

    const handleReviewChange = (field, value) => {
        setNewReview({ ...newReview, [field]: value });
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    // Utility functions
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

    return {
        // State
        reviews,
        stats,
        loading,
        canReview,
        showReviewForm,
        availableReservations,
        newReview,
        reviewErrors,
        user,

        // Handlers
        handleSubmitReview,
        handleToggleReviewForm,
        handleReviewChange,
        handleRatingChange,

        // Utilities
        formatDate,
        formatReservationDate,
    };
}