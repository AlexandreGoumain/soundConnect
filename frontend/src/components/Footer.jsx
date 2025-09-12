import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
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
                                    <a href="/">Rechercher</a>
                                </li>
                                <li>
                                    <a href="/">Comment ça marche</a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Légal</h4>
                            <ul className="footer-menu">
                                <li>
                                    <a href="/cgu">CGU</a>
                                </li>
                                <li>
                                    <a href="/confidentialite">
                                        Confidentialité
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-title">Suivez-nous</h4>
                            <div className="social-links">
                                <a href="#" className="social-link">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="social-link">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="social-link">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="social-link">
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
