import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function StudioCard({ studios }) {
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    // Vérification que studios est bien un tableau
    if (!studios || !Array.isArray(studios) || studios.length === 0) {
        console.warn("Studios n'est pas un tableau ou est vide", studios);
        return (
            <div className="p-4 text-center text-gray-600">
                Aucun studio disponible pour le moment
            </div>
        );
    }

    return (
        <div className="w-full">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full"
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
                {studios.map((studio, index) => {
                    if (!studio) return null;

                    const averageRating = calculateAverageRating(
                        studio.reviews
                    );
                    const reviewCount = studio.reviews?.length || 0;
                    const location =
                        studio.address || studio.city || studio.location || "";
                    const hourlyRate =
                        studio.hourly_rate || studio.pricePerHour || 0;
                    const name = studio.name || "Studio sans nom";
                    const description =
                        studio.description || "Aucune description disponible";

                    return (
                        <SwiperSlide key={studio._id || index}>
                            <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                                <div className="text-sm text-gray-500 mb-1">
                                    {location}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    {name}
                                </h3>

                                <div className="text-lg font-bold text-primary-600 mb-2">
                                    {hourlyRate}€/h
                                </div>

                                <div className="flex items-center mb-3">
                                    <span className="bg-primary-500 text-white font-bold rounded px-2 py-1 text-sm mr-2">
                                        {averageRating}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({reviewCount} avis)
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-4 flex-1">
                                    {description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {studio.tags && studio.tags.length > 0 ? (
                                        studio.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <>
                                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                                                Pro
                                            </span>
                                            <span className="bg-success-light text-success-dark px-2 py-1 rounded-full text-xs">
                                                Tendance
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
