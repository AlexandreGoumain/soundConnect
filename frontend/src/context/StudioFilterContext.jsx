import { useEffect, useMemo, useState } from "react";
import { StudioFilterContext } from "../contexts/StudioFilterContext.js";
import { useMyStudios } from "../features/studio-dashboard/hooks/useMyStudios.js";

const STORAGE_KEY = "studioFilter.selectedId";

export function StudioFilterProvider({ children }) {
    const { studios, loading: studiosLoading, error, refetch } = useMyStudios();

    const [selectedId, setSelectedId] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    // Persist selection
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedId));
    }, [selectedId]);

    // If selected studio disappears, reset to all
    useEffect(() => {
        if (!studios || studios.length === 0) {
            if (selectedId !== null) setSelectedId(null);
            return;
        }
        if (selectedId === null) return;
        const stillExists = studios.some(
            (s) => String(s.id) === String(selectedId)
        );
        if (!stillExists) setSelectedId(null);
    }, [studios, selectedId]);

    const selectedStudio = useMemo(() => {
        if (selectedId === null) return null;
        return (
            studios?.find((s) => String(s.id) === String(selectedId)) || null
        );
    }, [studios, selectedId]);

    const value = useMemo(
        () => ({
            studios: studios || [],
            studiosLoading,
            error,
            refetchStudios: refetch,
            selectedStudioId: selectedId,
            selectedStudio,
            setSelectedStudioId: setSelectedId,
            clearSelection: () => setSelectedId(null),
        }),
        [studios, studiosLoading, error, refetch, selectedId, selectedStudio]
    );

    return (
        <StudioFilterContext.Provider value={value}>
            {children}
        </StudioFilterContext.Provider>
    );
}
