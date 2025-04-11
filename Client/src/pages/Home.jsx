import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useGetStudiosQuery } from "../services/index";
import Error from "./Error";
import Loading from "./Loading";

// Composants importés
import FeaturedStudios from "../components/home/FeaturedStudios";
import HomeHero from "../components/home/HomeHero";
import HowItWorks from "../components/home/HowItWorks";

const Home = () => {
    // Utilisation du hook RTK Query pour récupérer les studios
    const { data: studios, isLoading, isError } = useGetStudiosQuery();

    return (
        <MainLayout>
            {/* Hero Section */}
            <HomeHero />

            {/* Featured Studios Section */}
            <FeaturedStudios
                studios={studios}
                isLoading={isLoading}
                isError={isError}
                ErrorComponent={<Error />}
                LoadingComponent={<Loading />}
            />

            {/* How It Works Section */}
            <HowItWorks />
        </MainLayout>
    );
};

export default Home;
