import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./StudioCard.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function StudioCard({ studios }) {
    const studiosData = studios || [
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 1,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
                {
                    rating: 3,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
    ];

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
