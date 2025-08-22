import { useEffect, useState } from "react";
import { apiClient } from "../../../../lib/apiClient.js";

export const useStudios = () => {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudios = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get("/studios");
            setStudios(response.data?.data?.studios || []);
        } catch (err) {
            console.error("Failed to fetch studios:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudios();
    }, []);

    return {
        studios,
        loading,
        error,
        refetch: fetchStudios,
    };
};