import { useHeroSection } from "../hooks/useHeroSection.js";

export default function HeroSection() {
    const { query, error, handleChange, handleSubmit } = useHeroSection();

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    Trouvez le studio idéal en quelques clics
                </h1>
                <p className="hero-subtitle">
                    Réservez les meilleurs studios d'enregistrement près de chez
                    vous
                </p>
                <form className="search-form" onSubmit={handleSubmit}>
                    <div className="search-input-group">
                        {/* TODO: use shared inputField */}
                        <input
                            className={`search-input ${error ? "error" : ""}`}
                            type="text"
                            placeholder="Ville ou code postal"
                            value={query}
                            onChange={handleChange}
                            aria-label="Ville ou code postal"
                        />
                        <button
                            className="btn btn-primary search-btn"
                            type="submit"
                        >
                            Rechercher
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </section>
    );
}
