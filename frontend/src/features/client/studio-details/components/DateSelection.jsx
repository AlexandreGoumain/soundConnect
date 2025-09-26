import DateInput from "../../../../components/shared/DateInput";

export default function DateSelection({
    selectedDate,
    handleDateChange,
    getMinDate,
    getMaxDate,
}) {
    return (
        <DateInput
            label="Sélectionnez une date"
            className="date-input"
            value={selectedDate}
            onChange={handleDateChange}
            min={getMinDate()}
            max={getMaxDate()}
        />
    );
}
