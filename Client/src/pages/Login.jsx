import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useLoginMutation } from "../services/index";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // Utilisation du hook de mutation généré par RTK Query
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs");
            return;
        }

        try {
            // Appel de la mutation
            const result = await login({ email, password }).unwrap();

            // Vérification des données reçues
            console.log("Réponse de la connexion:", result);

            if (!result.token) {
                throw new Error("Aucun token reçu du serveur");
            }

            // Stockage du token dans localStorage
            localStorage.setItem("token", result.token);

            // Vérifier que user existe avant de le stocker
            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            // Redirection
            navigate("/");

            // Rafraîchir la page pour mettre à jour l'état d'authentification
            window.location.reload();
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setErrorMessage(
                error.data?.message ||
                    error.message ||
                    "Échec de la connexion. Veuillez vérifier vos identifiants."
            );
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-center items-center min-h-screen-3-4 p-4 md:p-8">
                <div className="w-full max-w-500 bg-white rounded-md shadow-md p-6 md:p-10">
                    <h1 className="text-xl text-center text-primary-color mb-6">
                        Connexion
                    </h1>

                    {errorMessage && (
                        <div className="bg-error-color bg-opacity-10 text-error-color p-3 rounded mb-6 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block mb-2 font-medium text-text-dark"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                placeholder="votre@email.com"
                                required
                                className="w-full p-3 border border-border-color rounded focus:border-primary-color focus:outline-none focus:shadow-outline-primary text-md disabled:bg-background-color-secondary"
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block mb-2 font-medium text-text-dark"
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="Votre mot de passe"
                                required
                                className="w-full p-3 border border-border-color rounded focus:border-primary-color focus:outline-none focus:shadow-outline-primary text-md disabled:bg-background-color-secondary"
                            />
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="mr-2"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-text-color-secondary"
                                >
                                    Se souvenir de moi
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary-color hover:underline"
                            >
                                Mot de passe oublié?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-color text-white rounded p-3 text-md font-medium cursor-pointer transition-colors hover:bg-primary-color-dark disabled:bg-primary-color-light"
                        >
                            {isLoading
                                ? "Connexion en cours..."
                                : "Se connecter"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-text-color-secondary">
                        Vous n'avez pas de compte?{" "}
                        <Link
                            to="/register"
                            className="text-primary-color font-medium hover:underline"
                        >
                            Inscrivez-vous
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
