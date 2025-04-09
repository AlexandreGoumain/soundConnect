import "./PresentBestStudios.scss";
import StudioCard from "./StudioCard";

export default function PresentBestStudios({ studios }) {
    return (
        <section className="present-best-studios">
            <h3 className="present-best-studios__title">
                Studios Mis en Avant
            </h3>
            <StudioCard studios={studios} />
        </section>
    );
}
