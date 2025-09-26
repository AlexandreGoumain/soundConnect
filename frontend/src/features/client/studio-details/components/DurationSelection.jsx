import SelectDropdown from "../../../../components/shared/SelectDropdown";
("");

export default function DurationSelection({
    selectedDuration,
    handleDurationChange,
}) {
    const durationOptions = [1, 2, 3, 4, 5, 6, 8].map((duration) => ({
        value: duration,
        label: `${duration} heure${duration > 1 ? "s" : ""}`,
    }));

    return (
        <SelectDropdown
            label="Durée de la réservation"
            className="duration-select"
            value={selectedDuration}
            onChange={handleDurationChange}
            options={durationOptions}
        />
    );
}
