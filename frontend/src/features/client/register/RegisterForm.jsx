import { FaMicrophone, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/components/_auth-form.scss";
import { useRegisterForm } from "./hooks/useRegisterForm.js";
import InputField from "../../../components/shared/InputField.jsx";
import PasswordField from "../../../components/shared/PasswordField.jsx";

// Map backend role names to UI icons
const ROLE_ICONS = {
    artist: FaUser,
    studio: FaMicrophone,
};


export default function RegisterForm() {
    const {
        step,
        accountType,
        roles,
        formData,
        error,
        fieldErrors,
        showPassword,
        showConfirmPassword,
        status,
        user,
        handleInputChange,
        handleAccountTypeSelect,
        handleBackToStep1,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
    } = useRegisterForm();

    if (user) {
        return null;
    }

    return (
        <div className="auth-layout">
            <div className="card auth-card">
                <div className="card-header">
                    <h2 className="card-title">
                        {step === 1
                            ? "Créez votre compte"
                            : `Inscription ${accountType?.name}`}
                    </h2>
                    <p className="card-subtitle">
                        {step === 1
                            ? "Rejoignez la communauté SoundConnect"
                            : "Complétez vos informations"}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="card-body">
                        <div className="account-type-selection">
                            <h3 className="section-title">
                                Choisissez votre type de compte
                            </h3>

                            <div className="account-types">
                                {roles
                                    .filter((role) => ROLE_ICONS[role.name])
                                    .map((role) => {
                                        const IconComponent =
                                            ROLE_ICONS[role.name];
                                        const roleName = role.name;

                                        return (
                                            <div
                                                key={roleName}
                                                className="account-type-card"
                                                onClick={() =>
                                                    handleAccountTypeSelect(
                                                        role
                                                    )
                                                }
                                            >
                                                <div className="account-type-icon">
                                                    <IconComponent />
                                                </div>
                                                <h4>
                                                    {roleName === "artist"
                                                        ? "Artiste"
                                                        : "Studio"}
                                                </h4>
                                                <p>
                                                    {roleName === "artist"
                                                        ? "Réservez des studios et gérez vos sessions d'enregistrement"
                                                        : "Gérez votre studio et recevez des réservations"}
                                                </p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        <div className="auth-footer">
                            <p>
                                Déjà un compte ?{" "}
                                <Link to="/login" className="auth-link">
                                    Connectez-vous
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && (
                                <div className="card auth-form__error-message">
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div className="form-row">
                                <InputField
                                    label="Prénom"
                                    name="first_name"
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                    error={fieldErrors.first_name}
                                />

                                <InputField
                                    label="Nom"
                                    name="last_name"
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                    error={fieldErrors.last_name}
                                />
                            </div>

                            <InputField
                                label="Nom d'utilisateur"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                type="text"
                                required
                                error={fieldErrors.username}
                            />

                            <InputField
                                label="Email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email"
                                required
                                error={fieldErrors.email}
                            />

                            <InputField
                                label="Téléphone"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                type="tel"
                                required
                                error={fieldErrors.phone}
                            />

                            <div className="form-row">
                                <InputField
                                    label="Ville"
                                    name="city"
                                    id="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                    error={fieldErrors.city}
                                />

                                <InputField
                                    label="Code postal"
                                    name="postal_code"
                                    id="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                    error={fieldErrors.postal_code}
                                />
                            </div>

                            <PasswordField
                                label="Mot de passe"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                showPassword={showPassword}
                                onTogglePassword={togglePasswordVisibility}
                                required
                                error={fieldErrors.password}
                            />

                            <PasswordField
                                label="Confirmer le mot de passe"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                showPassword={showConfirmPassword}
                                onTogglePassword={toggleConfirmPasswordVisibility}
                                required
                                error={fieldErrors.confirmPassword}
                            />
                        </div>

                        <div className="card-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleBackToStep1}
                                disabled={status === "loading"}
                            >
                                Retour
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={status === "loading"}
                                type="submit"
                            >
                                {status === "loading"
                                    ? "Inscription en cours..."
                                    : "S'inscrire"}
                            </button>
                        </div>

                        <div className="auth-footer">
                            <p>
                                Déjà un compte ?{" "}
                                <Link to="/login" className="auth-link">
                                    Connectez-vous
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
