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
            <h1>Rechercher un studio</h1>
            <SearchFilters />
            {loading && (
                <p role="status" aria-live="polite">
                    Chargement...
                </p>
            )}
            {error && (
                <p role="alert" className="studios-error">
                    Erreur: {String(error)}
                </p>
            )}
            {!loading && !error && (
                <>
                    {hasStudios && (
                        <div
                            className="studios-results-info"
                            role="status"
                            aria-live="polite"
                        >
                            <p>
                                {totalStudios} studio
                                {totalStudios > 1 ? "s" : ""} trouvé
                                {totalStudios > 1 ? "s" : ""} - Page{" "}
                                {currentPage} sur {totalPages}
                            </p>
                        </div>
                    )}

                    {hasStudios ? (
                        <ul className="studios-grid">
                            {studios.map((s) => (
                                <li key={s.id}>
                                    <StudioCard studio={s} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p role="status">Aucun studio trouvé</p>
                    )}

                    {hasStudios && totalPages > 1 && (
                        <nav
                            aria-label="Pagination des résultats"
                            className="pagination-controls"
                        >
                            <button
                                onClick={prevPage}
                                disabled={!hasPrevPage}
                                className="pagination-btn"
                                aria-label="Page précédente"
                            >
                                ← Précédent
                            </button>

                            <div className="pagination-pages" role="list">
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
                                            aria-label={`Page ${page}`}
                                            aria-current={
                                                currentPage === page
                                                    ? "page"
                                                    : undefined
                                            }
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
                                aria-label="Page suivante"
                            >
                                Suivant →
                            </button>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}
