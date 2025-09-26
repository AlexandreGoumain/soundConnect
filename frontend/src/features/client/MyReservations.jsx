import SelectDropdown from "../../components/shared/SelectDropdown.jsx";
import "../../styles/components/_studio-dashboard.scss";
import { useMyReservations } from "./hooks/useMyReservations.js";

//TODO: split in separate components

export default function MyReservations() {
    const {
        statusFilter,
        sortBy,
        expandedDetails,
        loading,
        error,
        filteredReservations,
        handleStatusFilterChange,
        handleSortByChange,
        cancelReservation,
        toggleDetails,
        handleModifyReservation,
        getStatusLabel,
        getStatusIcon,
        formatDateTime,
        calculateDuration,
        isReservationModifiable,
        isReservationCancellable,
    } = useMyReservations();

    if (loading) return <div className="container">Chargement…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;

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
                                ` (${getStatusLabel(
                                    statusFilter
                                ).toLowerCase()})`}
                        </p>
                    </div>

                    <div className="reservations-controls">
                        <div className="control-group">
                            <SelectDropdown
                                label="Statut :"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="select-control"
                                options={[
                                    { value: "all", label: "Tous les statuts" },
                                    { value: "pending", label: "En attente" },
                                    { value: "confirmed", label: "Confirmées" },
                                    { value: "completed", label: "Terminées" },
                                    { value: "cancelled", label: "Annulées" },
                                ]}
                            />
                        </div>

                        <div className="control-group">
                            <SelectDropdown
                                label="Trier par :"
                                value={sortBy}
                                onChange={handleSortByChange}
                                className="select-control"
                                options={[
                                    { value: "date", label: "Date" },
                                    { value: "status", label: "Statut" },
                                    { value: "studio", label: "Studio" },
                                ]}
                            />
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
                                                        {getStatusIcon(
                                                            reservation.status
                                                        )}
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
                                                    <div className="icon">
                                                        🏠
                                                    </div>
                                                    <div>
                                                        <div className="studio-address">
                                                            {
                                                                reservation.studio_address
                                                            }
                                                        </div>
                                                        {reservation.studio_city && (
                                                            <div className="studio-city">
                                                                {
                                                                    reservation.studio_city
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {reservation.special_requests &&
                                                expandedDetails.has(
                                                    reservation.id
                                                ) && (
                                                    <div className="requests-section">
                                                        <div className="icon">
                                                            💬
                                                        </div>
                                                        <div>
                                                            <div className="label">
                                                                Mes demandes
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
                                                    {reservation.total_price}€
                                                </span>
                                            </div>
                                        )}

                                        <div className="action-buttons">
                                            {reservation.special_requests && (
                                                <button
                                                    className="btn-secondary btn-sm"
                                                    onClick={() =>
                                                        toggleDetails(
                                                            reservation.id
                                                        )
                                                    }
                                                >
                                                    {expandedDetails.has(
                                                        reservation.id
                                                    )
                                                        ? "Masquer détails"
                                                        : "Voir détails"}
                                                </button>
                                            )}
                                            {isReservationCancellable(
                                                reservation
                                            ) && (
                                                <button
                                                    className="btn-danger btn-sm"
                                                    onClick={() =>
                                                        cancelReservation(
                                                            reservation.id
                                                        )
                                                    }
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            {isReservationModifiable(
                                                reservation
                                            ) && (
                                                <button
                                                    className="btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleModifyReservation(
                                                            reservation.id,
                                                            reservation.studio_id
                                                        )
                                                    }
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
