import { Link } from "react-router-dom";
import InputField from "../../../components/shared/InputField.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { useToast } from "../../../hooks/useToast.js";
import "../../../styles/components/_profile.scss";
import { useProfile } from "./hooks/useProfile.js";

export default function Profile() {
    const { refresh, user } = useAuth();
    const { showError, showSuccess, showInfo } = useToast();

    const {
        avatarInputRef,
        avatarUrl,
        displayName,
        fetchError,
        fieldErrors,
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
                                    {/* TODO Move this into a shared component (avatar) with a custom hook associated*/}
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
                                        className="profile__avatar-input"
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
                                    <InputField
                                        label="Prénom"
                                        name="first_name"
                                        id="first_name"
                                        type="text"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.first_name}
                                    />

                                    <InputField
                                        label="Nom"
                                        name="last_name"
                                        id="last_name"
                                        type="text"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.last_name}
                                    />

                                    <InputField
                                        label="Nom d'utilisateur"
                                        name="username"
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.username}
                                    />

                                    <InputField
                                        label="Email"
                                        name="email"
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.email}
                                    />

                                    <InputField
                                        label="Téléphone"
                                        name="phone"
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Ex. 06 12 34 56 78"
                                        disabled={isSubmitting}
                                        error={fieldErrors.phone}
                                    />

                                    <InputField
                                        label="Ville"
                                        name="city"
                                        id="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.city}
                                    />

                                    <InputField
                                        label="Code postal"
                                        name="postal_code"
                                        id="postal_code"
                                        type="text"
                                        value={formData.postal_code}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        error={fieldErrors.postal_code}
                                    />
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
