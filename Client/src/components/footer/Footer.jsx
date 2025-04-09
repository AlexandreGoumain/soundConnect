import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.scss";
import {
    footerLinksLegal,
    footerLinksNavigation,
    footerLinksSocial,
} from "./footerLink";
export default function Footer() {
    // Function to render the correct icon based on the icon name
    const renderIcon = (iconName) => {
        switch (iconName) {
            case "FaFacebook":
                return <FaFacebook />;
            case "FaTwitter":
                return <FaTwitter />;
            case "FaInstagram":
                return <FaInstagram />;
            case "FaLinkedin":
                return <FaLinkedin />;
            default:
                return null;
        }
    };

    return (
        <footer className="footer">
            <section>
                <h1 className="logo">SoundConnect</h1>
                <p>
                    La meilleure façon de trouver et réserver votre studio
                    d'enregistrement
                </p>
            </section>
            <section>
                <h2>Navigation</h2>
                <ul>
                    {footerLinksNavigation.map((link) => (
                        <li key={link.path}>
                            <Link to={link.path}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Légal</h2>
                <ul>
                    {footerLinksLegal.map((link) => (
                        <li key={link.path}>
                            <Link to={link.path}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Suivez-nous</h2>
                <ul className="social-links">
                    {footerLinksSocial.map((link) => (
                        <li key={link.label}>
                            <Link to={link.path}>{renderIcon(link.icon)}</Link>
                        </li>
                    ))}
                </ul>
            </section>
        </footer>
    );
}
