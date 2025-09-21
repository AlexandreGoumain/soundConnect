import "./StarRating.scss";

const StarRating = ({
    rating,
    maxRating = 5,
    size = "medium",
    showNumber = false,
    interactive = false,
    onRatingChange = null,
}) => {
    const handleStarClick = (starValue) => {
        if (interactive && onRatingChange) {
            onRatingChange(starValue);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= maxRating; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? "filled" : ""} ${
                        interactive ? "interactive" : ""
                    } ${size}`}
                    onClick={() => handleStarClick(i)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="star-rating">
            <div className="stars">{renderStars()}</div>
            {showNumber && (
                <span className="rating-number">{rating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default StarRating;
