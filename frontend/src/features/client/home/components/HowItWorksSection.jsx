import { STEPS_DATA } from "../constants/homeConstants.js";

export default function HowItWorksSection() {
    return (
        <section className="how-it-works-section">
            <div className="container">
                <h2 className="section-title">Comment ça marche</h2>
                <div className="steps-grid">
                    {STEPS_DATA.map((step) => (
                        <div key={step.id} className="step">
                            <div className="step-number">{step.id}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}