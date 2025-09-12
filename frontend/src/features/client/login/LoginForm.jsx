import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function LoginForm() {
    const { login, status, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError(err?.response?.data?.message || "Connexion échouée");
        }
    };

    if (user) {
        navigate("/");
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

                <form className="form" onSubmit={onSubmit}>
                    <div className="card-body">
                        {error && (
                            <div
                                className="card"
                                style={{
                                    borderColor: "var(--error)",
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                }}
                            >
                                <p
                                    className="text-sm"
                                    style={{
                                        color: "var(--error)",
                                        marginBottom: 0,
                                    }}
                                >
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">
                                Mot de passe
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    required
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        right: "0.75rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--text-secondary)",
                                        fontSize: "1.1rem",
                                    }}
                                    aria-label={
                                        showPassword
                                            ? "Masquer le mot de passe"
                                            : "Afficher le mot de passe"
                                    }
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
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
                        Pas encore de compte ? {" "}
                        <Link to="/register" className="auth-link">
                            Inscrivez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}