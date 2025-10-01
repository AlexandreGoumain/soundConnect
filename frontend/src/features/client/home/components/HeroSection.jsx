import InputField from "../../../../components/shared/InputField.jsx";
import { useHeroSection } from "../hooks/useHeroSection.js";

export default function HeroSection() {
    const { query, error, handleChange, handleSubmit } = useHeroSection();

    return (
        <section className="hero-section" aria-label="Recherche de studios">
            <div className="hero-content">
                <h1 className="hero-title">
                    Trouvez le studio idéal en quelques clics
                </h1>
                <p className="hero-subtitle">
                    Réservez les meilleurs studios d'enregistrement près de chez
                    vous
                </p>
                <form
                    className="search-form"
                    onSubmit={handleSubmit}
                    role="search"
                    aria-label="Rechercher un studio par localisation"
                >
                    <div className="search-input-group">
                        <InputField
                            className="search-input"
                            type="text"
                            placeholder="Ville ou code postal"
                            value={query}
                            onChange={handleChange}
                            aria-label="Ville ou code postal"
                            error={error}
                            id="hero-search"
                            name="location"
                        />
                        <button
                            className="btn btn-primary search-btn"
                            type="submit"
                            aria-label="Lancer la recherche"
                        >
                            Rechercher
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
