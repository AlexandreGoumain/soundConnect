import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";
import { useStudioFilter } from "../../../hooks/useStudioFilter.js";
import "../../../styles/components/_studio-dashboard.scss";

export default function DashboardSidebar() {
    const location = useLocation();
    const { user } = useAuth();
    const {
        studios = [],
        selectedStudioId,
        setSelectedStudioId,
        studiosLoading,
    } = useStudioFilter();

    const primaryStudio = studios?.[0];
    const studioName =
        (selectedStudioId
            ? studios.find((s) => String(s.id) === String(selectedStudioId))?.name
            : studios.length === 1
            ? primaryStudio?.name
            : null) || user?.username || (studios.length > 1 ? "Tous les studios" : "Studio");

    const studioEmail =
        (selectedStudioId
            ? studios.find((s) => String(s.id) === String(selectedStudioId))?.email
            : studios.length === 1
            ? primaryStudio?.email
            : null) || user?.email || "";

    const navItems = [
        { to: "/studio", label: "Tableau de bord" },
        { to: "/studio/reservations", label: "Réservations" },
        { to: "/studio/calendar", label: "Calendrier" },
        { to: "/studio/studios", label: "Profil du studio" },
    ];

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <div className="studio-title">{studioName}</div>
                {studioEmail && (
                    <div className="studio-subtitle">{studioEmail}</div>
                )}
            </div>
            <div className="form-group dashboard-sidebar__form-group">
                <label className="label" htmlFor="studio-select">
                    Sélection du studio
                </label>
                <select
                    id="studio-select"
                    className="input"
                    value={selectedStudioId ?? ""}
                    onChange={(e) => {
                        const v = e.target.value;
                        setSelectedStudioId(v === "" ? null : v);
                    }}
                    disabled={studiosLoading}
                >
                    <option value="">Tous les studios</option>
                    {studios.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={
                            "sidebar-link" +
                            (location.pathname === item.to ? " active" : "")
                        }
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
