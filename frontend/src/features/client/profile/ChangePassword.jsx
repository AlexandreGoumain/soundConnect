import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { authApi } from "../../../lib/apiClient.js";

const DEFAULT_FORM = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export default function ChangePassword() {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();

    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user?.id) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentPassword = formData.currentPassword.trim();
        const newPassword = formData.newPassword.trim();
        const confirmPassword = formData.confirmPassword.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showError("Tous les champs sont obligatoires.");
            return;
        }

        if (newPassword.length < 6) {
            showError("Le mot de passe doit contenir au moins 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        if (newPassword === currentPassword) {
            showError("Le nouveau mot de passe doit etre different de l'actuel.");
            return;
        }

        try {
            setIsSubmitting(true);
            await authApi.changePassword(user.id, {
                currentPassword,
                newPassword,
            });
            setFormData(DEFAULT_FORM);
            showSuccess("Mot de passe mis a jour avec succes.");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "La modification du mot de passe a echoue.";
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        className="input"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="newPassword">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        className="input"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="confirmPassword">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="input"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                        required
                                    />
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
