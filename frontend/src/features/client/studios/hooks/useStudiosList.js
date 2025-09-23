import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../../../lib/apiClient.js";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export function useStudiosList() {
    const queryParams = useQuery();

    // State
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Parse search parameters for API call
    const searchParams = useMemo(() => {
        const params = {};
        const paramKeys = ["city", "postal_code", "min_rate", "max_rate", "tags", "sort", "equipment", "available_on", "duration"];

        paramKeys.forEach(key => {
            const value = queryParams.get(key);
            if (value) {
                params[key] = value;
            }
        });

        return params;
    }, [queryParams]);

    // Fetch studios data
    useEffect(() => {
        const fetchStudios = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await apiClient.get("/studios", { params: searchParams });
                setStudios(data?.data?.studios || []);
            } catch (err) {
                setError(err?.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();
    }, [searchParams]);

    return {
        // State
        studios,
        loading,
        error,
        hasStudios: studios.length > 0,

        // Computed values
        studiosCount: studios.length,
    };
}