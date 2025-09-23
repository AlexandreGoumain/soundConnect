import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStudioFilter } from "../../hooks/useStudioFilter.js";
import { useToast } from "../../hooks/useToast.js";
import { apiClient } from "../../lib/apiClient.js";
import "../../styles/components/_studio-dashboard.scss";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import { useMyReservations } from "./hooks/useMyReservations.js";

export default function StudioReservationsView({ all = false }) {
    const params = useParams();
    const { selectedStudioId, selectedStudio } = useStudioFilter();
    const studioId = all ? selectedStudioId : params.id;

    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [expandedDetails, setExpandedDetails] = useState(new Set());

    const { showToast } = useToast();
    const { reservations, loading, error, refetch } = useMyReservations(studioId);

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
            if (sortBy === "client") {
                return `${a.first_name} ${a.last_name}`.localeCompare(
                    `${b.first_name} ${b.last_name}`
                );
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

    const updateReservationStatus = async (reservationId, newStatus) => {
        try {
            await apiClient.put(`/reservations/${reservationId}`, {
                status: newStatus
            });

            showToast(
                `Réservation ${newStatus === 'confirmed' ? 'confirmée' : newStatus === 'cancelled' ? 'refusée' : 'mise à jour'} avec succès`,
                "success"
            );

            refetch();
        } catch (error) {
            showToast("Erreur lors de la mise à jour de la réservation", "error");
            console.error("Error updating reservation:", error);
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
        <div className="container studio-dashboard">
            <div className="dashboard-layout">
                <div className="dashboard-layout-sidebar">
                    <DashboardSidebar />
                </div>
                <div className="dashboard-layout-main">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="title">
                                {all
                                    ? selectedStudio
                                        ? `Réservations — ${selectedStudio.name}`
                                        : "Réservations — Tous les studios"
                                    : "Réservations du studio"}
                            </h1>
                            <p className="subtitle">
                                {filteredReservations.length} réservation
                                {filteredReservations.length > 1 ? "s" : ""}
                                {statusFilter !== "all" &&
                                    ` (${getStatusLabel(
                                        statusFilter
                                    ).toLowerCase()})`}
                            </p>
                        </div>

                        <div className="reservations-controls">
                            <div className="control-group">
                                <label>Statut :</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="select-control"
                                >
                                    <option value="all">
                                        Tous les statuts
                                    </option>
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">
                                        Confirmées
                                    </option>
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
                                    <option value="client">Client</option>
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
                                    ? "Aucune réservation pour le moment."
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
                                                        {
                                                            reservation.studio_name
                                                        }
                                                    </h3>
                                                    <span
                                                        className={`status-badge ${reservation.status}`}
                                                    >
                                                        <span className="status-icon">
                                                            {getStatusIcon(reservation.status)}
                                                        </span>
                                                        {getStatusLabel(
                                                            reservation.status
                                                        )}
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
                                                        <div className="icon">
                                                            📅
                                                        </div>
                                                        <div>
                                                            <div className="date">
                                                                {
                                                                    startFormat.date
                                                                }
                                                            </div>
                                                            <div className="time-range">
                                                                {
                                                                    startFormat.time
                                                                }{" "}
                                                                -{" "}
                                                                {endFormat.time}
                                                                <span className="duration">
                                                                    ({duration})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="client-section">
                                                    <div className="client-info">
                                                        <div className="icon">
                                                            👤
                                                        </div>
                                                        <div>
                                                            <div className="client-name">
                                                                {
                                                                    reservation.first_name
                                                                }{" "}
                                                                {
                                                                    reservation.last_name
                                                                }
                                                            </div>
                                                            <div className="client-details">
                                                                @
                                                                {
                                                                    reservation.username
                                                                }{" "}
                                                                •{" "}
                                                                {
                                                                    reservation.user_email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {reservation.special_requests && expandedDetails.has(reservation.id) && (
                                                    <div className="requests-section">
                                                        <div className="icon">
                                                            💬
                                                        </div>
                                                        <div>
                                                            <div className="label">
                                                                Demandes
                                                                spéciales :
                                                            </div>
                                                            <div className="content">
                                                                {
                                                                    reservation.special_requests
                                                                }
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
                                                        {
                                                            reservation.total_price
                                                        }
                                                        €
                                                    </span>
                                                </div>
                                            )}

                                            <div className="action-buttons">
                                                {reservation.special_requests && (
                                                    <button
                                                        className="btn-secondary btn-sm"
                                                        onClick={() => toggleDetails(reservation.id)}
                                                    >
                                                        {expandedDetails.has(reservation.id) ? 'Masquer détails' : 'Voir détails'}
                                                    </button>
                                                )}
                                                {reservation.status === "pending" && (
                                                    <>
                                                        <button
                                                            className="btn-primary btn-sm"
                                                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                                        >
                                                            Confirmer
                                                        </button>
                                                        <button
                                                            className="btn-danger btn-sm"
                                                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                                        >
                                                            Refuser
                                                        </button>
                                                    </>
                                                )}
                                                {reservation.status === "confirmed" && (
                                                    <button
                                                        className="btn-success btn-sm"
                                                        onClick={() => updateReservationStatus(reservation.id, 'completed')}
                                                    >
                                                        Marquer terminé
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
        </div>
    );
}
