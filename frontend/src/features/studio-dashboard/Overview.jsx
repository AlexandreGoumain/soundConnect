import { useState } from "react";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import TimeRangeChips from "./components/TimeRangeChips.jsx";
import { useOverview } from "./hooks/useOverview.js";
import { useStudioFilter } from "../../context/StudioFilterContext.jsx";

export default function Overview() {
    const { data, loading, error } = useOverview();
    const { studios = [], selectedStudio } = useStudioFilter();

    const [range, setRange] = useState("year");

    if (loading) return <div className="container">Chargement du dashboard…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;
    if (!data) return <div className="container">Aucune donnée</div>;

    const { totals, rating, upcoming } = data;

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
                            <p className="subtitle">Vue d’ensemble de l’activité de vos studios</p>
                        </div>
                        <TimeRangeChips value={range} onChange={setRange} />
                    </div>

                    {/* Studios summary for owners with multiple studios */}
                    <section className="card mb-lg">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Vos studios</h3>
                            <a className="link" href="/studio/studios">Voir tout</a>
                        </div>
                        {studios.length === 0 ? (
                            <div>Vous n'avez pas encore de studio. Créez votre premier studio.</div>
                        ) : (
                            <div className="list">
                                {studios.map((s) => (
                                    <div key={s.id} className="item">
                                        <div>
                                            <div className="primary">{s.name}</div>
                                            <div className="secondary">
                                                {(s.city || "Ville inconnue") + (s.postal_code ? " " + s.postal_code : "")} · {s.hourly_rate} €/h
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <a className="btn btn-ghost btn-sm" href={`/studio/studios/${s.id}`}>Gérer</a>
                                            <a className="btn btn-ghost btn-sm" href={`/studio/studios/${s.id}/reservations`}>Réservations</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="label">Studios</div>
                            <div className="value">{totals.total_studios}</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Réservations</div>
                            <div className="value">{totals.total_reservations}</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Revenu (€)</div>
                            <div className="value">{Number(totals.total_revenue).toFixed(2)}</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Note moyenne</div>
                            <div className="value">{(Number(rating.average) || 0).toFixed(1)}</div>
                            <div className="hint">{rating.total_reviews} avis</div>
                        </div>
                    </div>

                    <div className="content-grid">
                        <section className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3>Réservations récentes</h3>
                                <a className="link" href="/studio/reservations">Voir tout</a>
                            </div>
                            <div className="secondary" style={{ marginBottom: 8 }}>
                                Vue: {selectedStudio ? selectedStudio.name : "Tous les studios"}
                            </div>
                            {upcoming?.length === 0 ? (
                                <div>Aucune réservation à venir.</div>
                            ) : (
                                <div className="list">
                                    {upcoming.map((r) => (
                                        <div key={r.id} className="item">
                                            <div>
                                                <div className="primary">{r.studio_name}</div>
                                                <div className="secondary">
                                                    {new Date(r.start_datetime).toLocaleString()} — {new Date(r.end_datetime).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className={`badge ${r.status}`}>{r.status}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3>Messages récents</h3>
                                <a className="link" href="#">Voir tout</a>
                            </div>
                            <div>Aucun message récent.</div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

