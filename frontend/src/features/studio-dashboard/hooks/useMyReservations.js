import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast.js";
import { apiClient } from "../../../lib/apiClient.js";

export function useMyReservations(studioId) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showSuccess, showError } = useToast();

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
            showError("Erreur lors du chargement des réservations");
        } finally {
            setLoading(false);
        }
    };

    const updateReservationStatus = useCallback(
        async (reservationId, newStatus) => {
            try {
                await apiClient.put(`/reservations/${reservationId}`, {
                    status: newStatus,
                });

                showSuccess(
                    `Réservation ${
                        newStatus === "confirmed"
                            ? "confirmée"
                            : newStatus === "cancelled"
                            ? "refusée"
                            : "mise à jour"
                    } avec succès`
                );

                // Refetch sans afficher le loader
                const params = studioId ? { studio_id: studioId } : {};
                const res = await apiClient.get("/dashboard/reservations", {
                    params,
                });
                setReservations(res.data?.data?.reservations || []);
            } catch {
                showError("Erreur lors de la mise à jour de la réservation");
            }
        },
        [showSuccess, showError, studioId]
    );

    useEffect(() => {
        fetchReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studioId]);

    return {
        reservations,
        loading,
        error,
        refetch: fetchReservations,
        updateReservationStatus,
    };
}
