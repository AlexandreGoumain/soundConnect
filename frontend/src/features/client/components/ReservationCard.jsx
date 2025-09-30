export default function ReservationCard({
    reservation,
    expandedDetails,
    onToggleDetails,
    onCancelReservation,
    onModifyReservation,
    onLeaveReview,
    formatDateTime,
    calculateDuration,
    getStatusLabel,
    getStatusIcon,
    isReservationModifiable,
    isReservationCancellable,
    canLeaveReview
}) {
    const startFormat = formatDateTime(reservation.start_datetime);
    const endFormat = formatDateTime(reservation.end_datetime);
    const duration = calculateDuration(reservation.start_datetime, reservation.end_datetime);
    const isExpanded = expandedDetails.has(reservation.id);

    return (
        <div className="reservation-card">
            <div className="reservation-card__header">
                <div className="reservation-card__studio-info">
                    <h3 className="reservation-card__studio-name">
                        {reservation.studio_name}
                    </h3>
                    <span className={`reservation-card__status-badge reservation-card__status-badge--${reservation.status}`}>
                        <span className="reservation-card__status-icon">
                            {getStatusIcon(reservation.status)}
                        </span>
                        {getStatusLabel(reservation.status)}
                    </span>
                </div>
                <div className="reservation-card__id">
                    Réservation #{reservation.id.slice(-8)}
                </div>
            </div>

            <div className="reservation-card__content">
                <div className="reservation-card__datetime">
                    <div className="reservation-card__date-info">
                        <div className="reservation-card__date">
                            {startFormat.date}
                        </div>
                        <div className="reservation-card__time-range">
                            {startFormat.time} - {endFormat.time}
                            <span className="reservation-card__duration">
                                ({duration})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="reservation-card__studio-details">
                    <div className="reservation-card__address">
                        {reservation.studio_address}
                    </div>
                    {reservation.studio_city && (
                        <div className="reservation-card__city">
                            {reservation.studio_city}
                        </div>
                    )}
                </div>

                {reservation.special_requests && isExpanded && (
                    <div className="reservation-card__special-requests">
                        <div className="reservation-card__requests-label">
                            Demandes spéciales :
                        </div>
                        <div className="reservation-card__requests-content">
                            {reservation.special_requests}
                        </div>
                    </div>
                )}
            </div>

            <div className="reservation-card__footer">
                {reservation.total_price && (
                    <div className="reservation-card__price">
                        {reservation.total_price}€
                    </div>
                )}

                <div className="reservation-card__actions">
                    {reservation.special_requests && (
                        <button
                            className="reservation-card__btn reservation-card__btn--secondary"
                            onClick={() => onToggleDetails(reservation.id)}
                        >
                            {isExpanded ? "Masquer détails" : "Voir détails"}
                        </button>
                    )}

                    {canLeaveReview && canLeaveReview(reservation) && (
                        <button
                            className="reservation-card__btn reservation-card__btn--success"
                            onClick={() => onLeaveReview(reservation)}
                        >
                            ⭐ Laisser un avis
                        </button>
                    )}

                    {isReservationCancellable(reservation) && (
                        <button
                            className="reservation-card__btn reservation-card__btn--danger"
                            onClick={() => onCancelReservation(reservation.id)}
                        >
                            Annuler
                        </button>
                    )}

                    {isReservationModifiable(reservation) && (
                        <button
                            className="reservation-card__btn reservation-card__btn--primary"
                            onClick={() => onModifyReservation(reservation.id, reservation.studio_id)}
                        >
                            Modifier
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}