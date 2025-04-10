import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./StudioCard.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function StudioCard({ studiosData }) {
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    return (
        <div className="studio-carousel">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="swiper-container"
                breakpoints={{
                    // Mobile: <= 480px (par défaut): 1 slide

                    // Tablet: >= 481px
                    [480]: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    // Desktop: >= 768px
                    [768]: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    // Large Desktop: >= 1024px
                    [1024]: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
            >
                {studiosData.map((studio, index) => {
                    const averageRating = calculateAverageRating(
                        studio.reviews
                    );
                    const reviewCount = studio.reviews?.length || 0;
                    const location = studio.address ? studio.address : "";

                    return (
                        <SwiperSlide key={index}>
                            <div className="studio-card">
                                <div className="studio-card__location">
                                    {location}
                                </div>
                                <h3 className="studio-card__name">
                                    {studio.name}
                                </h3>

                                <div className="studio-card__price">
                                    {studio.hourly_rate}€/h
                                </div>

                                <div className="studio-card__rating">
                                    <span className="rating-score">
                                        {averageRating}
                                    </span>
                                    <span className="review-count">
                                        ({reviewCount} avis)
                                    </span>
                                </div>

                                <p className="studio-card__description">
                                    {studio.description}
                                </p>

                                <div className="studio-card__tags">
                                    <span className="tag tag--pro">Pro</span>
                                    <span className="tag tag--trending">
                                        Tendance
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
