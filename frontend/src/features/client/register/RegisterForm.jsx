import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaMicrophone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { apiClient } from "../../../lib/apiClient.js";

// Map backend role names to UI labels/icons
const ROLE_DISPLAY = {
    artist: { label: "Artiste", icon: FaUser },
    studio: { label: "Studio", icon: FaMicrophone },
};

export default function RegisterForm() {
    const { register, status, user } = useAuth();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState(null);
    const [roles, setRoles] = useState([]);
    const [rolesStatus, setRolesStatus] = useState("idle"); // idle | loading | error | success
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        postal_code: ""
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchRoles() {
            try {
                setRolesStatus("loading");
                const res = await apiClient.get("/roles");
                const fetched = res?.data?.data?.roles || [];
                if (!mounted) return;
                setRoles(fetched);
                setRolesStatus("success");
            } catch (e) {
                if (!mounted) return;
                setRolesStatus("error");
            }
        }
        fetchRoles();
        return () => {
            mounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAccountTypeSelect = (role) => {
        const display = ROLE_DISPLAY[role.name] || { label: role.name };
        setAccountType({ id: role.id, name: role.name, label: display.label });
        setStep(2);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role_id: accountType.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                city: formData.city,
                postal_code: formData.postal_code
            };

            await register(payload);
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Inscription échouée");
        }
    };

    if (user) {
        navigate("/");
        return null;
    }

    return (
        <div className="auth-layout">
            <div className="card auth-card">
                <div className="card-header">
                    <h2 className="card-title">
                        {step === 1 ? "Créez votre compte" : `Inscription ${accountType?.name}`}
                    </h2>
                    <p className="card-subtitle">
                        {step === 1 ? "Rejoignez la communauté SoundConnect" : "Complétez vos informations"}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="card-body">
                        <div className="account-type-selection">
                            <h3 className="section-title">Choisissez votre type de compte</h3>
                            
                            <div className="account-types">
                                <div 
                                    className="account-type-card"
                                    onClick={() => { const r = roles.find(x => x.name === "artist"); if (r) handleAccountTypeSelect(r); }}
                                >
                                    <div className="account-type-icon">
                                        <FaUser />
                                    </div>
                                    <h4>Artiste</h4>
                                    <p>Réservez des studios et gérez vos sessions d'enregistrement</p>
                                </div>

                                <div 
                                    className="account-type-card"
                                    onClick={() => { const r = roles.find(x => x.name === "studio"); if (r) handleAccountTypeSelect(r); }}
                                >
                                    <div className="account-type-icon">
                                        <FaMicrophone />
                                    </div>
                                    <h4>Studio</h4>
                                    <p>Gérez votre studio et recevez des réservations</p>
                                </div>
                            </div>
                        </div>

                        <div className="auth-footer">
                            <p>
                                Déjà un compte ? {" "}
                                <Link to="/login" className="auth-link">
                                    Connectez-vous
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label" htmlFor="first_name">
                                        Prénom *
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        className="input"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="last_name">
                                        Nom *
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        className="input"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="username">
                                    Nom d'utilisateur *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    className="input"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="phone">
                                    Téléphone *
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    className="input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    type="tel"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label" htmlFor="city">
                                        Ville *
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        className="input"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label" htmlFor="postal_code">
                                        Code postal *
                                    </label>
                                    <input
                                        id="postal_code"
                                        name="postal_code"
                                        className="input"
                                        value={formData.postal_code}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="password">
                                    Mot de passe *
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        id="password"
                                        name="password"
                                        className="input"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type={showPassword ? "text" : "password"}
                                        required
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
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

                            <div className="form-group">
                                <label className="label" htmlFor="confirmPassword">
                                    Confirmer le mot de passe *
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="input"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                            showConfirmPassword
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setStep(1)}
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
                                Déjà un compte ? {" "}
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
