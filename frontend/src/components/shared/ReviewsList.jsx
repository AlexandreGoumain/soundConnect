import ReviewItem from "./ReviewItem.jsx";

export default function ReviewsList({ reviews, formatDate, formatReservationDate }) {
    if (reviews.length === 0) {
        return <p className="no-reviews">Aucun avis pour le moment</p>;
    }

    return (
        <div className="reviews-list">
            {reviews.map((review) => (
                <ReviewItem
                    key={review.id}
                    review={review}
                    formatDate={formatDate}
                    formatReservationDate={formatReservationDate}
                />
            ))}
        </div>
    );
}