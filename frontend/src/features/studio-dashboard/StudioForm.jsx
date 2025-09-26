import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/shared/InputField.jsx";
import SectionCard from "../../components/shared/SectionCard.jsx";
import TextareaField from "../../components/shared/TextareaField.jsx";
import { useToast } from "../../hooks/useToast.js";
import "../../styles/components/_studio-dashboard.scss";
import DashboardSidebar from "./components/DashboardSidebar.jsx";
import StudioImagesManager from "./components/StudioImagesManager.jsx";
import { useStudioForm } from "./hooks/useStudioForm.js";
import { WEEK_DAYS } from "./lib/studioSchedule.js";
import { MAX_TAGS_COUNT, MAX_TAGS_LENGTH } from "./lib/studioValidation.js";
const TAG_LIMIT = MAX_TAGS_COUNT;
const TAG_CHAR_LIMIT = MAX_TAGS_LENGTH;
const SECTIONS = {
    general: {
        title: "Informations générales",
        subtitle: "Présentez votre studio et ce qui le rend unique.",
    },
    address: {
        title: "Adresse",
        subtitle: "Indiquez l'emplacement précis du studio.",
    },
    contact: {
        title: "Tarification & contact",
        subtitle: "Aidez les artistes à vous joindre facilement.",
    },
};
export default function StudioForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const {
        form,
        schedule,
        errors = {},
        images,
        setImages,
        isFetching,
        isSaving,
        disableForm,
        handleChange,
        handleSubmit,
        handleScheduleToggle,
        handleScheduleTimeChange,
        setFieldValue,
    } = useStudioForm({
        id,
        isEdit,
        showToast,
        onSuccess: () => navigate("/studio/studios"),
    });
    const pageTitle = isEdit ? "Modifier le studio" : "Nouveau studio";
    const pageSubtitle = isEdit
        ? "Mettez à jour les informations visibles sur votre fiche publique."
        : "Complétez les informations pour publier votre studio.";
    const scheduleErrorDetails =
        typeof errors.schedule === "string"
            ? { message: errors.schedule }
            : errors.schedule || null;
    const scheduleErrorMessage = scheduleErrorDetails?.message || null;
    const scheduleErrorDay = scheduleErrorDetails?.day || null;
    return (
        <div className="container studio-dashboard">
            <div className="dashboard-layout">
                <div className="dashboard-layout-sidebar">
                    <DashboardSidebar />
                </div>
                <div className="dashboard-layout-main">
                    <div className="page-header">
                        <h1 className="page-title">{pageTitle}</h1>
                        <p className="page-subtitle">{pageSubtitle}</p>
                    </div>
                    {isFetching ? (
                        <div className="card">
                            <div className="card-body">
                                Chargement du studio...
                            </div>
                        </div>
                    ) : (
                        <form
                            className="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <SectionCard {...SECTIONS.general}>
                                <InputField
                                    label="Nom"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    disabled={disableForm}
                                    error={errors.name}
                                />
                                <TextareaField
                                    label="Description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    disabled={disableForm}
                                    error={errors.description}
                                />
                            </SectionCard>
                            <SectionCard {...SECTIONS.address}>
                                <div className="form-row">
                                    <InputField
                                        label="Numéro de rue"
                                        name="street_number"
                                        value={form.street_number}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.street_number}
                                    />
                                    <InputField
                                        label="Rue"
                                        name="street_name"
                                        value={form.street_name}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.street_name}
                                    />
                                </div>
                                <div className="form-row">
                                    <InputField
                                        label="Code postal"
                                        name="postal_code"
                                        value={form.postal_code}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.postal_code}
                                    />
                                    <InputField
                                        label="Ville"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.city}
                                    />
                                </div>
                                <InputField
                                    label="Pays"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    disabled={disableForm}
                                    error={errors.country}
                                />
                            </SectionCard>
                            <SectionCard {...SECTIONS.contact}>
                                <InputField
                                    label="Tarif horaire (€ / h)"
                                    name="hourly_rate"
                                    type="number"
                                    step="1"
                                    min="1"
                                    value={form.hourly_rate}
                                    onChange={handleChange}
                                    required
                                    disabled={disableForm}
                                    error={errors.hourly_rate}
                                />
                                <div className="form-row">
                                    <InputField
                                        label="Téléphone"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.phone}
                                    />
                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={disableForm}
                                        error={errors.email}
                                    />
                                </div>
                                <InputField
                                    label="Site web"
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    placeholder="https://votrestudio.com"
                                    disabled={disableForm}
                                    error={errors.website}
                                />
                                <TokenInput
                                    label="Equipements"
                                    name="equipment_list"
                                    items={stringToList(form.equipment_list)}
                                    disabled={disableForm}
                                    error={errors.equipment_list}
                                    placeholder="Ajouter un équipement"
                                    addLabel="Ajouter"
                                    onChange={(items) =>
                                        setFieldValue(
                                            "equipment_list",
                                            listToMultiline(items)
                                        )
                                    }
                                    renderHint="Listez les instruments, consoles et services disponibles."
                                />
                                <TokenInput
                                    label="Tags"
                                    name="tags"
                                    items={stringToList(
                                        form.tags,
                                        ",",
                                        TAG_LIMIT,
                                        TAG_CHAR_LIMIT
                                    )}
                                    disabled={disableForm}
                                    error={errors.tags}
                                    placeholder="Ajouter un tag"
                                    addLabel="Ajouter"
                                    addOnComma
                                    maxItems={TAG_LIMIT}
                                    counterLabel="tags"
                                    charLimit={TAG_CHAR_LIMIT}
                                    charCounterLabel="caractères"
                                    limitMessage={`Limite de ${TAG_LIMIT} tags et ${TAG_CHAR_LIMIT} caractères.`}
                                    onChange={(items) =>
                                        setFieldValue(
                                            "tags",
                                            listToCommaSeparated(items)
                                        )
                                    }
                                    renderHint="Aidez les artistes à vous trouver (ex: acoustique, mixage)."
                                />
                            </SectionCard>
                            <SectionCard
                                title="Horaires d'ouverture"
                                subtitle="Définissez vos créneaux d'accueil pour chaque jour."
                                className={`schedule-card${
                                    scheduleErrorMessage ? " has-error" : ""
                                }`}
                                error={scheduleErrorMessage}
                            >
                                <div className="schedule-grid">
                                    {WEEK_DAYS.map(({ key, label }) => {
                                        const rowError =
                                            scheduleErrorDay &&
                                            scheduleErrorDay === key
                                                ? scheduleErrorMessage
                                                : null;
                                        return (
                                            <ScheduleDayRow
                                                key={key}
                                                dayKey={key}
                                                label={label}
                                                data={schedule[key]}
                                                disabled={disableForm}
                                                hasError={Boolean(rowError)}
                                                errorMessage={rowError}
                                                onToggle={(value) =>
                                                    handleScheduleToggle(
                                                        key,
                                                        value
                                                    )
                                                }
                                                onTimeChange={(field, value) =>
                                                    handleScheduleTimeChange(
                                                        key,
                                                        field,
                                                        value
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </SectionCard>
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Publication</h2>
                                    <p className="card-subtitle">
                                        Vérifiez vos informations avant
                                        d'enregistrer.
                                    </p>
                                </div>
                                <div className="card-body">
                                    <p className="text-sm studio-form__schedule-title">
                                        Vous pourrez ajuster ces details et
                                        enrichir votre galerie à tout moment.
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <button
                                        className="btn btn-primary"
                                        disabled={disableForm}
                                        type="submit"
                                    >
                                        {isSaving
                                            ? "Enregistrement..."
                                            : isEdit
                                            ? "Mettre à jour"
                                            : "Publier le studio"}
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
                            </div>
                        </form>
                    )}
                    {isEdit ? (
                        <section className="card studio-form__images-section">
                            <div className="card-header">
                                <h2 className="card-title">Galerie d'images</h2>
                                <p className="card-subtitle">
                                    Ajoutez ou reorganisez les visuels de votre
                                    studio.
                                </p>
                            </div>
                            <div className="card-body">
                                <StudioImagesManager
                                    studioId={id}
                                    images={images}
                                    onImagesChange={setImages}
                                />
                            </div>
                        </section>
                    ) : (
                        <div className="card studio-form__section">
                            <div className="card-body">
                                Vous pourrez ajouter des images une fois le
                                studio créé.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
function ScheduleDayRow({
    dayKey,
    label,
    data,
    disabled,
    hasError,
    errorMessage,
    onToggle,
    onTimeChange,
}) {
    const isOpen = Boolean(data?.is_open);
    const rowClassName = `schedule-row${isOpen ? " is-open" : ""}${
        hasError ? " schedule-row-error" : ""
    }`;
    return (
        <div className={rowClassName}>
            <div className="schedule-day">
                <span className="schedule-day-label">{label}</span>
                <label
                    className="schedule-toggle"
                    htmlFor={`schedule-${dayKey}-toggle`}
                >
                    <input
                        id={`schedule-${dayKey}-toggle`}
                        type="checkbox"
                        checked={isOpen}
                        onChange={(event) => onToggle(event.target.checked)}
                        disabled={disabled}
                    />
                    <span>{isOpen ? "Ouvert" : "Fermé"}</span>
                </label>
            </div>
            {isOpen ? (
                <div className="schedule-times">
                    <label
                        className="schedule-time"
                        htmlFor={`schedule-${dayKey}-open`}
                    >
                        <span>De</span>
                        <input
                            id={`schedule-${dayKey}-open`}
                            type="time"
                            className={`input${hasError ? " input-error" : ""}`}
                            value={data?.open_time || ""}
                            onChange={(event) =>
                                onTimeChange("open_time", event.target.value)
                            }
                            disabled={disabled}
                        />
                    </label>
                    <label
                        className="schedule-time"
                        htmlFor={`schedule-${dayKey}-close`}
                    >
                        <span>A</span>
                        <input
                            id={`schedule-${dayKey}-close`}
                            type="time"
                            className={`input${hasError ? " input-error" : ""}`}
                            value={data?.close_time || ""}
                            onChange={(event) =>
                                onTimeChange("close_time", event.target.value)
                            }
                            disabled={disabled}
                        />
                    </label>
                </div>
            ) : (
                <div className="schedule-closed">Fermé</div>
            )}
            {hasError && errorMessage ? (
                <p className="schedule-row-error-message error-message">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
}

// TODO : extract to a shared component

function TokenInput({
    label,
    name,
    items,
    disabled,
    error,
    onChange,
    placeholder,
    addLabel,
    renderHint,
    addOnComma = false,
    maxItems,
    counterLabel = "elements",
    charLimit,
    charCounterLabel = "caracteres",
    limitMessage,
}) {
    const [draft, setDraft] = useState("");
    const tokens = Array.isArray(items) ? items : [];

    const serializedTokens = listToCommaSeparated(tokens);
    const currentCharCount = serializedTokens.length;
    const isAtCountLimit =
        typeof maxItems === "number" && tokens.length >= maxItems;
    const isAtCharLimit =
        typeof charLimit === "number" && currentCharCount >= charLimit;
    const isAtLimit = isAtCountLimit || isAtCharLimit;

    const addItem = () => {
        const value = draft.trim();
        if (!value || (addOnComma && value === ",")) return;
        const valueLower = value.toLowerCase();
        if (tokens.some((item) => String(item).toLowerCase() === valueLower)) {
            setDraft("");
            return;
        }
        if (typeof maxItems === "number" && tokens.length >= maxItems) {
            return;
        }
        const prospectiveTokens = [...tokens, value];
        const serializedNext = listToCommaSeparated(prospectiveTokens);
        if (
            typeof charLimit === "number" &&
            serializedNext.length > charLimit
        ) {
            return;
        }
        onChange(prospectiveTokens);
        setDraft("");
    };

    const removeItem = (index) => {
        const next = tokens.filter((_, idx) => idx !== index);
        onChange(next);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || (addOnComma && event.key === ",")) {
            event.preventDefault();
            addItem();
            return;
        }
        if (!draft && event.key === "Backspace" && tokens.length > 0) {
            event.preventDefault();
            removeItem(tokens.length - 1);
        }
    };

    const helperMessages = [];
    if (!error && renderHint) {
        helperMessages.push({ text: renderHint, className: "help-text" });
    }
    if (!error && typeof maxItems === "number") {
        const countMessage =
            tokens.length + "/" + maxItems + " " + counterLabel + " maximum";
        helperMessages.push({
            text: countMessage,
            className: isAtCountLimit
                ? "help-text help-text-strong"
                : "help-text",
        });
    }
    if (!error && typeof charLimit === "number") {
        const charMessage =
            currentCharCount +
            "/" +
            charLimit +
            " " +
            charCounterLabel +
            " maximum";
        helperMessages.push({
            text: charMessage,
            className: isAtCharLimit
                ? "help-text help-text-warning"
                : "help-text",
        });
    }
    if (!error && limitMessage) {
        helperMessages.push({
            text: limitMessage,
            className: isAtLimit ? "help-text help-text-warning" : "help-text",
        });
    }

    const containerClass = ["form-group token-input"];
    if (isAtLimit) containerClass.push("token-input--limit");
    const listClassName = ["token-input-list"];
    if (error) listClassName.push("token-input-list-error");
    const disableControls = disabled || isAtLimit;

    return (
        <div className={containerClass.join(" ")}>
            <label className="label" htmlFor={`${name}-draft`}>
                {label}
            </label>
            <div className="token-input-box">
                <div className={listClassName.join(" ")}>
                    {tokens.map((item, index) => (
                        <span key={`${item}-${index}`} className="token-chip">
                            {item}
                            <button
                                type="button"
                                className="token-chip-remove"
                                onClick={() => removeItem(index)}
                                disabled={disabled}
                                aria-label={`Retirer ${item}`}
                            >
                                x
                            </button>
                        </span>
                    ))}
                    <input
                        id={`${name}-draft`}
                        className="token-input-field"
                        type="text"
                        placeholder={isAtLimit ? "" : placeholder}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disableControls}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-secondary token-input-add"
                    onClick={addItem}
                    disabled={disableControls}
                >
                    {addLabel}
                </button>
            </div>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                helperMessages.map((helper) => (
                    <p key={helper.text} className={helper.className}>
                        {helper.text}
                    </p>
                ))
            )}
        </div>
    );
}

function stringToList(value, separator = "\n", maxItems, charLimit) {
    if (!value) return [];
    const pattern = separator === "," ? /[,;\n]+/ : /[\n;]+/;
    const joiner = separator === "," ? ", " : separator;
    const seen = new Set();
    const results = [];

    for (const raw of value.split(pattern)) {
        const token = raw.trim();
        if (!token) continue;
        const key = token.toLowerCase();
        if (seen.has(key)) continue;
        const prospective = [...results, token];
        if (typeof charLimit === "number") {
            const joined = prospective.join(joiner);
            if (joined.length > charLimit) continue;
        }
        seen.add(key);
        results.push(token);
        if (typeof maxItems === "number" && results.length >= maxItems) break;
    }

    return results;
}

function listToMultiline(items) {
    if (!Array.isArray(items)) return "";
    const seen = new Set();
    const unique = [];

    for (const raw of items) {
        const token = raw.trim();
        if (!token) continue;
        const key = token.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(token);
    }

    return unique.join("\n");
}

function listToCommaSeparated(items) {
    if (!Array.isArray(items)) return "";
    const seen = new Set();
    const unique = [];

    for (const raw of items) {
        const token = raw.trim();
        if (!token) continue;
        const key = token.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(token);
    }

    return unique.join(", ");
}
