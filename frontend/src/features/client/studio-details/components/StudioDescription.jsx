export default function StudioDescription({ description }) {
    return (
        <div className="studio-description">
            <h2>Description</h2>
            <p>
                {description || "Aucune description disponible."}
            </p>
        </div>
    );
}