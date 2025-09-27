import HeroSection from "./components/HeroSection.jsx";
import HowItWorksSection from "./components/HowItWorksSection.jsx";
import StudiosSection from "./components/StudiosSection.jsx";
import { useStudios } from "./hooks/useStudios.js";

export default function Home() {
    const { studios, loading, error } = useStudios();

    return (
        <>
            <HeroSection />
            <StudiosSection studios={studios} loading={loading} error={error} />
            <HowItWorksSection />
        </>
    );
}
