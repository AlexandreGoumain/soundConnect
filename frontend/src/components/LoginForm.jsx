import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginForm() {
    const { login, status, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

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
                    <h2 className="card-title">Bienvenue sur SoundConnect</h2>
                    <p className="card-subtitle">
                        Connectez-vous à votre compte pour continuer
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
                                Adresse email
                            </label>
                            <input
                                id="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Entrez votre email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                required
                            />
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
            </div>
        </div>
    );
}
