import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast.js";
import { apiClient } from "../../../lib/apiClient.js";

export function useMyReservations(studioId) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = studioId ? { studio_id: studioId } : {};
            const res = await apiClient.get("/dashboard/reservations", {
                params,
            });
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
