import { useGetStudiosQuery } from "../services/index";

export default function StudioList() {
    // Utilisation du hook généré par RTK Query
    const { data: studios, isLoading, isError, error } = useGetStudiosQuery();

    if (isLoading) {
        return <div className="loading">Chargement des studios...</div>;
    }

    if (isError) {
        return (
            <div className="error">
                Erreur:{" "}
                {error.message ||
                    "Une erreur s'est produite lors du chargement des studios."}
            </div>
        );
    }

    return (
        <div className="studio-list-container">
            <h1>Liste des Studios</h1>
            <div className="studio-grid">
                {studios?.map((studio) => (
                    <div key={studio._id} className="studio-card">
                        <h2>{studio.name}</h2>
                        <p className="studio-location">{studio.location}</p>
                        <p className="studio-description">
                            {studio.description}
                        </p>
                        <div className="studio-price">
                            <span>Prix: {studio.pricePerHour}€/heure</span>
                        </div>
                    </div>
                ))}
                {studios?.length === 0 && (
                    <p className="no-studios">
                        Aucun studio disponible pour le moment.
                    </p>
                )}
            </div>
        </div>
    );
}
