import { useMemo } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../../../components/StarRating.jsx";
import { resolveStudioImages } from "../../../studio-dashboard/lib/studioImages.js";
import { BADGES, HOME_CONSTANTS } from "../constants/homeConstants.js";

export default function StudioCard({ studio }) {
    const truncatedDescription = studio.description?.slice(
        0,
        HOME_CONSTANTS.DESCRIPTION_TRUNCATE_LENGTH
    );

    const studioImages = useMemo(
        () => resolveStudioImages(studio?.images),
        [studio?.images]
    );

    const coverImage = studioImages[0] || "";

    return (
        <Link to={`/studios/${studio.id}`} className="studio-card">
            <div className="studio-image">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={`Photo du studio ${studio.name}`}
                        loading="lazy"
                    />
                ) : (
                    <div className="image-placeholder">
                        <span>Image indisponible</span>
                    </div>
                )}
            </div>
            <div className="studio-info">
                <h3 className="studio-name">{studio.name}</h3>
                <p className="studio-location">
                    {studio.city} - {studio.postal_code}
                </p>
                <p className="studio-price">
                    <span className="price">{studio.hourly_rate}€/h</span>
                    <div className="rating">
                        <StarRating
                            rating={studio.review_stats?.average_rating || 0}
                            showNumber={true}
                            size="small"
                        />
                        <span className="review-count">
                            ({studio.review_stats?.total_reviews || 0} avis)
                        </span>
                    </div>
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
        </Link>
    );
}
