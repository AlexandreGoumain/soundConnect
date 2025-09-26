import DashboardSidebar from "./components/DashboardSidebar.jsx";
import { useStudioFilter } from "../../hooks/useStudioFilter.js";

export default function Messages() {
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
                            {selectedStudio ? `Messages — ${selectedStudio.name}` : "Messages — Tous les studios"}
                        </h1>
                    </div>
                    <section className="card">
                        <div>Aucun message pour le moment.</div>
                    </section>
                </div>
            </div>
        </div>
    );
}

