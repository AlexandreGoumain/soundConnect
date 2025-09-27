import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateSearchFilters } from "../../../../lib/validation/formValidators.js";
import { getTodayISO } from "../../../../lib/dateUtils.js";

export function useSearchFilters() {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse URL parameters
    const queryParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    // Form state
    const [filters, setFilters] = useState({
        city: "",
        postalCode: "",
        minRate: "",
        maxRate: "",
        tags: "",
        equipment: "",
        sort: "",
        availableOn: "",
        duration: "1",
    });

    // Validation state
    const [fieldErrors, setFieldErrors] = useState({});

    // Initialize form state from URL parameters
    useEffect(() => {
        setFilters({
            city: queryParams.get("city") || "",
            postalCode: queryParams.get("postal_code") || "",
            minRate: queryParams.get("min_rate") || "",
            maxRate: queryParams.get("max_rate") || "",
            tags: queryParams.get("tags") || "",
            equipment: queryParams.get("equipment") || "",
            sort: queryParams.get("sort") || "",
            availableOn: queryParams.get("available_on") || "",
            duration: queryParams.get("duration") || "1",
        });
    }, [queryParams]);

    // Individual field handlers
    const updateFilter = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCityChange = (e) => updateFilter("city", e.target.value);
    const handlePostalCodeChange = (e) =>
        updateFilter("postalCode", e.target.value);
    const handleMinRateChange = (e) => updateFilter("minRate", e.target.value);
    const handleMaxRateChange = (e) => updateFilter("maxRate", e.target.value);
    const handleTagsChange = (e) => updateFilter("tags", e.target.value);
    const handleEquipmentChange = (e) =>
        updateFilter("equipment", e.target.value);
    const handleSortChange = (e) => updateFilter("sort", e.target.value);
    const handleAvailableOnChange = (e) =>
        updateFilter("availableOn", e.target.value);
    const handleDurationChange = (e) =>
        updateFilter("duration", e.target.value);

    // Form validation
    const validateForm = () => {
        const { errors, isValid } = validateSearchFilters(filters);
        setFieldErrors(errors);
        return isValid;
    };

    // Form submission
    const handleApply = (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            return;
        }

        const params = new URLSearchParams();

        // Add non-empty parameters to URL
        Object.entries({
            city: filters.city.trim(),
            postal_code: filters.postalCode.trim(),
            min_rate: filters.minRate,
            max_rate: filters.maxRate,
            tags: filters.tags.trim(),
            equipment: filters.equipment.trim(),
            sort: filters.sort,
            available_on: filters.availableOn,
            duration: filters.duration,
        }).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        navigate(`/studios?${params.toString()}`);
    };

    // Reset form
    const handleReset = () => {
        setFilters({
            city: "",
            postalCode: "",
            minRate: "",
            maxRate: "",
            tags: "",
            equipment: "",
            sort: "",
            availableOn: "",
            duration: "1",
        });
        setFieldErrors({});
        navigate("/studios");
    };

    // Generate min date for availableOn field
    const minDate = useMemo(() => {
        return getTodayISO();
    }, []);

    // Generate duration options
    const durationOptions = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            value: i + 1,
            label: `${i + 1}h`,
        }));
    }, []);

    return {
        // State
        filters,
        fieldErrors,
        minDate,
        durationOptions,

        // Handlers
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
        validateForm,
    };
}
