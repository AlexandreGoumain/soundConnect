import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudioFilter } from "../../hooks/useStudioFilter.js";
import "../../styles/components/_studio-dashboard.scss";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import { useMyStudios } from "./hooks/useMyStudios.js";

export default function MyStudios() {
    const { studios, loading, error } = useMyStudios();
    const { selectedStudioId } = useStudioFilter();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedStudioId && studios.length > 0) {
            const selectedStudio = studios.find(
                (s) => String(s.id) === String(selectedStudioId)
            );
            if (selectedStudio) {
                navigate(`/studio/studios/${selectedStudioId}`);
            }
        }
    }, [selectedStudioId, studios, navigate]);

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
                        <h1 className="title">Mes studios</h1>
                        <Link
                            className="btn btn-primary-light"
                            to="/studio/studios/new"
                        >
                            Nouveau studio
                        </Link>
                    </div>

                    {studios.length === 0 ? (
                        <div className="card">
                            Vous n’avez pas encore de studio. Créez votre
                            premier studio.
                        </div>
                    ) : (
                        <div className="content-grid">
                            <section className="card">
                                <div className="list">
                                    {studios.map((s) => (
                                        <div key={s.id} className="item">
                                            <div>
                                                <div className="primary">
                                                    {s.name}
                                                </div>
                                                <div className="secondary">
                                                    {s.city} • {s.hourly_rate}{" "}
                                                    €/h
                                                </div>
                                            </div>
                                            <div className="my-studios__action-buttons">
                                                <Link
                                                    className="btn btn-ghost btn-sm"
                                                    to={`/studio/studios/${s.id}`}
                                                >
                                                    Gérer
                                                </Link>
                                                <Link
                                                    className="btn btn-ghost btn-sm"
                                                    to={`/studio/studios/${s.id}/reservations`}
                                                >
                                                    Réservations
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
