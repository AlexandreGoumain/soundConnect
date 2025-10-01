import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useKeyboardNavigation } from "../../../../hooks/useKeyboardNavigation.js";
import { HOME_CONSTANTS } from "../constants/homeConstants.js";
import { useStudiosCarousel } from "../hooks/useStudiosCarousel.js";
import ErrorState from "./ErrorState.jsx";
import LoadingState from "./LoadingState.jsx";
import StudioCard from "./StudioCard.jsx";

export default function StudiosSection({ studios, loading, error }) {
    const carouselRef = useRef(null);
    const {
        displayedStudios,
        canNavigate,
        hasStudios,
        showNext,
        showPrevious,
    } = useStudiosCarousel(studios, HOME_CONSTANTS.STUDIOS_DISPLAY_LIMIT);

    const isNavigationDisabled = !canNavigate || loading || Boolean(error);

    // Navigation au clavier avec les flèches
    useKeyboardNavigation({
        onPrevious: showPrevious,
        onNext: showNext,
        enabled: canNavigate && !loading && !error,
        containerRef: carouselRef,
    });

    return (
        <section className="studios-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Studios en tendance</h2>
                    <p className="sr-only">
                        Utilisez les flèches gauche et droite pour naviguer dans
                        le carrousel
                    </p>
                </div>
                <div
                    className="studios-carousel"
                    ref={carouselRef}
                    role="region"
                    aria-label="Carrousel de studios en tendance"
                    aria-live="polite"
                >
                    <button
                        className="carousel-nav carousel-prev"
                        type="button"
                        onClick={showPrevious}
                        disabled={isNavigationDisabled}
                        aria-label="Studios precedents"
                    >
                        <FaChevronLeft />
                    </button>
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : hasStudios ? (
                        <ul className="studios-grid">
                            {displayedStudios.map((studio) => (
                                <li key={studio.id}>
                                    <StudioCard studio={studio} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-studios-message">
                            Il n'y a encore aucun studio.
                        </p>
                    )}
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
