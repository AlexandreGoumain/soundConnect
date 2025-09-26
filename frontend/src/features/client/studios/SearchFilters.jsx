import DateInput from "../../../components/shared/DateInput.jsx";
import SelectDropdown from "../../../components/shared/SelectDropdown.jsx";
import "../../../styles/components/_studios-list.scss";
import { useSearchFilters } from "./hooks/useSearchFilters.js";

function FieldError({ error }) {
    if (!error) return null;
    return <span className="field-error">{error}</span>;
}

export default function SearchFilters() {
    const {
        filters,
        fieldErrors,
        minDate,
        durationOptions,
        handleCityChange,
        handlePostalCodeChange,
        handleMinRateChange,
        handleMaxRateChange,
        handleTagsChange,
        handleEquipmentChange,
        handleSortChange,
        handleAvailableOnChange,
        handleDurationChange,
        handleApply,
        handleReset,
    } = useSearchFilters();

    return (
        <form className="card search-filters" onSubmit={handleApply}>
            <div className="search-filters__row search-filters__row--two-cols">
                <label className="label" htmlFor="city">
                    Ville
                    {/* TODO: use shared inputField */}
                    <input
                        id="city"
                        className={`input ${fieldErrors.city ? "error" : ""}`}
                        value={filters.city}
                        onChange={handleCityChange}
                        placeholder="Paris"
                    />
                    <FieldError error={fieldErrors.city} />
                </label>
                <label className="label" htmlFor="postal">
                    Code postal
                    <input
                        id="postal"
                        className={`input ${
                            fieldErrors.postalCode ? "error" : ""
                        }`}
                        value={filters.postalCode}
                        onChange={handlePostalCodeChange}
                        placeholder="75001"
                    />
                    <FieldError error={fieldErrors.postalCode} />
                </label>
            </div>

            <div className="search-filters__row search-filters__row--two-cols">
                <label className="label" htmlFor="min_rate">
                    Prix min (€/h)
                    <input
                        id="min_rate"
                        type="number"
                        min="0"
                        step="1"
                        className={`input ${
                            fieldErrors.minRate ? "error" : ""
                        }`}
                        value={filters.minRate}
                        onChange={handleMinRateChange}
                    />
                    <FieldError error={fieldErrors.minRate} />
                </label>
                <label className="label" htmlFor="max_rate">
                    Prix max (€/h)
                    <input
                        id="max_rate"
                        type="number"
                        min="0"
                        step="1"
                        className={`input ${
                            fieldErrors.maxRate ? "error" : ""
                        }`}
                        value={filters.maxRate}
                        onChange={handleMaxRateChange}
                    />
                    <FieldError error={fieldErrors.maxRate} />
                </label>
            </div>

            <div className="search-filters__row search-filters__row--four-cols">
                <label className="label" htmlFor="tags">
                    Tags (séparés par virgules)
                    <input
                        id="tags"
                        className="input"
                        value={filters.tags}
                        onChange={handleTagsChange}
                        placeholder="mixage, batterie"
                    />
                </label>
                <label className="label" htmlFor="equipment">
                    Équipements (séparés par virgules)
                    <input
                        id="equipment"
                        className="input"
                        value={filters.equipment}
                        onChange={handleEquipmentChange}
                        placeholder="piano, batterie"
                    />
                </label>
                <SelectDropdown
                    id="sort"
                    label="Tri"
                    value={filters.sort}
                    onChange={handleSortChange}
                    options={[
                        { value: "", label: "Pertinence" },
                        { value: "price_asc", label: "Prix croissant" },
                        { value: "price_desc", label: "Prix décroissant" },
                        { value: "rating_desc", label: "Mieux notés" },
                    ]}
                />
                <DateInput
                    id="available_on"
                    label="Disponible le"
                    value={filters.availableOn}
                    onChange={handleAvailableOnChange}
                    min={minDate}
                    error={fieldErrors.availableOn}
                />
                <SelectDropdown
                    id="duration"
                    label="Durée (h)"
                    value={filters.duration}
                    onChange={handleDurationChange}
                    options={durationOptions}
                    error={fieldErrors.duration}
                />
            </div>

            <div className="search-filters__actions">
                <button type="submit" className="btn btn-primary">
                    Appliquer
                </button>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleReset}
                >
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}
