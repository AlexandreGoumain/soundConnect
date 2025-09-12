import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../lib/apiClient.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function StudioForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        street_number: "",
        street_name: "",
        postal_code: "",
        city: "",
        country: "France",
        hourly_rate: "",
        phone: "",
        email: "",
        website: "",
        equipment_list: "",
        tags: "",
        images: "",
    });

    useEffect(() => {
        const fetch = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const res = await apiClient.get(`/dashboard/studios/${id}`);
                const studio = res.data?.data?.studio;
                if (studio) setForm({ ...form, ...studio });
            } catch {
                showToast("Erreur de chargement du studio", "error");
            } finally {
                setLoading(false);
            }
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit) {
                await apiClient.put(`/dashboard/studios/${id}`, form);
                showToast("Studio mis à jour", "success");
            } else {
                await apiClient.post(`/dashboard/studios`, form);
                showToast("Studio créé", "success");
            }
            navigate("/studio/studios");
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Erreur lors de l’enregistrement";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 720 }}>
            <h2>{isEdit ? "Modifier le studio" : "Nouveau studio"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <Input
                    label="Nom"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr",
                        gap: 8,
                    }}
                >
                    <Input
                        label="N°"
                        name="street_number"
                        value={form.street_number}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Rue"
                        name="street_name"
                        value={form.street_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                    }}
                >
                    <Input
                        label="Code postal"
                        name="postal_code"
                        value={form.postal_code}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Ville"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Input
                    label="Pays"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                />
                <Input
                    label="Tarif horaire (€)"
                    name="hourly_rate"
                    type="number"
                    step="0.01"
                    value={form.hourly_rate}
                    onChange={handleChange}
                    required
                />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                    }}
                >
                    <Input
                        label="Téléphone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Input
                    label="Site web"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                />
                <Textarea
                    label="Équipements"
                    name="equipment_list"
                    value={form.equipment_list}
                    onChange={handleChange}
                />
                <Input
                    label="Tags (séparés par des virgules)"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                />
                <Input
                    label="Images (URLs séparées par des virgules)"
                    name="images"
                    value={form.images}
                    onChange={handleChange}
                />

                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? "Enregistrement…" : "Enregistrer"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate(-1)}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
            <input className="input" {...props} />
        </label>
    );
}

function Textarea({ label, ...props }) {
    return (
        <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
            <textarea className="input" rows={4} {...props} />
        </label>
    );
}
