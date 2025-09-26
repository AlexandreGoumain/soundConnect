import BookingPrice from "./BookingPrice.jsx";
import DateSelection from "./DateSelection.jsx";
import DurationSelection from "./DurationSelection.jsx";
import SpecialRequests from "./SpecialRequests.jsx";
import TimeSlots from "./TimeSlots.jsx";
import BookingActions from "./BookingActions.jsx";

export default function StudioBookingForm({
    studio,
    selectedDate,
    selectedTimeSlot,
    selectedDuration,
    specialRequests,
    isBooking,
    availableSlots,
    availabilityLoading,
    handleDateChange,
    handleDurationChange,
    handleTimeSlotSelect,
    handleSpecialRequestsChange,
    handleBookStudio,
    formatTime,
    getTotalPrice,
    getMinDate,
    getMaxDate,
    calculateEndTime,
    getNoSlotsMessage,
}) {
    return (
        <div className="studio-booking">
            <BookingPrice
                studio={studio}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                getTotalPrice={getTotalPrice}
            />

            <div className="booking-form">
                <DateSelection
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    getMinDate={getMinDate}
                    getMaxDate={getMaxDate}
                />

                <DurationSelection
                    selectedDuration={selectedDuration}
                    handleDurationChange={handleDurationChange}
                />

                <SpecialRequests
                    specialRequests={specialRequests}
                    handleSpecialRequestsChange={handleSpecialRequestsChange}
                />

                <TimeSlots
                    selectedDate={selectedDate}
                    availabilityLoading={availabilityLoading}
                    availableSlots={availableSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    handleTimeSlotSelect={handleTimeSlotSelect}
                    formatTime={formatTime}
                    calculateEndTime={calculateEndTime}
                    selectedDuration={selectedDuration}
                    getNoSlotsMessage={getNoSlotsMessage}
                />

                <BookingActions
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    isBooking={isBooking}
                    handleBookStudio={handleBookStudio}
                />
            </div>
        </div>
    );
}
