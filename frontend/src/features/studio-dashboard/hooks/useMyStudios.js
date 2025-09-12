import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { useToast } from "../../../context/ToastContext.jsx";

export function useMyStudios() {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    const fetchMyStudios = async () => {
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
    };

    useEffect(() => {
        fetchMyStudios();
    }, []);

    return { studios, loading, error, refetch: fetchMyStudios };
}

