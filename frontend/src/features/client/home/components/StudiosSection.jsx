import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HOME_CONSTANTS } from "../constants/homeConstants.js";
import ErrorState from "./ErrorState.jsx";
import LoadingState from "./LoadingState.jsx";
import StudioCard from "./StudioCard.jsx";
export default function StudiosSection({ studios, loading, error }) {
    const displayedStudios = studios.slice(
        0,
        HOME_CONSTANTS.STUDIOS_DISPLAY_LIMIT
    );

    return (
        <section className="studios-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Studios Mis en Avant</h2>
                </div>
                <div className="studios-carousel">
                    <button className="carousel-nav carousel-prev">
                        <FaChevronLeft />
                    </button>
                    <div className="studios-grid">
                        {loading && <LoadingState />}
                        {error && <ErrorState error={error} />}
                        {!loading &&
                            !error &&
                            studios.length > 0 &&
                            displayedStudios.map((studio) => (
                                <StudioCard key={studio.id} studio={studio} />
                            ))}
                        {!loading &&
                            !error &&
                            studios.length === 0 && (
                                <p className="no-studios-message">
                                    Il n'y a encore aucun studio.
                                </p>
                            )}
                    </div>
                    <button className="carousel-nav carousel-next">
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
