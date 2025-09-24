import { useState } from "react";
import { useArtistReservations } from "../../hooks/useArtistReservations.js";
import { useToast } from "../../hooks/useToast.js";
import { apiClient } from "../../lib/apiClient.js";
import "../../styles/components/_studio-dashboard.scss";

export default function MyReservations() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [expandedDetails, setExpandedDetails] = useState(new Set());

    const { showToast } = useToast();
    const { reservations, loading, error, refetch } = useArtistReservations();

    if (loading) return <div className="container">Chargement…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;

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
        const icons = {
            pending: "⏳",
            confirmed: "✅",
            completed: "🏁",
            cancelled: "❌"
        };
        return icons[status] || "📋";
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
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
            canModify: isPending && isFuture
        });

        return isPending && isFuture;
    };


    const isReservationCancellable = (reservation) => {
        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        const canCancel = (reservation.status === "pending" || reservation.status === "confirmed");
        const isFuture = endTime > now;

        return canCancel && isFuture;
    };

    const cancelReservation = async (reservationId) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            return;
        }

        try {
            await apiClient.put(`/reservations/${reservationId}`, {
                status: "cancelled"
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

    return (
        <div className="container">
            <div className="dashboard-layout-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="title">Mes réservations</h1>
                        <p className="subtitle">
                            {filteredReservations.length} réservation
                            {filteredReservations.length > 1 ? "s" : ""}
                            {statusFilter !== "all" &&
                                ` (${getStatusLabel(statusFilter).toLowerCase()})`}
                        </p>
                    </div>

                    <div className="reservations-controls">
                        <div className="control-group">
                            <label>Statut :</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="select-control"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmées</option>
                                <option value="completed">Terminées</option>
                                <option value="cancelled">Annulées</option>
                            </select>
                        </div>

                        <div className="control-group">
                            <label>Trier par :</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select-control"
                            >
                                <option value="date">Date</option>
                                <option value="status">Statut</option>
                                <option value="studio">Studio</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredReservations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>Aucune réservation</h3>
                        <p>
                            {statusFilter === "all"
                                ? "Vous n'avez pas encore effectué de réservation."
                                : `Aucune réservation avec le statut "${getStatusLabel(
                                      statusFilter
                                  ).toLowerCase()}".`}
                        </p>
                    </div>
                ) : (
                    <div className="reservations-list">
                        {filteredReservations.map((reservation) => {
                            const startFormat = formatDateTime(
                                reservation.start_datetime
                            );
                            const endFormat = formatDateTime(
                                reservation.end_datetime
                            );
                            const duration = calculateDuration(
                                reservation.start_datetime,
                                reservation.end_datetime
                            );

                            return (
                                <div
                                    key={reservation.id}
                                    className="reservation-detail-card"
                                >
                                    <div className="reservation-main">
                                        <div className="reservation-header">
                                            <div className="studio-info">
                                                <h3 className="studio-name">
                                                    {reservation.studio_name}
                                                </h3>
                                                <span
                                                    className={`status-badge ${reservation.status}`}
                                                >
                                                    <span className="status-icon">
                                                        {getStatusIcon(reservation.status)}
                                                    </span>
                                                    {getStatusLabel(reservation.status)}
                                                </span>
                                            </div>

                                            <div className="reservation-id">
                                                Réservation #
                                                {reservation.id.slice(-8)}
                                            </div>
                                        </div>

                                        <div className="reservation-content">
                                            <div className="datetime-section">
                                                <div className="date-info">
                                                    <div className="icon">📅</div>
                                                    <div>
                                                        <div className="date">
                                                            {startFormat.date}
                                                        </div>
                                                        <div className="time-range">
                                                            {startFormat.time} -{" "}
                                                            {endFormat.time}
                                                            <span className="duration">
                                                                ({duration})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="studio-section">
                                                <div className="studio-info-detail">
                                                    <div className="icon">🏠</div>
                                                    <div>
                                                        <div className="studio-address">
                                                            {reservation.studio_address}
                                                        </div>
                                                        {reservation.studio_city && (
                                                            <div className="studio-city">
                                                                {reservation.studio_city}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {reservation.special_requests && expandedDetails.has(reservation.id) && (
                                                <div className="requests-section">
                                                    <div className="icon">💬</div>
                                                    <div>
                                                        <div className="label">
                                                            Mes demandes spéciales :
                                                        </div>
                                                        <div className="content">
                                                            {reservation.special_requests}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="reservation-actions">
                                        {reservation.total_price && (
                                            <div className="price-info">
                                                <span className="price">
                                                    {reservation.total_price}€
                                                </span>
                                            </div>
                                        )}

                                        <div className="action-buttons">
                                            {reservation.special_requests && (
                                                <button
                                                    className="btn-secondary btn-sm"
                                                    onClick={() => toggleDetails(reservation.id)}
                                                >
                                                    {expandedDetails.has(reservation.id)
                                                        ? 'Masquer détails'
                                                        : 'Voir détails'}
                                                </button>
                                            )}
                                            {isReservationCancellable(reservation) && (
                                                <button
                                                    className="btn-danger btn-sm"
                                                    onClick={() => cancelReservation(reservation.id)}
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            {isReservationModifiable(reservation) && (
                                                <button
                                                    className="btn-primary btn-sm"
                                                    onClick={() => window.location.href = `/studios/${reservation.studio_id}?edit_reservation=${reservation.id}`}
                                                >
                                                    Modifier
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}