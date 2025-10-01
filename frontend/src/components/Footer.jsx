import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <p className="footer-logo">SoundConnect</p>
                        <p className="footer-tagline">
                            La meilleure façon de trouver et réserver votre
                            studio d'enregistrement
                        </p>
                    </div>

                    <div className="footer-links">
                        <nav
                            className="footer-column"
                            aria-label="Navigation secondaire"
                        >
                            <h4 className="footer-title">Navigation</h4>
                            <ul className="footer-menu">
                                <li>
                                    <Link to="/studios" className="footer-link">
                                        Rechercher
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/#how-it-works"
                                        className="footer-link"
                                    >
                                        Comment ça marche
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <nav
                            className="footer-column"
                            aria-label="Mentions légales"
                        >
                            <h4 className="footer-title">Légal</h4>
                            <ul className="footer-menu">
                                <li>
                                    <a href="#" className="footer-link">
                                        CGU
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">
                                        Confidentialité
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <div className="footer-column">
                            <h4 className="footer-title">Suivez-nous</h4>
                            <nav aria-label="Réseaux sociaux">
                                <ul className="social-links">
                                    <li>
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label="Suivez-nous sur Facebook"
                                        >
                                            <FaFacebook aria-hidden="true" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label="Suivez-nous sur Instagram"
                                        >
                                            <FaInstagram aria-hidden="true" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label="Suivez-nous sur Twitter"
                                        >
                                            <FaTwitter aria-hidden="true" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://youtube.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label="Suivez-nous sur YouTube"
                                        >
                                            <FaYoutube aria-hidden="true" />
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
