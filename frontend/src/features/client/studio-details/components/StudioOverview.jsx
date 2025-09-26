export default function StudioOverview({ studio, formatAddress }) {
    return (
        <div className="studio-overview">
            <h1 className="studio-name">{studio.name}</h1>
            <div className="studio-meta">
                <span className="studio-location">
                    {formatAddress()}
                </span>
                <span className="studio-rating">
                    {studio.review_stats?.average_rating
                        ? studio.review_stats.average_rating.toFixed(1)
                        : "N/A"}{" "}
                    ({studio.review_stats?.total_reviews || 0} avis)
                </span>
            </div>

            {/* Tags/Badges */}
            {studio.tags && (
                <div className="studio-badges">
                    {studio.tags.split(",").map((tag, index) => (
                        <span key={index} className="badge">
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}