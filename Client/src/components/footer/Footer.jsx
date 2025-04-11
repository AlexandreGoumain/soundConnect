import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
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
        <footer className="flex flex-col md:flex-row justify-between bg-background-primary gap-5">
            <section className="w-full p-2">
                <h1 className="text-xl md:text-xl lg:text-xxl font-bold text-white m-0 mb-3">
                    SoundConnect
                </h1>
                <p className="text-sm text-text-color-secondary">
                    La meilleure façon de trouver et réserver votre studio
                    d'enregistrement
                </p>
            </section>
            <section className="w-full p-2">
                <h2 className="text-md md:text-lg font-bold m-0 mb-3">
                    Navigation
                </h2>
                <ul className="my-1 flex flex-col gap-1">
                    {footerLinksNavigation.map((link) => (
                        <li key={link.path} className="md:text-md">
                            <Link
                                to={link.path}
                                className="text-text-color-secondary"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="w-full p-2">
                <h2 className="text-md md:text-lg font-bold m-0 mb-3">Légal</h2>
                <ul className="my-1 flex flex-col gap-1">
                    {footerLinksLegal.map((link) => (
                        <li key={link.path} className="md:text-md">
                            <Link
                                to={link.path}
                                className="text-text-color-secondary"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="w-full p-2">
                <h2 className="text-md md:text-lg font-bold m-0 mb-3">
                    Suivez-nous
                </h2>
                <ul className="flex flex-row text-md md:text-xl lg:text-xxl gap-6">
                    {footerLinksSocial.map((link) => (
                        <li key={link.label}>
                            <Link
                                to={link.path}
                                className="text-text-color-secondary"
                            >
                                {renderIcon(link.icon)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </footer>
    );
}
