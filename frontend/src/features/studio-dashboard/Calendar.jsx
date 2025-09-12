import DashboardSidebar from "./components/DashboardSidebar.jsx";
import { useStudioFilter } from "../../context/StudioFilterContext.jsx";

export default function Calendar() {
    const { selectedStudio } = useStudioFilter();
    return (
        <div className="container studio-dashboard">
            <div className="dashboard-layout">
                <div className="dashboard-layout-sidebar">
                    <DashboardSidebar />
                </div>
                <div className="dashboard-layout-main">
                    <div className="dashboard-header">
                        <h1 className="title">
                            {selectedStudio ? `Calendrier — ${selectedStudio.name}` : "Calendrier — Tous les studios"}
                        </h1>
                    </div>
                    <section className="card">
                        <div>Calendrier à venir.</div>
                    </section>
                </div>
            </div>
        </div>
    );
}

