import { useState } from "react";

const HomeHero = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(search);
    };

    return (
        <section className="w-full bg-muted text-white py-8 md:py-16 lg:py-24">
            <div className="w-full flex flex-col items-center max-w-6xl mx-auto px-4">
                <h1 className="font-light text-3xl md:text-4xl text-center">
                    Trouvez le studio idéal en quelques clics
                </h1>
                <p className="text-lg md:text-xl mb-6 md:mb-8 lg:mb-12 text-center">
                    Réservez les meilleurs studios d'enregistrement près de chez
                    vous
                </p>
                <div className="w-full flex flex-col md:flex-row max-w-2xl mx-auto justify-center gap-4">
                    <input
                        type="text"
                        placeholder="Ville de recherche"
                        className="p-3 rounded-lg text-gray-800 w-full md:w-1/2"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-primary-500 hover:bg-primary-600 py-3 px-6 rounded-lg transition-colors font-semibold"
                        onClick={handleSearch}
                    >
                        Rechercher
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
