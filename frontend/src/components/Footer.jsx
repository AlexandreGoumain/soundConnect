import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h1 className="footer-logo">SoundConnect</h1>
                        <p className="footer-tagline">
                            La meilleure façon de trouver et réserver votre
                            studio d'enregistrement
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4 className="footer-title">Navigation</h4>
                            <ul className="footer-menu">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="footer-link"
                                    >
                                        Rechercher
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="footer-link"
                                    >
                                        Comment ça marche
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Légal</h4>
                            <ul className="footer-menu">
                                <li onClick={() => navigate("/")}>CGU</li>
                                <li onClick={() => navigate("/")}>
                                    Confidentialité
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Suivez-nous</h4>
                            <div className="social-links">
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaFacebook />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaInstagram />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaTwitter />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaYoutube />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
