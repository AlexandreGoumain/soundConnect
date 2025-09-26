export default function BookingPrice({ studio, selectedDate, selectedTimeSlot, getTotalPrice }) {
    return (
        <div className="booking-price">
            <div className="price-info">
                <span className="hourly-rate">
                    {parseFloat(studio.hourly_rate).toFixed(0)}€/h
                </span>
                {selectedDate && selectedTimeSlot && (
                    <span className="total-price">
                        Total: {getTotalPrice().toFixed(0)}€
                    </span>
                )}
            </div>
        </div>
    );
}