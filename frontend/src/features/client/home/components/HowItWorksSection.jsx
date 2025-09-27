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
        <section className="how-it-works-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Comment ça marche</h2>
                    <p className="section-subtitle">
                        Découvrez comment SoundConnect facilite la connexion
                        entre artistes et studios
                    </p>
                </div>

                {/* Navigation par onglets */}
                <div className="tabs-navigation">
                    <button
                        className={`tab-btn ${
                            activeTab === "artists" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("artists")}
                    >
                        <span className="tab-icon">🎤</span>
                        Pour les artistes
                    </button>
                    <button
                        className={`tab-btn ${
                            activeTab === "studios" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("studios")}
                    >
                        <span className="tab-icon">🎛️</span>
                        Pour les studios
                    </button>
                </div>

                {/* Contenu des onglets */}
                <div className="tab-content">
                    {activeTab === "artists" && (
                        <div className="steps-container">
                            <div className="steps-grid enhanced">
                                {STEPS_DATA.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className="step enhanced"
                                    >
                                        <div className="step-icon-wrapper">
                                            <div className="step-number">
                                                {step.id}
                                            </div>
                                            <div className="step-icon">
                                                {getStepIcon(
                                                    step.id,
                                                    "artists"
                                                )}
                                            </div>
                                        </div>
                                        <div className="step-content">
                                            <h4 className="step-title">
                                                {step.title}
                                            </h4>
                                            <p className="step-description">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index < STEPS_DATA.length - 1 && (
                                            <div className="step-connector"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "studios" && (
                        <div className="steps-container">
                            <div className="steps-grid enhanced">
                                {STUDIO_STEPS_DATA.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className="step enhanced"
                                    >
                                        <div className="step-icon-wrapper">
                                            <div className="step-number">
                                                {step.id}
                                            </div>
                                            <div className="step-icon">
                                                {getStepIcon(
                                                    step.id,
                                                    "studios"
                                                )}
                                            </div>
                                        </div>
                                        <div className="step-content">
                                            <h4 className="step-title">
                                                {step.title}
                                            </h4>
                                            <p className="step-description">
                                                {step.description}
                                            </p>
                                        </div>
                                        {index <
                                            STUDIO_STEPS_DATA.length - 1 && (
                                            <div className="step-connector"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
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
