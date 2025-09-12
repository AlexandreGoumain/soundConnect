import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        const isPostal = /^\d{4,5}$/.test(trimmed);
        const qs = new URLSearchParams(
            isPostal ? { postal_code: trimmed } : { city: trimmed }
        );
        navigate(`/studios?${qs.toString()}`);
    };

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">Trouvez le studio idéal en quelques clics</h1>
                <p className="hero-subtitle">
                    Réservez les meilleurs studios d'enregistrement près de chez vous
                </p>
                <form className="search-form" onSubmit={onSubmit}>
                    <div className="search-input-group">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Ville ou code postal"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Ville ou code postal"
                        />
                        <button className="btn btn-primary search-btn" type="submit">
                            Rechercher
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

