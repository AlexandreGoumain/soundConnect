import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import StudioImagesManager from "./components/StudioImagesManager.jsx";
import { useStudioForm } from "./hooks/useStudioForm.js";

export default function StudioForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        form,
        images,
        setImages,
        isFetching,
        isSaving,
        disableForm,
        handleChange,
        handleSubmit,
    } = useStudioForm({
        id,
        isEdit,
        showToast,
        onSuccess: () => navigate("/studio/studios"),
    });

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
