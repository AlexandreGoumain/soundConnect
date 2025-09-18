import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { useProfile } from "./hooks/useProfile.js";

export default function Profile() {
    const { refresh, user } = useAuth();
    const { showError, showSuccess, showInfo } = useToast();

    const {
        avatarInputRef,
        avatarUrl,
        displayName,
        fetchError,
        formData,
        handleAvatarUpload,
        handleChange,
        handleReset,
        handleSubmit,
        hasChanges,
        initials,
        isAvatarUploading,
        isLoading,
        isSubmitting,
        profileInfo,
        roleLabel,
    } = useProfile({ user, refresh, showError, showSuccess, showInfo });

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
                                <div className="profile-summary-avatar-wrapper">
                                    <div
                                        className={`profile-summary-avatar${
                                            avatarUrl
                                                ? " profile-summary-avatar--image"
                                                : ""
                                        }`}
                                    >
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={`Avatar de ${
                                                    displayName ||
                                                    profileInfo?.username ||
                                                    "votre compte"
                                                }`}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span aria-hidden="true">
                                                {initials || "?"}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() =>
                                            avatarInputRef.current?.click()
                                        }
                                        disabled={isAvatarUploading}
                                    >
                                        {isAvatarUploading
                                            ? "Envoi..."
                                            : "Changer la photo"}
                                    </button>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        style={{ display: "none" }}
                                        onChange={handleAvatarUpload}
                                    />
                                    <span className="profile-summary-avatar-hint">
                                        PNG, JPG, WEBP ou GIF - 2 Mo max.
                                    </span>
                                </div>
                                <div className="profile-summary-details">
                                    <h2>
                                        {displayName ||
                                            (profileInfo?.username ??
                                                "Mon compte")}
                                    </h2>
                                    <p>{roleLabel}</p>
                                    {profileInfo?.username && (
                                        <p className="profile-summary-username">
                                            @{profileInfo?.username}
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
