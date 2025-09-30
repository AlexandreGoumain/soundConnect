import { useCallback, useEffect, useState } from "react";
import { useStudioFilter } from "../../../hooks/useStudioFilter.js";
import { useToast } from "../../../hooks/useToast.js";
import { apiClient } from "../../../lib/apiClient.js";

export function useOverview(timeRange = "year") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showSuccess, showError } = useToast();
    const { selectedStudioId } = useStudioFilter();

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                ...(selectedStudioId && { studio_id: selectedStudioId }),
                time_range: timeRange,
            };
            const res = await apiClient.get("/dashboard/overview", { params });
            setData(res.data?.data || null);
        } catch (err) {
            setError(err.message);
            showError("Erreur lors du chargement du dashboard");
        } finally {
            setLoading(false);
        }
    }, [selectedStudioId, timeRange, showError]);

    const updateReservationStatus = useCallback(
        async (reservationId, newStatus) => {
            try {
                await apiClient.put(`/reservations/${reservationId}`, {
                    status: newStatus,
                });

                showSuccess(
                    `Réservation ${
                        newStatus === "confirmed" ? "confirmée" : "refusée"
                    } avec succès`
                );

                // Refetch sans afficher le loader
                const params = {
                    ...(selectedStudioId && { studio_id: selectedStudioId }),
                    time_range: timeRange,
                };
                const res = await apiClient.get("/dashboard/overview", {
                    params,
                });
                setData(res.data?.data || null);
            } catch {
                showError("Erreur lors de la mise à jour de la réservation");
            }
        },
        [showSuccess, showError, selectedStudioId, timeRange]
    );

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return {
        data,
        loading,
        error,
        refetch: fetchOverview,
        updateReservationStatus,
    };
}
