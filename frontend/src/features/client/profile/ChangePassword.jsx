import { Link } from "react-router-dom";
import { useChangePassword } from "./hooks/useChangePassword.js";
import PasswordField from "../../../components/shared/PasswordField.jsx";


export default function ChangePassword() {
    const {
        formData,
        fieldErrors,
        isSubmitting,
        isUserLoggedIn,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        handleChange,
        handleSubmit,
        toggleCurrentPasswordVisibility,
        toggleNewPasswordVisibility,
        toggleConfirmPasswordVisibility,
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
                                <PasswordField
                                    label="Mot de passe actuel"
                                    name="currentPassword"
                                    id="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    showPassword={showCurrentPassword}
                                    onTogglePassword={toggleCurrentPasswordVisibility}
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                    error={fieldErrors.currentPassword}
                                />

                                <PasswordField
                                    label="Nouveau mot de passe"
                                    name="newPassword"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    showPassword={showNewPassword}
                                    onTogglePassword={toggleNewPasswordVisibility}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    error={fieldErrors.newPassword}
                                />

                                <PasswordField
                                    label="Confirmer le nouveau mot de passe"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    showPassword={showConfirmPassword}
                                    onTogglePassword={toggleConfirmPasswordVisibility}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    error={fieldErrors.confirmPassword}
                                />
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
