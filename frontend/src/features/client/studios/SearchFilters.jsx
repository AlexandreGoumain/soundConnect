import DateInput from "../../../components/shared/DateInput.jsx";
import InputField from "../../../components/shared/InputField.jsx";
import SectionCard from "../../../components/shared/SectionCard.jsx";
import SelectField from "../../../components/shared/SelectField.jsx";
import "../../../styles/components/_studios-list.scss";
import { useSearchFilters } from "./hooks/useSearchFilters.js";

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

    const sortOptions = [
        { value: "", label: "Pertinence" },
        { value: "price_asc", label: "Prix croissant" },
        { value: "price_desc", label: "Prix décroissant" },
        { value: "rating_desc", label: "Mieux notés" },
    ];

    return (
        <SectionCard
            title="Filtres de recherche"
            subtitle="Affinez votre recherche de studios"
            className="search-filters"
        >
            <form onSubmit={handleApply}>
                <div className="search-filters__section">
                    <h3 className="search-filters__section-title">
                        Localisation
                    </h3>
                    <div className="search-filters__row search-filters__row--two-cols">
                        <InputField
                            id="city"
                            name="city"
                            label="Ville"
                            value={filters.city}
                            onChange={handleCityChange}
                            placeholder="Paris"
                            error={fieldErrors.city}
                        />
                        <InputField
                            id="postal"
                            name="postalCode"
                            label="Code postal"
                            value={filters.postalCode}
                            onChange={handlePostalCodeChange}
                            placeholder="75001"
                            error={fieldErrors.postalCode}
                        />
                    </div>
                </div>

                <div className="search-filters__section">
                    <h3 className="search-filters__section-title">Budget</h3>
                    <div className="search-filters__row search-filters__row--two-cols">
                        <InputField
                            id="min_rate"
                            name="minRate"
                            label="Prix minimum (€/h)"
                            type="number"
                            min="0"
                            step="1"
                            value={filters.minRate}
                            onChange={handleMinRateChange}
                            placeholder="0"
                            error={fieldErrors.minRate}
                        />
                        <InputField
                            id="max_rate"
                            name="maxRate"
                            label="Prix maximum (€/h)"
                            type="number"
                            min="0"
                            step="1"
                            value={filters.maxRate}
                            onChange={handleMaxRateChange}
                            placeholder="100"
                            error={fieldErrors.maxRate}
                        />
                    </div>
                </div>

                <div className="search-filters__section">
                    <h3 className="search-filters__section-title">
                        Spécialités et équipements
                    </h3>
                    <div className="search-filters__row search-filters__row--two-cols">
                        <InputField
                            id="tags"
                            name="tags"
                            label="Tags"
                            hint="Séparés par virgules"
                            value={filters.tags}
                            onChange={handleTagsChange}
                            placeholder="mixage, batterie"
                        />
                        <InputField
                            id="equipment"
                            name="equipment"
                            label="Équipements"
                            hint="Séparés par virgules"
                            value={filters.equipment}
                            onChange={handleEquipmentChange}
                            placeholder="piano, batterie"
                        />
                    </div>
                </div>

                <div className="search-filters__section">
                    <h3 className="search-filters__section-title">
                        Disponibilité et préférences
                    </h3>
                    <div className="search-filters__row search-filters__row--grid">
                        <SelectField
                            id="sort"
                            name="sort"
                            label="Tri"
                            value={filters.sort}
                            onChange={handleSortChange}
                            options={sortOptions}
                            placeholder="Pertinence"
                        />
                        <DateInput
                            id="available_on"
                            label="Disponible le"
                            value={filters.availableOn}
                            onChange={handleAvailableOnChange}
                            min={minDate}
                            error={fieldErrors.availableOn}
                        />
                        <SelectField
                            id="duration"
                            name="duration"
                            label="Durée (h)"
                            value={filters.duration}
                            onChange={handleDurationChange}
                            options={durationOptions}
                            placeholder="Choisir une durée"
                            error={fieldErrors.duration}
                        />
                    </div>
                </div>

                <div className="search-filters__actions">
                    <button type="submit" className="btn btn-primary">
                        Appliquer les filtres
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >
                        Réinitialiser
                    </button>
                </div>
            </form>
        </SectionCard>
    );
}
