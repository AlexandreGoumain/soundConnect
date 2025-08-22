import { HOME_CONSTANTS, BADGES } from "../constants/homeConstants.js";

export default function StudioCard({ studio }) {
    const truncatedDescription = studio.description?.slice(
        0,
        HOME_CONSTANTS.DESCRIPTION_TRUNCATE_LENGTH
    );

    return (
        <div className="studio-card">
            <div className="studio-image">
                <div className="image-placeholder"></div>
            </div>
            <div className="studio-info">
                <h3 className="studio-name">{studio.name}</h3>
                <p className="studio-location">
                    {studio.city} - {studio.postal_code}
                </p>
                <p className="studio-price">
                    <span className="price">{studio.hourly_rate}€/h</span>
                    <span className="rating">
                        {HOME_CONSTANTS.DEFAULT_RATING} (
                        {HOME_CONSTANTS.DEFAULT_REVIEWS_COUNT})
                    </span>
                </p>
                <p className="studio-description">
                    {truncatedDescription}
                    {truncatedDescription && "..."}
                </p>
                <div className="studio-badges">
                    <span className="badge badge-pro">{BADGES.PRO}</span>
                    <span className="badge badge-trending">
                        {BADGES.TRENDING}
                    </span>
                </div>
            </div>
        </div>
    );
}