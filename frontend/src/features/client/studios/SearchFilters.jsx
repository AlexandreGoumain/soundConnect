import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchFilters() {
    const location = useLocation();
    const navigate = useNavigate();
    const q = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [minRate, setMinRate] = useState("");
    const [maxRate, setMaxRate] = useState("");
    const [tags, setTags] = useState("");
    const [equipment, setEquipment] = useState("");
    const [sort, setSort] = useState("");
    const [availableOn, setAvailableOn] = useState("");
    const [duration, setDuration] = useState("1");

    useEffect(() => {
        setCity(q.get("city") || "");
        setPostalCode(q.get("postal_code") || "");
        setMinRate(q.get("min_rate") || "");
        setMaxRate(q.get("max_rate") || "");
        setTags(q.get("tags") || "");
        setEquipment(q.get("equipment") || "");
        setSort(q.get("sort") || "");
        setAvailableOn(q.get("available_on") || "");
        setDuration(q.get("duration") || "1");
    }, [q]);

    const apply = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city.trim()) params.set("city", city.trim());
        if (postalCode.trim()) params.set("postal_code", postalCode.trim());
        if (minRate) params.set("min_rate", minRate);
        if (maxRate) params.set("max_rate", maxRate);
        if (tags.trim()) params.set("tags", tags.trim());
        if (equipment.trim()) params.set("equipment", equipment.trim());
        if (sort) params.set("sort", sort);
        if (availableOn) params.set("available_on", availableOn);
        if (duration) params.set("duration", duration);
        navigate(`/studios?${params.toString()}`);
    };

    const reset = () => {
        setCity("");
        setPostalCode("");
        setMinRate("");
        setMaxRate("");
        setTags("");
        setEquipment("");
        setSort("");
        setAvailableOn("");
        setDuration("1");
        navigate(`/studios`);
    };

    return (
        <form
            className="card"
            onSubmit={apply}
            style={{ padding: 16, marginBottom: 16 }}
        >
            <div
                className="form-row"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                }}
            >
                <label className="label" htmlFor="city">
                    Ville
                    <input
                        id="city"
                        className="input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Paris"
                    />
                </label>
                <label className="label" htmlFor="postal">
                    Code postal
                    <input
                        id="postal"
                        className="input"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="75001"
                    />
                </label>
            </div>

            <div
                className="form-row"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginTop: 12,
                }}
            >
                <label className="label" htmlFor="min_rate">
                    Prix min (€/h)
                    <input
                        id="min_rate"
                        type="number"
                        min="0"
                        step="1"
                        className="input"
                        value={minRate}
                        onChange={(e) => setMinRate(e.target.value)}
                    />
                </label>
                <label className="label" htmlFor="max_rate">
                    Prix max (€/h)
                    <input
                        id="max_rate"
                        type="number"
                        min="0"
                        step="1"
                        className="input"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                    />
                </label>
            </div>

            <div
                className="form-row"
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    gap: 12,
                    marginTop: 12,
                }}
            >
                <label className="label" htmlFor="tags">
                    Tags (séparés par virgules)
                    <input
                        id="tags"
                        className="input"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="mixage, batterie"
                    />
                </label>
                <label className="label" htmlFor="equipment">
                    Équipements (séparés par virgules)
                    <input
                        id="equipment"
                        className="input"
                        value={equipment}
                        onChange={(e) => setEquipment(e.target.value)}
                        placeholder="piano, batterie"
                    />
                </label>
                <label className="label" htmlFor="sort">
                    Tri
                    <select
                        id="sort"
                        className="input"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Pertinence</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="rating_desc">Mieux notés</option>
                    </select>
                </label>
                <label className="label" htmlFor="available_on">
                    Disponible le
                    <input
                        id="available_on"
                        type="date"
                        className="input"
                        value={availableOn}
                        onChange={(e) => setAvailableOn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </label>
                <label className="label" htmlFor="duration">
                    Durée (h)
                    <select
                        id="duration"
                        className="input"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}h
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">
                    Appliquer
                </button>
                <button type="button" className="btn btn-ghost" onClick={reset}>
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}


