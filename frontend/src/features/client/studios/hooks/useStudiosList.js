import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../../../lib/apiClient.js";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export function useStudiosList() {
    const queryParams = useQuery();

    // State
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalStudios, setTotalStudios] = useState(0);
    const pageSize = 9;

    // Parse search parameters for API call
    const searchParams = useMemo(() => {
        const params = {};
        const paramKeys = [
            "city",
            "postal_code",
            "min_rate",
            "max_rate",
            "tags",
            "sort",
            "equipment",
            "available_on",
            "duration",
        ];

        paramKeys.forEach((key) => {
            const value = queryParams.get(key);
            if (value) {
                params[key] = value;
            }
        });

        // Add pagination parameters
        params.page = currentPage;
        params.limit = pageSize;

        return params;
    }, [queryParams, currentPage, pageSize]);

    // Fetch studios data
    useEffect(() => {
        const fetchStudios = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await apiClient.get("/studios", {
                    params: searchParams,
                });

                // Handle paginated response
                if (data?.data) {
                    setStudios(data.data.studios || []);
                    setTotalPages(data.data.totalPages || 0);
                    setTotalStudios(data.data.totalStudios || 0);
                } else {
                    // Fallback for non-paginated response
                    setStudios(data?.studios || []);
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();
    }, [searchParams]);

    // Reset to page 1 when search params change (excluding pagination params)
    useEffect(() => {
        setCurrentPage(1);
    }, [queryParams]);

    // Pagination controls
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        // State
        studios,
        loading,
        error,
        hasStudios: studios.length > 0,

        // Computed values
        studiosCount: studios.length,

        // Pagination
        currentPage,
        totalPages,
        totalStudios,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,

        // Pagination controls
        nextPage,
        prevPage,
        goToPage,
    };
}
