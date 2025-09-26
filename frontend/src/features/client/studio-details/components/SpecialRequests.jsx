import TextareaField from "../../../../components/shared/TextareaField";

export default function SpecialRequests({
    specialRequests,
    handleSpecialRequestsChange,
}) {
    return (
        <TextareaField
            label="Demandes spéciales (optionnel)"
            className="special-requests-input"
            value={specialRequests}
            onChange={handleSpecialRequestsChange}
            placeholder="Ex: Équipement spécifique, configuration particulière, etc."
            rows={3}
            maxLength={500}
            showCharCount={true}
        />
    );
}
