import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import { apiClient } from "../../lib/apiClient.js";
import StudioImagesManager from "./components/StudioImagesManager.jsx";

const EMPTY_FORM = {
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
};

const parseImages = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            const splitted = raw
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean);
            if (splitted.length > 0) return splitted;
        }

        return [raw];
    }

    return [];
};

const normalizeStudioToForm = (studio) => {
    if (!studio) return { ...EMPTY_FORM };

    return {
        name: studio.name ?? "",
        description: studio.description ?? "",
        street_number: studio.street_number ?? "",
        street_name: studio.street_name ?? "",
        postal_code: studio.postal_code ?? "",
        city: studio.city ?? "",
        country: studio.country ?? "France",
        hourly_rate:
            studio.hourly_rate !== undefined && studio.hourly_rate !== null
                ? String(studio.hourly_rate)
                : "",
        phone: studio.phone ?? "",
        email: studio.email ?? "",
        website: studio.website ?? "",
        equipment_list: studio.equipment_list ?? "",
        tags: studio.tags ?? "",
    };
};

export default function StudioForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [images, setImages] = useState([]);
    const [isFetching, setIsFetching] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEdit) {
            setImages([]);
            setForm({ ...EMPTY_FORM });
            setIsFetching(false);
            return;
        }

        let active = true;

        const loadStudio = async () => {
            try {
                setIsFetching(true);
                const res = await apiClient.get(`/dashboard/studios/${id}`);
                if (!active) return;

                const studio = res.data?.data?.studio;
                if (studio) {
                    setForm(normalizeStudioToForm(studio));
                    setImages(parseImages(studio.images));
                }
            } catch (error) {
                if (!active) return;
                const message =
                    error.response?.data?.message ||
                    "Erreur de chargement du studio";
                showToast(message, "error");
            } finally {
                if (active) setIsFetching(false);
            }
        };

        loadStudio();

        return () => {
            active = false;
        };
    }, [id, isEdit, showToast]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsSaving(true);
            if (isEdit) {
                const response = await apiClient.put(
                    `/dashboard/studios/${id}`,
                    form
                );
                const studio = response.data?.data?.studio;
                if (studio) {
                    setForm(normalizeStudioToForm(studio));
                    setImages(parseImages(studio.images));
                }
                showToast("Studio mis à jour", "success");
            } else {
                await apiClient.post(`/dashboard/studios`, form);
                showToast("Studio créé", "success");
            }
            navigate("/studio/studios");
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Erreur lors de l'enregistrement";
            showToast(msg, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const disableForm = isFetching || isSaving;

    return (
        <div style={{ maxWidth: 720 }}>
            <h2>{isEdit ? "Modifier le studio" : "Nouveau studio"}</h2>
            {isFetching ? (
                <div>Chargement du studio...</div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "grid", gap: 12 }}
                >
                    <Input
                        label="Nom"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={disableForm}
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        disabled={disableForm}
                    />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr",
                            gap: 8,
                        }}
                    >
                        <Input
                            label="Numéro de rue"
                            name="street_number"
                            value={form.street_number}
                            onChange={handleChange}
                            required
                            disabled={disableForm}
                        />
                        <Input
                            label="Rue"
                            name="street_name"
                            value={form.street_name}
                            onChange={handleChange}
                            required
                            disabled={disableForm}
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
                            disabled={disableForm}
                        />
                        <Input
                            label="Ville"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            disabled={disableForm}
                        />
                    </div>
                    <Input
                        label="Pays"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        disabled={disableForm}
                    />
                    <Input
                        label="Tarif horaire (€/h)"
                        name="hourly_rate"
                        type="number"
                        step="0.01"
                        value={form.hourly_rate}
                        onChange={handleChange}
                        required
                        disabled={disableForm}
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
                            disabled={disableForm}
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={disableForm}
                        />
                    </div>
                    <Input
                        label="Site web"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        disabled={disableForm}
                    />
                    <Textarea
                        label="équipements"
                        name="equipment_list"
                        value={form.equipment_list}
                        onChange={handleChange}
                        disabled={disableForm}
                    />
                    <Input
                        label="Tags (séparés par des virgules)"
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        disabled={disableForm}
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            className="btn btn-primary"
                            disabled={disableForm}
                        >
                            {isSaving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate(-1)}
                            disabled={isSaving}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            )}

            {isEdit ? (
                <div style={{ marginTop: 32 }}>
                    <StudioImagesManager
                        studioId={id}
                        images={images}
                        onImagesChange={setImages}
                    />
                </div>
            ) : (
                <div className="card" style={{ marginTop: 32, padding: 16 }}>
                    Vous pourrez ajouter des images une fois le studio créé.
                </div>
            )}
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
