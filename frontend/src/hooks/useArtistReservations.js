import { useEffect, useState } from "react";
import { useAuth } from "./useAuth.js";
import { useToast } from "./useToast.js";
import { apiClient } from "../lib/apiClient.js";

export function useArtistReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchReservations = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get(`/reservations/user/${user.id}`);
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
    }, [user?.id]);

    return { reservations, loading, error, refetch: fetchReservations };
}