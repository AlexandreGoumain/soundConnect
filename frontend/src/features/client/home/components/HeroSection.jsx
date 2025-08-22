export default function HeroSection() {
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

                <div className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Entrez une ville..."
                        />
                        <button className="btn btn-primary-light search-btn">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}