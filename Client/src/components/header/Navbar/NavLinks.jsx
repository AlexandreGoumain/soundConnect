import { Link, useLocation } from "react-router-dom";
import { isActive } from "../../../utils/responsive/isActive";
import { links } from "./NavbarLinks";

export default function NavLinks() {
    const { pathname } = useLocation();

    return (
        <ul className="flex flex-col md:flex-row gap-4 md:gap-6 my-4 md:my-0">
            {links.map((link) => (
                <li key={link.path}>
                    <Link
                        to={link.path}
                        className={`block py-2 md:py-0 hover:text-gray-200 transition-colors ${
                            isActive(link.path, pathname)
                                ? "text-white font-semibold"
                                : "text-white"
                        }`}
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
