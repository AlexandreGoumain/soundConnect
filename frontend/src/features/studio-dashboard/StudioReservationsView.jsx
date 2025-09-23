import { useParams } from "react-router-dom";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import { useMyReservations } from "./hooks/useMyReservations.js";
import { useStudioFilter } from "../../context/StudioFilterContext.jsx";
import "../../styles/components/_studio-dashboard.scss";

export default function StudioReservationsView({ all = false }) {
    const params = useParams();
    const { selectedStudioId, selectedStudio } = useStudioFilter();
    const studioId = all ? selectedStudioId : params.id;

    const { reservations, loading, error } = useMyReservations(studioId);

    if (loading) return <div className="container">Chargement…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;

    return (
        <div className="container studio-dashboard">
            <div className="dashboard-layout">
                <div className="dashboard-layout-sidebar">
                    <DashboardSidebar />
                </div>
                <div className="dashboard-layout-main">
                    <div className="dashboard-header">
                        <h1 className="title">
                            {all
                                ? selectedStudio
                                    ? `Réservations — ${selectedStudio.name}`
                                    : "Réservations — Tous les studios"
                                : "Réservations du studio"}
                        </h1>
                    </div>
                    {reservations.length === 0 ? (
                        <div className="card">Aucune réservation pour le moment.</div>
                    ) : (
                        <div className="cards-grid">
                            {reservations.map((r) => (
                                <section key={r.id} className="card reservation-card">
                                    <div className="primary studio-reservations__header">
                                        <span>{r.studio_name}</span>
                                        <span className={`badge ${r.status}`}>{r.status}</span>
                                    </div>
                                    <div className="secondary">
                                        {new Date(r.start_datetime).toLocaleString()} — {new Date(r.end_datetime).toLocaleString()}
                                    </div>
                                    <div className="secondary">
                                        {r.first_name} {r.last_name} ({r.username}) — {r.user_email}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

