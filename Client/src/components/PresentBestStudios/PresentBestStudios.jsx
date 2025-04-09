import StudioCard from "./StudioCard";

export default function PresentBestStudios({ studios }) {
    return (
        <section>
            <h3>Studios Mis en Avant</h3>
            <StudioCard studios={studios} />
        </section>
    );
}
