import StarRating from "./StarRating.jsx";

export default function ReviewStats({ stats }) {
    if (!stats) return null;

    const avgRating = Number(stats.average_rating) || 0;

    return (
        <div className="review-stats">
            <div className="average-rating">
                <span className="rating-number">
                    {avgRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(avgRating)} />
                <span className="total-reviews">
                    ({stats.total_reviews || 0} avis)
                </span>
            </div>
        </div>
    );
}