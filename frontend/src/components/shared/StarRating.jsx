export default function StarRating({
    rating = 0,
    maxRating = 5,
    size = "medium",
    showNumber = false,
    interactive = false,
    onRatingChange = null,
    className = ""
}) {
    const handleStarClick = (starValue) => {
        if (interactive && onRatingChange) {
            onRatingChange(starValue);
        }
    };

    const renderStars = () => {
        const stars = [];
        const numericRating = Number(rating) || 0;
        for (let i = 1; i <= maxRating; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= numericRating ? "filled" : ""} ${
                        interactive ? "interactive" : ""
                    } ${size}`}
                    onClick={interactive ? () => handleStarClick(i) : undefined}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className={`star-rating ${className}`.trim()}>
            <div className="stars">{renderStars()}</div>
            {showNumber && (
                <span className="rating-number">{Number(rating).toFixed(1)}</span>
            )}
        </div>
    );
}