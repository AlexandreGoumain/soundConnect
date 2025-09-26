import { Link } from "react-router-dom";
import InputField from "../../../components/shared/InputField.jsx";
import PasswordField from "../../../components/shared/PasswordField.jsx";
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

                        <InputField
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="votre@email.com"
                            error={fieldErrors.email}
                        />

                        <PasswordField
                            id="password"
                            label="Mot de passe"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            showPassword={showPassword}
                            onTogglePassword={togglePasswordVisibility}
                            placeholder="********"
                            error={fieldErrors.password}
                        />
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
