import { Link } from "react-router-dom";
import { useChangePassword } from "./hooks/useChangePassword.js";

function FieldError({ error }) {
    if (!error) return null;
    return <span className="field-error">{error}</span>;
}

export default function ChangePassword() {
    const {
        formData,
        fieldErrors,
        isSubmitting,
        isUserLoggedIn,
        handleChange,
        handleSubmit,
    } = useChangePassword();

    if (!isUserLoggedIn) {
        return null;
    }


    const handleBackClick = (event) => {
        if (isSubmitting) {
            event.preventDefault();
        }
    };

    return (
        <div className="password-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Changer mon mot de passe</h1>
                    <p>Saisissez votre mot de passe actuel et choisissez-en un nouveau.</p>
                </div>

                <div className="profile-content">
                    <form className="profile-form card" onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label className="label" htmlFor="currentPassword">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        className={`input ${fieldErrors.currentPassword ? 'input-error' : ''}`}
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        disabled={isSubmitting}
                                    />
                                    <FieldError error={fieldErrors.currentPassword} />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="newPassword">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        className={`input ${fieldErrors.newPassword ? 'input-error' : ''}`}
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                    />
                                    <FieldError error={fieldErrors.newPassword} />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="confirmPassword">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                    />
                                    <FieldError error={fieldErrors.confirmPassword} />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer profile-actions">
                            <Link
                                className="btn btn-secondary"
                                to="/profile"
                                onClick={handleBackClick}
                                aria-disabled={isSubmitting}
                            >
                                Retour au profil
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Modification..." : "Mettre a jour"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
