import StarRating from "./StarRating.jsx";
import SelectField from "./SelectField.jsx";
import TextareaField from "./TextareaField.jsx";

export default function ReviewForm({
    newReview,
    availableReservations,
    handleReviewChange,
    handleRatingChange,
    handleSubmitReview,
    formatReservationDate
}) {
    const reservationOptions = availableReservations.map(reservation => ({
        value: reservation.id,
        label: formatReservationDate(
            reservation.start_datetime,
            reservation.end_datetime
        )
    }));

    return (
        <form className="review-form" onSubmit={handleSubmitReview}>
            <SelectField
                id="reservation"
                label="Réservation :"
                value={newReview.reservation_id}
                onChange={(e) =>
                    handleReviewChange("reservation_id", e.target.value)
                }
                options={reservationOptions}
                placeholder="Sélectionnez une réservation"
                required
            />

            <div className="form-group">
                <label>Note :</label>
                <StarRating
                    rating={newReview.rating}
                    interactive={true}
                    onRatingChange={handleRatingChange}
                />
            </div>

            <TextareaField
                id="comment"
                label="Commentaire :"
                value={newReview.comment}
                onChange={(e) =>
                    handleReviewChange("comment", e.target.value)
                }
                placeholder="Partagez votre expérience..."
                rows={4}
            />

            <button type="submit" className="btn btn-primary">
                Publier l'avis
            </button>
        </form>
    );
}