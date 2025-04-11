import { Link } from "react-router-dom";
import { buttonLinks } from "./NavbarLinks";

export default function AuthButtons() {
    return (
        <>
            {buttonLinks.map((link) => (
                <li key={link.path}>
                    <Link
                        to={link.path}
                        className={`block py-2 md:py-2 px-4 rounded-lg transition-colors ${
                            link.label === "Connexion"
                                ? "text-primary-600 bg-white hover:bg-gray-100"
                                : "bg-indigo-500 text-white hover:bg-indigo-100 border border-solid border-white"
                        }`}
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </>
    );
}
