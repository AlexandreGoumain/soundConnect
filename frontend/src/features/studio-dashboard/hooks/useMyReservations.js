import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { useToast } from "../../../context/ToastContext.jsx";

export function useMyReservations(studioId) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    const endpoint = studioId
        ? `/dashboard/studios/${studioId}/reservations`
        : "/dashboard/reservations";

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get(endpoint);
            setReservations(res.data?.data?.reservations || []);
        } catch (err) {
            setError(err.message);
            showToast("Erreur lors du chargement des réservations", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studioId]);

    return { reservations, loading, error, refetch: fetchReservations };
}

