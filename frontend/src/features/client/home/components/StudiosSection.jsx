import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HOME_CONSTANTS } from "../constants/homeConstants.js";
import { useStudiosCarousel } from "../hooks/useStudiosCarousel.js";
import ErrorState from "./ErrorState.jsx";
import LoadingState from "./LoadingState.jsx";
import StudioCard from "./StudioCard.jsx";

export default function StudiosSection({ studios, loading, error }) {
    const {
        displayedStudios,
        canNavigate,
        hasStudios,
        showNext,
        showPrevious,
    } = useStudiosCarousel(studios, HOME_CONSTANTS.STUDIOS_DISPLAY_LIMIT);

    const isNavigationDisabled = !canNavigate || loading || Boolean(error);

    return (
        <section className="studios-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Studios en tendance</h2>
                </div>
                <div className="studios-carousel">
                    <button
                        className="carousel-nav carousel-prev"
                        type="button"
                        onClick={showPrevious}
                        disabled={isNavigationDisabled}
                        aria-label="Studios precedents"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="studios-grid">
                        {loading && <LoadingState />}
                        {error && <ErrorState error={error} />}
                        {!loading &&
                            !error &&
                            hasStudios &&
                            displayedStudios.map((studio) => (
                                <StudioCard key={studio.id} studio={studio} />
                            ))}
                        {!loading && !error && !hasStudios && (
                            <p className="no-studios-message">
                                Il n'y a encore aucun studio.
                            </p>
                        )}
                    </div>
                    <button
                        className="carousel-nav carousel-next"
                        type="button"
                        onClick={showNext}
                        disabled={isNavigationDisabled}
                        aria-label="Studios suivants"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
