import StarRating from "./StarRating.jsx";

export default function ReviewItem({ review, formatDate, formatReservationDate }) {
    return (
        <div className="review-item">
            <div className="review-header">
                <div className="reviewer-info">
                    <span className="reviewer-name">
                        {review.first_name} {review.last_name}
                    </span>
                    <span className="review-date">
                        {formatDate(review.created_at)}
                    </span>
                    <span className="reservation-date">
                        Réservation:{" "}
                        {formatReservationDate(
                            review.start_datetime,
                            review.end_datetime
                        )}
                    </span>
                </div>
                <StarRating rating={review.rating} />
            </div>
            {review.comment && (
                <p className="review-comment">
                    {review.comment}
                </p>
            )}
        </div>
    );
}