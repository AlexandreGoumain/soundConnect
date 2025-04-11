import { FaBars, FaTimes } from "react-icons/fa";

export default function MobileMenuButton({ menuOpen, toggleMenu }) {
    return (
        <button
            className="text-white hover:text-gray-200 text-xl p-2"
            onClick={toggleMenu}
        >
            {menuOpen ? <FaTimes color="black" /> : <FaBars color="black" />}
        </button>
    );
}
