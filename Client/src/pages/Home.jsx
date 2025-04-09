import Hero from "../components/header/Hero/Hero";
import PresentBestStudios from "../components/PresentBestStudios/PresentBestStudios";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
    return (
        <MainLayout>
            <Hero />
            <PresentBestStudios />
        </MainLayout>
    );
};

export default Home;
