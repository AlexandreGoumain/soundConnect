export default function TimeSlots({
    selectedDate,
    availabilityLoading,
    availableSlots,
    selectedTimeSlot,
    handleTimeSlotSelect,
    formatTime,
    calculateEndTime,
    selectedDuration,
    getNoSlotsMessage
}) {
    if (!selectedDate) return null;

    return (
        <div className="time-slots">
            {availabilityLoading ? (
                <div className="loading-slots">
                    Chargement des créneaux...
                </div>
            ) : availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                    <button
                        key={index}
                        className={`time-slot ${
                            selectedTimeSlot === slot.start_time ? "selected" : ""
                        }`}
                        onClick={() => handleTimeSlotSelect(slot.start_time)}
                    >
                        <div className="time-slot-content">
                            <span className="start-time">
                                {formatTime(slot.start_time)}
                            </span>
                            <span className="end-time">
                                -{" "}
                                {calculateEndTime(slot.start_time, selectedDuration)}
                            </span>
                        </div>
                    </button>
                ))
            ) : (
                <div className="no-slots">
                    {getNoSlotsMessage()}
                </div>
            )}
        </div>
    );
}