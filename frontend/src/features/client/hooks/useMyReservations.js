import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArtistReservations } from "../../../hooks/useArtistReservations.js";
import { useToast } from "../../../hooks/useToast.js";
import { apiClient } from "../../../lib/apiClient.js";
import { calculateDuration, formatDateTime } from "../../../lib/dateUtils.js";

export function useMyReservations() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [expandedDetails, setExpandedDetails] = useState(new Set());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { showToast } = useToast();

    // Use backend pagination - pass dynamic options
    const { reservations, loading, error, paginationData, refetch } =
        useArtistReservations();

    const navigate = useNavigate();

    // Extract pagination data from backend response
    const totalReservations =
        paginationData?.totalReservations || reservations.length;
    const totalPages = paginationData?.totalPages || 1;
    const hasNextPage = paginationData?.hasNextPage || false;
    const hasPrevPage = paginationData?.hasPrevPage || false;

    // Reset to page 1 when filters change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    // Pagination controls
    const nextPage = () => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (hasPrevPage) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Utility functions
    const getStatusLabel = (status) => {
        const labels = {
            pending: "En attente",
            confirmed: "Confirmée",
            completed: "Terminée",
            cancelled: "Annulée",
            expired: "Expirée",
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status) => {
        //TODO : Remove icons and purpose a better way to display status (UI rework)
        const icons = {
            pending: "⏳",
            confirmed: "✅",
            completed: "🏁",
            cancelled: "❌",
            expired: "⌛",
        };
        return icons[status] || "📋";
    };

    const isReservationModifiable = (reservation) => {
        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        const isPending = reservation.status === "pending";
        const isFuture = endTime > now;

        return isPending && isFuture;
    };

    const isReservationCancellable = (reservation) => {
        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        const canCancel =
            reservation.status === "pending" ||
            reservation.status === "confirmed";
        const isFuture = endTime > now;

        return canCancel && isFuture;
    };

    const canLeaveReview = (reservation) => {
        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        const isCompleted = reservation.status === "completed";
        const isPast = endTime < now;
        const hasNotReviewed = !reservation.has_reviewed;

        return isCompleted && isPast && hasNotReviewed;
    };

    // Handlers

    const submitReview = async (reviewData) => {
        try {
            await apiClient.post("/reviews", {
                studio_id: reviewData.studio_id,
                ...reviewData,
            });

            showToast("Avis publié avec succès", "success");
            refetch({
                page: currentPage,
                limit: pageSize,
                status: statusFilter,
                sort: sortBy,
            });
        } catch (error) {
            showToast("Erreur lors de la publication de l'avis", "error");
            throw error;
        }
    };

    const cancelReservation = async (reservationId) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            return;
        }

        try {
            await apiClient.put(`/reservations/${reservationId}`, {
                status: "cancelled",
            });

            showToast("Réservation annulée avec succès", "success");
            refetch();
        } catch (error) {
            showToast("Erreur lors de l'annulation de la réservation", "error");
            console.error("Error cancelling reservation:", error);
        }
    };

    const toggleDetails = (reservationId) => {
        const newExpanded = new Set(expandedDetails);
        if (newExpanded.has(reservationId)) {
            newExpanded.delete(reservationId);
        } else {
            newExpanded.add(reservationId);
        }
        setExpandedDetails(newExpanded);
    };

    const handleModifyReservation = (reservationId, studioId) => {
        navigate(`/studios/${studioId}?edit_reservation=${reservationId}`);
    };

    // Refetch when pagination parameters change
    useEffect(() => {
        refetch({
            page: currentPage,
            limit: pageSize,
            status: statusFilter,
            sort: sortBy,
        });
    }, [currentPage, statusFilter, sortBy]);

    return {
        // State
        statusFilter,
        sortBy,
        expandedDetails,
        loading,
        error,
        filteredReservations: reservations,

        // Pagination
        currentPage,
        totalPages,
        totalReservations,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,

        // Handlers
        handleStatusFilterChange,
        handleSortByChange,
        cancelReservation,
        toggleDetails,
        handleModifyReservation,
        submitReview,

        // Pagination controls
        nextPage,
        prevPage,
        goToPage,

        // Utilities
        getStatusLabel,
        getStatusIcon,
        formatDateTime,
        calculateDuration,
        isReservationModifiable,
        isReservationCancellable,
        canLeaveReview,
    };
}
