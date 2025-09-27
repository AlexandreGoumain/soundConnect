import StarRating from "./StarRating.jsx";

export default function ReviewStats({ stats }) {
    if (!stats) return null;

    return (
        <div className="review-stats">
            <div className="average-rating">
                <span className="rating-number">
                    {stats.average_rating?.toFixed(1) || "0.0"}
                </span>
                <StarRating rating={Math.round(stats.average_rating || 0)} />
                <span className="total-reviews">
                    ({stats.total_reviews} avis)
                </span>
            </div>
        </div>
    );
}