import { useEffect, useState } from "react";
import { useAuth } from "./useAuth.js";
import { useToast } from "./useToast.js";
import { apiClient } from "../lib/apiClient.js";

export function useArtistReservations(options = {}) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchReservations = async (params = {}) => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Merge options with params for API call
            const queryParams = { ...options, ...params };

            const res = await apiClient.get('/reservations', { params: queryParams });

            if (res.data?.data?.totalPages !== undefined) {
                // Paginated response
                setReservations(res.data.data.reservations || []);
                setPaginationData({
                    currentPage: res.data.data.currentPage,
                    totalPages: res.data.data.totalPages,
                    totalReservations: res.data.data.totalReservations,
                    pageSize: res.data.data.pageSize,
                    hasNextPage: res.data.data.hasNextPage,
                    hasPrevPage: res.data.data.hasPrevPage,
                });
            } else {
                // Non-paginated response (backward compatibility)
                setReservations(res.data?.data?.reservations || []);
                setPaginationData(null);
            }
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

    return {
        reservations,
        loading,
        error,
        paginationData,
        refetch: fetchReservations
    };
}