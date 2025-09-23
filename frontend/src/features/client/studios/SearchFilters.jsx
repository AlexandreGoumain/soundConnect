import "../../../styles/components/_studios-list.scss";
import { useSearchFilters } from "./hooks/useSearchFilters.js";

export default function SearchFilters() {
    const {
        filters,
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
        <form
            className="card search-filters"
            onSubmit={handleApply}
        >
            <div className="search-filters__row search-filters__row--two-cols">
                <label className="label" htmlFor="city">
                    Ville
                    <input
                        id="city"
                        className="input"
                        value={filters.city}
                        onChange={handleCityChange}
                        placeholder="Paris"
                    />
                </label>
                <label className="label" htmlFor="postal">
                    Code postal
                    <input
                        id="postal"
                        className="input"
                        value={filters.postalCode}
                        onChange={handlePostalCodeChange}
                        placeholder="75001"
                    />
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
                        className="input"
                        value={filters.minRate}
                        onChange={handleMinRateChange}
                    />
                </label>
                <label className="label" htmlFor="max_rate">
                    Prix max (€/h)
                    <input
                        id="max_rate"
                        type="number"
                        min="0"
                        step="1"
                        className="input"
                        value={filters.maxRate}
                        onChange={handleMaxRateChange}
                    />
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
                <label className="label" htmlFor="sort">
                    Tri
                    <select
                        id="sort"
                        className="input"
                        value={filters.sort}
                        onChange={handleSortChange}
                    >
                        <option value="">Pertinence</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="rating_desc">Mieux notés</option>
                    </select>
                </label>
                <label className="label" htmlFor="available_on">
                    Disponible le
                    <input
                        id="available_on"
                        type="date"
                        className="input"
                        value={filters.availableOn}
                        onChange={handleAvailableOnChange}
                        min={minDate}
                    />
                </label>
                <label className="label" htmlFor="duration">
                    Durée (h)
                    <select
                        id="duration"
                        className="input"
                        value={filters.duration}
                        onChange={handleDurationChange}
                    >
                        {durationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="search-filters__actions">
                <button type="submit" className="btn btn-primary">
                    Appliquer
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}


