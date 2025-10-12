import { useMemo } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../../../components/shared/StarRating.jsx";
import ImageWithFallback from "../../../../components/shared/ImageWithFallback.jsx";
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
    const averageRating = studio.review_stats?.average_rating || 0;
    const totalReviews = studio.review_stats?.total_reviews || 0;

    return (
        <article
            className="studio-card"
            itemScope
            itemType="https://schema.org/MusicVenue"
        >
            <Link
                to={`/studios/${studio.id}`}
                aria-label={`Voir les détails du studio ${studio.name} à ${studio.city}`}
            >
                <figure className="studio-image">
                    {coverImage ? (
                        <ImageWithFallback
                            src={coverImage}
                            alt={`Studio d'enregistrement ${studio.name}`}
                            width="300"
                            height="200"
                            itemProp="image"
                        />
                    ) : (
                        <div
                            className="image-placeholder"
                            role="img"
                            aria-label="Aucune image disponible"
                        >
                            <span>Image indisponible</span>
                        </div>
                    )}
                </figure>
                <div className="studio-info">
                    <h3 className="studio-name" itemProp="name">
                        {studio.name}
                    </h3>
                    <p
                        className="studio-location"
                        itemProp="address"
                        itemScope
                        itemType="https://schema.org/PostalAddress"
                    >
                        <span itemProp="addressLocality">{studio.city}</span> -{" "}
                        <span itemProp="postalCode">{studio.postal_code}</span>
                    </p>
                    <div className="studio-price-rating">
                        <p className="studio-price">
                            <span className="price" itemProp="priceRange">
                                {studio.hourly_rate}€/h
                            </span>
                        </p>
                        <div
                            className="rating"
                            itemProp="aggregateRating"
                            itemScope
                            itemType="https://schema.org/AggregateRating"
                        >
                            <meta
                                itemProp="ratingValue"
                                content={averageRating.toString()}
                            />
                            <meta
                                itemProp="reviewCount"
                                content={totalReviews.toString()}
                            />
                            <StarRating
                                rating={averageRating}
                                showNumber={true}
                                size="small"
                            />
                            <span
                                className="review-count"
                                aria-label={`${totalReviews} avis`}
                            >
                                ({totalReviews} avis)
                            </span>
                        </div>
                    </div>
                    {truncatedDescription && (
                        <p
                            className="studio-description"
                            itemProp="description"
                        >
                            {truncatedDescription}...
                        </p>
                    )}
                    <div
                        className="studio-badges"
                        role="list"
                        aria-label="Labels du studio"
                    >
                        <span className="badge badge-pro" role="listitem">
                            {BADGES.PRO}
                        </span>
                        <span className="badge badge-trending" role="listitem">
                            {BADGES.TRENDING}
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
