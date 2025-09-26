import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArtistReservations } from "../../../hooks/useArtistReservations.js";
import { useToast } from "../../../hooks/useToast.js";
import { apiClient } from "../../../lib/apiClient.js";

export function useMyReservations() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [expandedDetails, setExpandedDetails] = useState(new Set());

    const { showToast } = useToast();
    const { reservations, loading, error, refetch } = useArtistReservations();

    const navigate = useNavigate();

    // Filtrer et trier les réservations
    const filteredReservations = reservations
        .filter((r) => statusFilter === "all" || r.status === statusFilter)
        .sort((a, b) => {
            if (sortBy === "date") {
                return new Date(b.start_datetime) - new Date(a.start_datetime);
            }
            if (sortBy === "status") {
                return a.status.localeCompare(b.status);
            }
            if (sortBy === "studio") {
                return a.studio_name.localeCompare(b.studio_name);
            }
            return 0;
        });

    // Utility functions
    const getStatusLabel = (status) => {
        const labels = {
            pending: "En attente",
            confirmed: "Confirmée",
            completed: "Terminée",
            cancelled: "Annulée",
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
        };
        return icons[status] || "📋";
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        //TODO : create a shared function timezone converter
        return {
            date: date.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            time: date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const calculateDuration = (start, end) => {
        const duration = new Date(end) - new Date(start);
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
    };

    const isReservationModifiable = (reservation) => {
        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        const isPending = reservation.status === "pending";
        const isFuture = endTime > now;

        console.log(`Reservation ${reservation.id.slice(-8)}:`, {
            status: reservation.status,
            isPending,
            endTime: endTime.toISOString(),
            now: now.toISOString(),
            isFuture,
            canModify: isPending && isFuture,
        });

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

    // Handlers
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
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

    return {
        // State
        statusFilter,
        sortBy,
        expandedDetails,
        loading,
        error,
        filteredReservations,

        // Handlers
        handleStatusFilterChange,
        handleSortByChange,
        cancelReservation,
        toggleDetails,
        handleModifyReservation,

        // Utilities
        getStatusLabel,
        getStatusIcon,
        formatDateTime,
        calculateDuration,
        isReservationModifiable,
        isReservationCancellable,
    };
}
