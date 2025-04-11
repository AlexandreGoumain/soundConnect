import StudioCard from "./StudioCard";

export default function PresentBestStudios({ studios }) {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                Studios Mis en Avant
            </h3>
            <StudioCard studios={studios} />
        </section>
    );
}
