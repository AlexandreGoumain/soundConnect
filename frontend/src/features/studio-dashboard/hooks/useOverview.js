import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { useToast } from "../../../context/ToastContext.jsx";

export function useOverview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    const fetchOverview = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/dashboard/overview");
            setData(res.data?.data || null);
        } catch (err) {
            setError(err.message);
            showToast("Erreur lors du chargement du dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    return { data, loading, error, refetch: fetchOverview };
}

