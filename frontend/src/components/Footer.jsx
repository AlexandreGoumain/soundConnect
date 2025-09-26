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
                                    <a onClick={() => navigate("/")}>
                                        Rechercher
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => navigate("/")}>
                                        Comment ça marche
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Légal</h4>
                            <ul className="footer-menu">
                                <li onClick={() => navigate("/")}>navCGU</li>
                                <li onClick={() => navigate("/")}>
                                    Confidentialité
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Suivez-nous</h4>
                            <div className="social-links">
                                <a
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaFacebook />
                                </a>
                                <a
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaTwitter />
                                </a>
                                <a
                                    onClick={() => navigate("/")}
                                    className="social-link"
                                >
                                    <FaYoutube />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
