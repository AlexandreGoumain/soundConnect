import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/components/_auth-form.scss";
import { useLoginForm } from "./hooks/useLoginForm.js";

function FieldError({ error }) {
    if (!error) return null;
    return <span className="field-error">{error}</span>;
}

export default function LoginForm() {
    const {
        email,
        password,
        error,
        fieldErrors,
        showPassword,
        status,
        user,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
        togglePasswordVisibility,
    } = useLoginForm();

    if (user) {
        return null;
    }

    return (
        <div className="auth-layout">
            <div className="card auth-card">
                <div className="card-header">
                    <h2 className="card-title">Connexion</h2>
                    <p className="card-subtitle">
                        Accédez à votre espace SoundConnect
                    </p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="card-body">
                        {error && (
                            <div className="card auth-form__error-message">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                                value={email}
                                onChange={handleEmailChange}
                                type="email"
                                placeholder="votre@email.com"
                            />
                            <FieldError error={fieldErrors.email} />
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">
                                Mot de passe
                            </label>
                            <div className="auth-form__password-field">
                                <input
                                    id="password"
                                    className={`input auth-form__password-input ${fieldErrors.password ? 'input-error' : ''}`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
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
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <FieldError error={fieldErrors.password} />
                        </div>
                    </div>

                    <div className="card-footer">
                        <button
                            className="btn btn-primary btn-full"
                            disabled={status === "loading"}
                            type="submit"
                        >
                            {status === "loading"
                                ? "Connexion en cours..."
                                : "Connexion"}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p>
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="auth-link">
                            Inscrivez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
