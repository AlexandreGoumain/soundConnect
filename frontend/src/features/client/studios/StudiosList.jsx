import StudioCard from "../home/components/StudioCard.jsx";
import SearchFilters from "./SearchFilters.jsx";
import "../../../styles/components/_studios-list.scss";
import { useStudiosList } from "./hooks/useStudiosList.js";

export default function StudiosList() {
    const { studios, loading, error, hasStudios } = useStudiosList();

    return (
        <div className="container studios-container">
            <h2>Rechercher</h2>
            <SearchFilters />
            {loading && <p>Chargement...</p>}
            {error && (
                <p className="studios-error">Erreur: {String(error)}</p>
            )}
            {!loading && !error && (
                <div className="studios-grid">
                    {!hasStudios ? (
                        <p>Aucun studio trouvé</p>
                    ) : (
                        studios.map((s) => <StudioCard key={s.id} studio={s} />)
                    )}
                </div>
            )}
        </div>
    );
}
