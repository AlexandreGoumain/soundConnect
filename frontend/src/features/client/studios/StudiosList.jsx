import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../../lib/apiClient.js";
import StudioCard from "../home/components/StudioCard.jsx";
import SearchFilters from "./SearchFilters.jsx";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function StudiosList() {
    const q = useQuery();
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useMemo(() => {
        const p = {};
        const city = q.get("city");
        const postal_code = q.get("postal_code");
        const min_rate = q.get("min_rate");
        const max_rate = q.get("max_rate");
        const tags = q.get("tags");
        const sort = q.get("sort");
        if (city) p.city = city;
        if (postal_code) p.postal_code = postal_code;
        if (min_rate) p.min_rate = min_rate;
        if (max_rate) p.max_rate = max_rate;
        if (tags) p.tags = tags;
        if (sort) p.sort = sort;
        return p;
    }, [q]);

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await apiClient.get("/studios", { params });
                setStudios(data?.data?.studios || []);
            } catch (e) {
                setError(e?.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [params]);

    return (
        <div className="container" style={{ padding: "2rem 1rem" }}>
            <h2>Rechercher</h2>
            <SearchFilters />
            {loading && <p>Chargement...</p>}
            {error && (
                <p style={{ color: "var(--error)" }}>Erreur: {String(error)}</p>
            )}
            {!loading && !error && (
                <div className="studios-grid" style={{ marginTop: 16 }}>
                    {studios.length === 0 ? (
                        <p>Aucun studio trouvé</p>
                    ) : (
                        studios.map((s) => <StudioCard key={s.id} studio={s} />)
                    )}
                </div>
            )}
        </div>
    );
}
