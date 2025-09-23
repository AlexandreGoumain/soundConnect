import { useState } from "react";
import { useStudioFilter } from "../../hooks/useStudioFilter.js";
import "../../styles/components/_studio-dashboard.scss";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import TimeRangeChips from "./components/TimeRangeChips.jsx";
import { useOverview } from "./hooks/useOverview.js";

export default function Overview() {
    const [range, setRange] = useState("year");
    const { data, loading, error } = useOverview(range);
    const { selectedStudio } = useStudioFilter();

    if (loading)
        return <div className="container">Chargement du dashboard…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;
    if (!data) return <div className="container">Aucune donnée</div>;

    const { totals, rating, upcoming, reservations_by_status } = data;

    // Organiser les réservations par statut
    const reservationsByStatus = {
        pending: upcoming.filter(r => r.status === 'pending'),
        confirmed: upcoming.filter(r => r.status === 'confirmed'),
        completed: upcoming.filter(r => r.status === 'completed'),
        cancelled: upcoming.filter(r => r.status === 'cancelled')
    };

    const statusLabels = {
        pending: 'En attente',
        confirmed: 'Confirmées',
        completed: 'Terminées',
        cancelled: 'Annulées'
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
                            <h1 className="title">Tableau de bord</h1>
                            <p className="subtitle">
                                Vue d'ensemble de l'activité de vos studios
                            </p>
                        </div>
                        <TimeRangeChips value={range} onChange={setRange} />
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="label">Studios</div>
                            <div className="value">{totals.total_studios}</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Réservations</div>
                            <div className="value">
                                {totals.total_reservations}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Revenu (€)</div>
                            <div className="value">
                                {Number(totals.total_revenue).toFixed(2)}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Note moyenne</div>
                            <div className="value">
                                {(Number(rating.average) || 0).toFixed(1)}
                            </div>
                            <div className="hint">
                                {rating.total_reviews} avis
                            </div>
                        </div>
                    </div>

                    <div className="reservations-section">
                        <h2 className="section-title">Réservations par statut</h2>
                        <div className="reservations-grid">
                            {Object.entries(reservationsByStatus).map(([status, reservations]) => (
                                <div key={status} className="reservation-status-card">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            {statusLabels[status]}
                                        </h3>
                                        <span className={`count-badge ${status}`}>
                                            {reservations.length}
                                        </span>
                                    </div>
                                    <div className="reservation-list">
                                        {reservations.length === 0 ? (
                                            <p className="no-reservations">Aucune réservation</p>
                                        ) : (
                                            reservations.slice(0, 5).map(reservation => (
                                                <div key={reservation.id} className="reservation-item">
                                                    <div className="reservation-info">
                                                        <span className="client-name">
                                                            {reservation.first_name} {reservation.last_name}
                                                        </span>
                                                        <span className="studio-name">
                                                            {reservation.studio_name}
                                                        </span>
                                                    </div>
                                                    <div className="reservation-time">
                                                        {new Date(reservation.start_datetime).toLocaleDateString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {reservations.length > 5 && (
                                            <div className="see-more">
                                                +{reservations.length - 5} autres
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
