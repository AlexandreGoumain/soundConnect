import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { authApi } from "../../../lib/apiClient.js";

const DEFAULT_PROFILE = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    city: "",
    postal_code: "",
};

const FIELDS = Object.keys(DEFAULT_PROFILE);

const normalizeProfile = (user) => {
    const normalized = { ...DEFAULT_PROFILE };
    if (!user) {
        return normalized;
    }

    for (const field of FIELDS) {
        const value = user[field];
        normalized[field] = value ?? "";
    }

    return normalized;
};

const computeInitials = (profile) => {
    if (!profile) return "";
    const letters = `${profile.first_name?.charAt(0) ?? ""}${
        profile.last_name?.charAt(0) ?? ""
    }`.trim();
    if (letters) return letters.toUpperCase();
    const usernameInitial = profile.username?.charAt(0) ?? "";
    return usernameInitial.toUpperCase();
};

export default function Profile() {
    const { refresh, user } = useAuth();
    const { showError, showSuccess, showInfo } = useToast();

    const [formData, setFormData] = useState(DEFAULT_PROFILE);
    const [initialData, setInitialData] = useState(null);
    const [profileInfo, setProfileInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const normalized = normalizeProfile(user);
        setFormData(normalized);
        setInitialData({ ...normalized });
        setProfileInfo((prev) => prev ?? user);
    }, [user]);

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                setFetchError(null);
                setIsLoading(true);

                const response = await authApi.profile();

                if (!active) return;

                const profile = response?.data?.user ?? null;
                setProfileInfo(profile);

                const normalized = normalizeProfile(profile);

                setFormData(normalized);
                setInitialData({ ...normalized });
            } catch (error) {
                if (!active) return;

                const message =
                    error.response?.data?.message ||
                    "Impossible de charger votre profil.";

                setFetchError(message);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const hasChanges = useMemo(() => {
        if (!initialData) return false;

        return FIELDS.some((field) => {
            const currentValue = formData[field] ?? "";
            const initialValue = initialData[field] ?? "";
            return currentValue !== initialValue;
        });
    }, [formData, initialData]);

    const initials = useMemo(() => computeInitials(profileInfo), [profileInfo]);

    const roleLabel = useMemo(() => {
        const role = profileInfo?.role_name;

        if (role === "studio") return "Compte studio";
        if (role === "artist") return "Compte artiste";

        return "Compte utilisateur";
    }, [profileInfo]);

    const displayName = useMemo(() => {
        if (!profileInfo) return "";

        const fullname = `${profileInfo.first_name ?? ""} ${
            profileInfo.last_name ?? ""
        }`.trim();

        if (fullname) return fullname;

        return profileInfo.username ?? "";
    }, [profileInfo]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (!FIELDS.includes(name)) return;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        if (!initialData) return;
        setFormData({ ...initialData });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!initialData) return;

        const payload = {};
        const sanitizedForm = { ...formData };

        for (const field of FIELDS) {
            const rawValue = formData[field] ?? "";

            const sanitized =
                typeof rawValue === "string" ? rawValue.trim() : rawValue;
            sanitizedForm[field] = sanitized;

            const baseline = initialData[field] ?? "";

            if (sanitized !== baseline) {
                payload[field] = sanitized;
            }
        }

        if (Object.keys(payload).length === 0) {
            setFormData(sanitizedForm);
            showInfo("Aucune modification à enregistrer.");
            return;
        }

        try {
            setIsSubmitting(true);
            setFormData(sanitizedForm);
            const response = await authApi.updateProfile(payload);
            const updatedProfile = response?.data?.user ?? null;
            if (updatedProfile) {
                const normalized = normalizeProfile(updatedProfile);
                setFormData(normalized);
                setInitialData({ ...normalized });
                setProfileInfo(updatedProfile);
            } else {
                const normalizedFallback = normalizeProfile(sanitizedForm);
                setInitialData({ ...normalizedFallback });
            }
            await refresh();
            showSuccess("Profil mis a jour");
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const message =
                (Array.isArray(validationErrors) && validationErrors.length > 0
                    ? validationErrors[0]?.message
                    : error.response?.data?.message) ||
                "La mise a jour du profil a echoue.";
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Mon profil</h1>
                    <p>
                        Consultez et mettez a jour vos informations
                        personnelles.
                    </p>
                </div>
                {isLoading ? (
                    <div className="profile-loading">
                        Chargement du profil...
                    </div>
                ) : (
                    <div className="profile-content">
                        {profileInfo && (
                            <div className="profile-summary card">
                                <div
                                    className="profile-summary-avatar"
                                    aria-hidden="true"
                                >
                                    {initials || "?"}
                                </div>
                                <div className="profile-summary-details">
                                    <h2>
                                        {displayName ||
                                            (profileInfo?.username ??
                                                "Mon compte")}
                                    </h2>
                                    <p>{roleLabel}</p>
                                    {profileInfo.username && (
                                        <p className="profile-summary-username">
                                            @{profileInfo.username}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {fetchError && (
                            <div className="profile-error card">
                                <p>{fetchError}</p>
                            </div>
                        )}

                        <form
                            className="profile-form card"
                            onSubmit={handleSubmit}
                        >
                            <div className="card-body">
                                <div className="profile-form-grid">
                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="first_name"
                                        >
                                            Prénom
                                        </label>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            className="input"
                                            type="text"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="last_name"
                                        >
                                            Nom
                                        </label>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            className="input"
                                            type="text"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="username"
                                        >
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            id="username"
                                            name="username"
                                            className="input"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            className="input"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="phone"
                                        >
                                            Téléphone
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            className="input"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Ex. 06 12 34 56 78"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label" htmlFor="city">
                                            Ville
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            className="input"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            className="label"
                                            htmlFor="postal_code"
                                        >
                                            Code postal
                                        </label>
                                        <input
                                            id="postal_code"
                                            name="postal_code"
                                            className="input"
                                            type="text"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer profile-actions">
                                <Link
                                    className="btn btn-ghost"
                                    to="/profile/password"
                                >
                                    Modifier mon mot de passe
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                    disabled={!hasChanges || isSubmitting}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!hasChanges || isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Enregistrement..."
                                        : "Enregistrer"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
