import "./Header.scss";
import Navbar from "./Navbar/Navbar";

export default function Header() {
    return (
        <header className="header">
            <Navbar />
            <div className="header-content">
                <h1>Bienvenue sur SoundConnect</h1>
                <p>Votre plateforme musicale</p>
            </div>
        </header>
    );
}
