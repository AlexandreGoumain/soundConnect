import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STEPS_DATA, STUDIO_STEPS_DATA } from "../constants/homeConstants.js";

export default function HowItWorksSection() {
    const [activeTab, setActiveTab] = useState("artists");
    const navigate = useNavigate();

    const handleCTAClick = () => {
        if (activeTab === "artists") {
            navigate("/studios");
        } else {
            navigate("/register?role=studio");
        }
    };

    const getStepIcon = (stepId, type) => {
        if (type === "artists") {
            switch (stepId) {
                case 1:
                    return "🔍";
                case 2:
                    return "📅";
                case 3:
                    return "🎵";
                default:
                    return "•";
            }
        } else {
            switch (stepId) {
                case 1:
                    return "🏢";
                case 2:
                    return "⏰";
                case 3:
                    return "🤝";
                default:
                    return "•";
            }
        }
    };

    return (
        <section
            className="how-it-works-section"
            id="how-it-works"
            aria-labelledby="how-it-works-title"
        >
            <div className="container">
                <header className="section-header">
                    <h2 className="section-title" id="how-it-works-title">
                        Comment ça marche
                    </h2>
                    <p className="section-subtitle">
                        Découvrez comment SoundConnect facilite la connexion
                        entre artistes et studios
                    </p>
                </header>

                {/* Navigation par onglets */}
                <div
                    className="tabs-navigation"
                    role="tablist"
                    aria-label="Type d'utilisateur"
                >
                    <button
                        className={`tab-btn ${
                            activeTab === "artists" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("artists")}
                        role="tab"
                        aria-selected={activeTab === "artists"}
                        aria-controls="artists-panel"
                        id="artists-tab"
                    >
                        <span className="tab-icon" aria-hidden="true">
                            🎤
                        </span>
                        Pour les artistes
                    </button>
                    <button
                        className={`tab-btn ${
                            activeTab === "studios" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("studios")}
                        role="tab"
                        aria-selected={activeTab === "studios"}
                        aria-controls="studios-panel"
                        id="studios-tab"
                    >
                        <span className="tab-icon" aria-hidden="true">
                            🎛️
                        </span>
                        Pour les studios
                    </button>
                </div>

                {/* Contenu des onglets */}
                <div className="tab-content">
                    {activeTab === "artists" && (
                        <div
                            className="steps-container"
                            role="tabpanel"
                            id="artists-panel"
                            aria-labelledby="artists-tab"
                        >
                            <ol className="steps-grid enhanced">
                                {STEPS_DATA.map((step, index) => (
                                    <li key={step.id} className="step enhanced">
                                        <div className="step-icon-wrapper">
                                            <div
                                                className="step-number"
                                                aria-label={`Étape ${step.id}`}
                                            >
                                                {step.id}
                                            </div>
                                            <div
                                                className="step-icon"
                                                aria-hidden="true"
                                            >
                                                {getStepIcon(
                                                    step.id,
                                                    "artists"
                                                )}
                                            </div>
                                        </div>
                                        <div className="step-content">
                                            <h3 className="step-title">
                                                {step.title}
                                            </h3>
                                            <p className="step-description">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index < STEPS_DATA.length - 1 && (
                                            <div
                                                className="step-connector"
                                                aria-hidden="true"
                                            ></div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {activeTab === "studios" && (
                        <div
                            className="steps-container"
                            role="tabpanel"
                            id="studios-panel"
                            aria-labelledby="studios-tab"
                        >
                            <ol className="steps-grid enhanced">
                                {STUDIO_STEPS_DATA.map((step, index) => (
                                    <li key={step.id} className="step enhanced">
                                        <div className="step-icon-wrapper">
                                            <div
                                                className="step-number"
                                                aria-label={`Étape ${step.id}`}
                                            >
                                                {step.id}
                                            </div>
                                            <div
                                                className="step-icon"
                                                aria-hidden="true"
                                            >
                                                {getStepIcon(
                                                    step.id,
                                                    "studios"
                                                )}
                                            </div>
                                        </div>
                                        <div className="step-content">
                                            <h3 className="step-title">
                                                {step.title}
                                            </h3>
                                            <p className="step-description">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index <
                                            STUDIO_STEPS_DATA.length - 1 && (
                                            <div
                                                className="step-connector"
                                                aria-hidden="true"
                                            ></div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="cta-section">
                    <div className="cta-card">
                        <h3 className="cta-title">
                            {activeTab === "artists"
                                ? "Prêt à trouver votre studio idéal ?"
                                : "Prêt à accueillir des artistes ?"}
                        </h3>
                        <p className="cta-description">
                            {activeTab === "artists"
                                ? "Rejoignez des milliers d'artistes qui font confiance à SoundConnect pour leurs sessions d'enregistrement."
                                : "Rejoignez notre réseau de studios et développez votre activité avec SoundConnect."}
                        </p>
                        <button className="cta-button" onClick={handleCTAClick}>
                            {activeTab === "artists"
                                ? "Découvrir les studios"
                                : "Inscrire mon studio"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
