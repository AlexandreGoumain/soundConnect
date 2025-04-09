import "./Hero.scss";

export default function Hero() {
    return (
        <div className="hero">
            <section>
                <h2>
                    Trouvez le studio idéal{" "}
                    <span className="mobile-break"></span> en quelques clics
                </h2>
                <p>
                    Réservez les meilleurs studios d'enregistrement près de chez
                    vous
                </p>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Type de studio"
                        className="search-input"
                    />
                    <div className="buttons-container">
                        <button className="search-button primary">
                            Rechercher
                        </button>
                        <button className="search-button secondary">
                            Rechercher
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
