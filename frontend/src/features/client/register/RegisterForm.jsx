import { FaEye, FaEyeSlash, FaMicrophone, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/components/_auth-form.scss";
import { useRegisterForm } from "./hooks/useRegisterForm.js";

// Map backend role names to UI icons
const ROLE_ICONS = {
    artist: FaUser,
    studio: FaMicrophone,
};

function FieldError({ error }) {
    if (!error) return null;
    return <span className="field-error">{error}</span>;
}

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
                                <div className="form-group">
                                    <label
                                        className="label"
                                        htmlFor="first_name"
                                    >
                                        Prénom *
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        className={`input ${fieldErrors.first_name ? 'input-error' : ''}`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        type="text"
                                    />
                                    <FieldError error={fieldErrors.first_name} />
                                </div>

                                <div className="form-group">
                                    <label
                                        className="label"
                                        htmlFor="last_name"
                                    >
                                        Nom *
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        className={`input ${fieldErrors.last_name ? 'input-error' : ''}`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        type="text"
                                    />
                                    <FieldError error={fieldErrors.last_name} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="username">
                                    Nom d'utilisateur *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    className={`input ${fieldErrors.username ? 'input-error' : ''}`}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                />
                                <FieldError error={fieldErrors.username} />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    required
                                />
                                <FieldError error={fieldErrors.email} />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="phone">
                                    Téléphone *
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    className={`input ${fieldErrors.phone ? 'input-error' : ''}`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    type="tel"
                                    required
                                />
                                <FieldError error={fieldErrors.phone} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label" htmlFor="city">
                                        Ville *
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        className={`input ${fieldErrors.city ? 'input-error' : ''}`}
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        type="text"
                                    />
                                    <FieldError error={fieldErrors.city} />
                                </div>

                                <div className="form-group">
                                    <label
                                        className="label"
                                        htmlFor="postal_code"
                                    >
                                        Code postal *
                                    </label>
                                    <input
                                        id="postal_code"
                                        name="postal_code"
                                        className={`input ${fieldErrors.postal_code ? 'input-error' : ''}`}
                                        value={formData.postal_code}
                                        onChange={handleInputChange}
                                        type="text"
                                    />
                                    <FieldError error={fieldErrors.postal_code} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="password">
                                    Mot de passe *
                                </label>
                                <div className="auth-form__password-field">
                                    <input
                                        id="password"
                                        name="password"
                                        className={`input auth-form__password-input ${fieldErrors.password ? 'input-error' : ''}`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="auth-form__password-toggle"
                                        aria-label={
                                            showPassword
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                                <FieldError error={fieldErrors.password} />
                            </div>

                            <div className="form-group">
                                <label
                                    className="label"
                                    htmlFor="confirmPassword"
                                >
                                    Confirmer le mot de passe *
                                </label>
                                <div className="auth-form__password-field">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`input auth-form__password-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={
                                            toggleConfirmPasswordVisibility
                                        }
                                        className="auth-form__password-toggle"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                                <FieldError error={fieldErrors.confirmPassword} />
                            </div>
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
