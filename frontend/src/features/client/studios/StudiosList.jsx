import "../../../styles/components/_studios-list.scss";
import StudioCard from "../home/components/StudioCard.jsx";
import { useStudiosList } from "./hooks/useStudiosList.js";
import SearchFilters from "./SearchFilters.jsx";

export default function StudiosList() {
    const {
        studios,
        loading,
        error,
        hasStudios,
        currentPage,
        totalPages,
        totalStudios,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        goToPage,
    } = useStudiosList();

    return (
        <div className="container studios-container">
            <h2>Rechercher</h2>
            <SearchFilters />
            {loading && <p>Chargement...</p>}
            {error && <p className="studios-error">Erreur: {String(error)}</p>}
            {!loading && !error && (
                <>
                    {hasStudios && (
                        <div className="studios-results-info">
                            <p>
                                {totalStudios} studio
                                {totalStudios > 1 ? "s" : ""} trouvé
                                {totalStudios > 1 ? "s" : ""} - Page{" "}
                                {currentPage} sur {totalPages}
                            </p>
                        </div>
                    )}

                    <div className="studios-grid">
                        {!hasStudios ? (
                            <p>Aucun studio trouvé</p>
                        ) : (
                            studios.map((s) => (
                                <StudioCard key={s.id} studio={s} />
                            ))
                        )}
                    </div>

                    {hasStudios && totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                onClick={prevPage}
                                disabled={!hasPrevPage}
                                className="pagination-btn"
                            >
                                ← Précédent
                            </button>

                            <div className="pagination-pages">
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`pagination-page ${
                                                currentPage === page
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={nextPage}
                                disabled={!hasNextPage}
                                className="pagination-btn"
                            >
                                Suivant →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
