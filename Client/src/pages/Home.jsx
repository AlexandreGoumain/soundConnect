import UserDashboard from "../layouts/UserDashboard";

const Home = () => {
    return (
        <UserDashboard>
            <div className="home-page">
                <section className="hero-section">
                    <div className="container">
                        <h1>Bienvenue sur SoundConnect</h1>
                        <p>
                            Découvrez, connectez et partagez votre passion pour
                            la musique
                        </p>
                    </div>
                </section>

                <section className="featured-section">
                    <div className="container">
                        <h2>Contenus populaires</h2>
                        <div className="featured-content">
                            {/* Featured content will go here */}
                            <p>Chargement des contenus en cours...</p>
                        </div>
                    </div>
                </section>
            </div>
        </UserDashboard>
    );
};

export default Home;
