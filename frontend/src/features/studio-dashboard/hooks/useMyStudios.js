import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { useToast } from "../../../hooks/useToast.js";

export function useMyStudios() {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    const fetchMyStudios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/dashboard/studios");
            setStudios(res.data?.data?.studios || []);
        } catch (err) {
            setError(err.message);
            showToast("Erreur lors du chargement de vos studios", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchMyStudios();
    }, [fetchMyStudios]);

    return { studios, loading, error, refetch: fetchMyStudios };
}

