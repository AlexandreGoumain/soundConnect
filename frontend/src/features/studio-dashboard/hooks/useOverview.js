import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { useToast } from "../../../hooks/useToast.js";
import { useStudioFilter } from "../../../hooks/useStudioFilter.js";

export function useOverview(timeRange = "year") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();
    const { selectedStudioId } = useStudioFilter();

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                ...(selectedStudioId && { studio_id: selectedStudioId }),
                time_range: timeRange
            };
            const res = await apiClient.get("/dashboard/overview", { params });
            setData(res.data?.data || null);
        } catch (err) {
            setError(err.message);
            showToast("Erreur lors du chargement du dashboard", "error");
        } finally {
            setLoading(false);
        }
    }, [selectedStudioId, timeRange, showToast]);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return { data, loading, error, refetch: fetchOverview };
}

