export default function BookingActions({ selectedDate, selectedTimeSlot, isBooking, handleBookStudio }) {
    const isDisabled = !selectedDate || !selectedTimeSlot || isBooking;

    return (
        <div className="booking-actions">
            <button
                className="btn btn-primary btn-reserve"
                onClick={handleBookStudio}
                disabled={isDisabled}
            >
                {isBooking ? "Réservation en cours..." : "Réserver"}
            </button>
        </div>
    );
}