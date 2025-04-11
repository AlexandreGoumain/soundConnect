import Navbar from "./Navbar/Navbar";

export default function Header() {
    return (
        <header className="w-full bg-red">
            <Navbar />
            <div className="text-center w-full">
                <h1 className="text-xl md:text-xxl lg:text-3xl text-white">
                    Bienvenue sur SoundConnect
                </h1>
                <p className="text-md md:text-lg lg:text-xl text-white">
                    Votre plateforme musicale
                </p>
            </div>
        </header>
    );
}
