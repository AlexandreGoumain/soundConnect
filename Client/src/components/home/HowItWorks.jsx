import React from "react";

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            title: "Recherchez",
            description: "Trouvez le studio parfait selon vos critères",
        },
        {
            number: 2,
            title: "Réservez",
            description: "Choisissez vos créneaux et réservez en ligne",
        },
        {
            number: 3,
            title: "Créez",
            description:
                "Profitez d'un studio professionnel pour votre musique",
        },
    ];

    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Comment ça marche
            </h2>

            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                            {step.number}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
