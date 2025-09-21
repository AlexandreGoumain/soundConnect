import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewsSection from "../../../components/ReviewsSection.jsx";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { apiClient } from "../../../lib/apiClient";
import {
    parseStudioImagesField,
    resolveStudioImageSrc,
} from "../../studio-dashboard/lib/studioImages.js";
import { useAvailability } from "./hooks/useAvailability";
import "./StudioDetails.scss";

const StudioDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [studio, setStudio] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    // Use availability hook
    const {
        availableSlots,
        loading: availabilityLoading,
        fetchAvailableSlots,
        fetchWeeklySchedule,
        formatTime,
        isStudioOpen,
    } = useAvailability(id);

    const fetchStudioDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/studios/${id}`);
            setStudio(response.data.data.studio);
        } catch (error) {
            console.error("Error fetching studio details:", error);
            setError("Erreur lors du chargement des détails du studio");
            showError("Erreur lors du chargement des détails du studio");
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useEffect(() => {
        fetchStudioDetails();
        fetchWeeklySchedule();
    }, [fetchStudioDetails, fetchWeeklySchedule]);

    const carouselImages = useMemo(() => {
        if (!studio) return [];
        const parsed = parseStudioImagesField(studio.images);
        return parsed.map((image) => resolveStudioImageSrc(image));
    }, [studio]);

    useEffect(() => {
        if (carouselImages.length === 0) {
            setCurrentImageIndex(0);
            return;
        }
        setCurrentImageIndex((previous) =>
            previous >= carouselImages.length ? 0 : previous
        );
    }, [carouselImages.length]);

    const activeImage = carouselImages[currentImageIndex] || "";
    const hasMultipleImages = carouselImages.length > 1;

    const showPrevImage = useCallback(() => {
        if (carouselImages.length <= 1) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? carouselImages.length - 1 : prev - 1
        );
    }, [carouselImages.length]);

    const showNextImage = useCallback(() => {
        if (carouselImages.length <= 1) return;
        setCurrentImageIndex((prev) =>
            prev === carouselImages.length - 1 ? 0 : prev + 1
        );
    }, [carouselImages.length]);

    // Fetch available slots when date or duration changes
    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots(selectedDate, selectedDuration);
        }
    }, [selectedDate, selectedDuration, fetchAvailableSlots]);

    const handleBookStudio = async () => {
        if (!user) {
            showError("Vous devez être connecté pour réserver");
            navigate("/login");
            return;
        }

        // Check if user has the right role to make reservations
        if (user.role_name !== "artist") {
            showError("Seuls les artistes peuvent réserver des studios");
            return;
        }

        if (!selectedDate) {
            showError("Veuillez sélectionner une date");
            return;
        }

        if (!selectedTimeSlot) {
            showError("Veuillez sélectionner un créneau horaire");
            return;
        }

        try {
            setIsBooking(true);
            const endTime = calculateEndTime(
                selectedTimeSlot,
                selectedDuration
            );

            // Create datetime strings for the reservation
            const startDateTime = `${selectedDate}T${selectedTimeSlot}:00`;
            const endDateTime = `${selectedDate}T${endTime}:00`;

            // First, check if the slot is still available
            const availabilityResponse = await apiClient.post(
                `/availability/${studio.id}/check`,
                {
                    date: selectedDate,
                    start_time: selectedTimeSlot,
                    end_time: endTime,
                }
            );

            if (!availabilityResponse.data.data.available) {
                showError(
                    "Ce créneau n'est plus disponible. Veuillez en sélectionner un autre."
                );
                // Refresh available slots
                await fetchAvailableSlots(selectedDate, selectedDuration);
                return;
            }

            // Create the reservation
            const response = await apiClient.post("/reservations", {
                studio_id: studio.id,
                start_datetime: startDateTime,
                end_datetime: endDateTime,
                special_requests: specialRequests.trim() || "",
            });

            if (response.data.success) {
                const confirmationMessage = specialRequests.trim()
                    ? `Réservation confirmée pour le ${selectedDate} de ${selectedTimeSlot} à ${endTime} (${selectedDuration}h). Vos demandes spéciales ont été transmises.`
                    : `Réservation confirmée pour le ${selectedDate} de ${selectedTimeSlot} à ${endTime} (${selectedDuration}h)`;

                showSuccess(confirmationMessage);

                // Reset form
                setSelectedDate("");
                setSelectedTimeSlot("");
                setSelectedDuration(1);
                setSpecialRequests("");

                // Optionally redirect to reservations page or show confirmation
                // navigate("/reservations");
            } else {
                showError("Erreur lors de la création de la réservation");
            }
        } catch (error) {
            console.error("Error creating reservation:", error);
            console.error("Error response:", error.response?.data);

            // Handle specific error messages
            if (error.response?.data?.message) {
                showError(error.response.data.message);
            } else {
                showError("Erreur lors de la création de la réservation");
            }
        } finally {
            setIsBooking(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTimeSlot(""); // Reset selected time when date changes
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(parseInt(e.target.value));
        setSelectedTimeSlot(""); // Reset selected time when duration changes
    };

    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };

    const calculateEndTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(
            startDate.getTime() + duration * 60 * 60 * 1000
        );
        return `${endDate.getHours().toString().padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30); // 30 days in advance
        return maxDate.toISOString().split("T")[0];
    };

    const formatAddress = () => {
        if (!studio) return "";
        const parts = [
            studio.street_number,
            studio.street_name,
            studio.postal_code,
            studio.city,
        ].filter(Boolean);
        return parts.join(" ");
    };

    if (loading) {
        return (
            <div className="studio-details loading">
                <div className="container">
                    <div className="loading-spinner">Chargement...</div>
                </div>
            </div>
        );
    }

    if (error || !studio) {
        return (
            <div className="studio-details error">
                <div className="container">
                    <div className="error-message">
                        <h2>Studio non trouvé</h2>
                        <p>
                            Le studio que vous recherchez n'existe pas ou a été
                            supprimé.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/")}
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="studio-details">
            <div className="container">
                {/* Image Gallery with Carousel */}
                <div className="studio-gallery">
                    <div className="main-image">
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={`Photo ${
                                    currentImageIndex + 1
                                } du studio ${studio.name}`}
                                loading="lazy"
                            />
                        ) : (
                            <div className="image-placeholder">
                                <span>Image du studio</span>
                            </div>
                        )}
                        {hasMultipleImages && (
                            <Fragment>
                                <button
                                    type="button"
                                    className="carousel-btn prev"
                                    onClick={showPrevImage}
                                >
                                    {"\u2039"}
                                </button>
                                <button
                                    type="button"
                                    className="carousel-btn next"
                                    onClick={showNextImage}
                                >
                                    {"\u203a"}
                                </button>
                            </Fragment>
                        )}
                    </div>
                    <div className="carousel-indicators">
                        {carouselImages.length > 0 ? (
                            carouselImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${
                                        index === currentImageIndex
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            setCurrentImageIndex(index);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                ></span>
                            ))
                        ) : (
                            <span className="indicator active"></span>
                        )}
                    </div>
                </div>

                {/* Studio Overview */}
                <div className="studio-overview">
                    <h1 className="studio-name">{studio.name}</h1>
                    <div className="studio-meta">
                        <span className="studio-location">
                            {formatAddress()}
                        </span>
                        <span className="studio-rating">
                            {studio.review_stats?.average_rating
                                ? studio.review_stats.average_rating.toFixed(1)
                                : "N/A"}{" "}
                            ({studio.review_stats?.total_reviews || 0} avis)
                        </span>
                    </div>

                    {/* Tags/Badges */}
                    {studio.tags && (
                        <div className="studio-badges">
                            {studio.tags.split(",").map((tag, index) => (
                                <span key={index} className="badge">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Equipment Section */}
                {studio.equipment_list && (
                    <div className="studio-equipment">
                        <h2>Équipements</h2>
                        <div className="equipment-list">
                            {studio.equipment_list
                                .split(",")
                                .map((equipment, index) => (
                                    <div key={index} className="equipment-item">
                                        <span className="equipment-icon">
                                            ✓
                                        </span>
                                        <span className="equipment-name">
                                            {equipment.trim()}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Description Section */}
                <div className="studio-description">
                    <h2>Description</h2>
                    <p>
                        {studio.description || "Aucune description disponible."}
                    </p>
                </div>

                {/* Booking Section */}
                <div className="studio-booking">
                    <div className="booking-price">
                        <div className="price-info">
                            <span className="hourly-rate">
                                {parseFloat(studio.hourly_rate).toFixed(0)}€/h
                            </span>
                            {selectedDate && selectedTimeSlot && (
                                <span className="total-price">
                                    Total:{" "}
                                    {(
                                        parseFloat(studio.hourly_rate) *
                                        selectedDuration
                                    ).toFixed(0)}
                                    €
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="booking-form">
                        <div className="date-selection">
                            <label>Sélectionnez une date</label>
                            <input
                                type="date"
                                className="date-input"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={getMinDate()}
                                max={getMaxDate()}
                            />
                        </div>

                        <div className="duration-selection">
                            <label>Durée de la réservation</label>
                            <select
                                className="duration-select"
                                value={selectedDuration}
                                onChange={handleDurationChange}
                            >
                                <option value={1}>1 heure</option>
                                <option value={2}>2 heures</option>
                                <option value={3}>3 heures</option>
                                <option value={4}>4 heures</option>
                                <option value={5}>5 heures</option>
                                <option value={6}>6 heures</option>
                                <option value={8}>8 heures</option>
                            </select>
                        </div>

                        <div className="special-requests">
                            <label>Demandes spéciales (optionnel)</label>
                            <textarea
                                className="special-requests-input"
                                value={specialRequests}
                                onChange={(e) =>
                                    setSpecialRequests(e.target.value)
                                }
                                placeholder="Ex: Équipement spécifique, configuration particulière, etc."
                                rows={3}
                                maxLength={500}
                            />
                            <div className="character-count">
                                {specialRequests.length}/500 caractères
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="time-slots">
                                {availabilityLoading ? (
                                    <div className="loading-slots">
                                        Chargement des créneaux...
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={`time-slot ${
                                                selectedTimeSlot ===
                                                slot.start_time
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleTimeSlotSelect(
                                                    slot.start_time
                                                )
                                            }
                                        >
                                            <div className="time-slot-content">
                                                <span className="start-time">
                                                    {formatTime(
                                                        slot.start_time
                                                    )}
                                                </span>
                                                <span className="end-time">
                                                    -{" "}
                                                    {calculateEndTime(
                                                        slot.start_time,
                                                        selectedDuration
                                                    )}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="no-slots">
                                        {(() => {
                                            const selectedDateObj = new Date(
                                                selectedDate
                                            );
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            if (
                                                selectedDateObj.getTime() ===
                                                today.getTime()
                                            ) {
                                                const now = new Date();
                                                const nextHour = new Date(now);
                                                nextHour.setHours(
                                                    now.getHours() + 1,
                                                    0,
                                                    0,
                                                    0
                                                );
                                                return `Aucun créneau disponible pour aujourd'hui. Prochains créneaux disponibles à partir de ${nextHour.getHours()}:00 (réservation minimum 1h à l'avance)`;
                                            } else if (
                                                !isStudioOpen(selectedDate)
                                            ) {
                                                return "Le studio est fermé ce jour";
                                            } else {
                                                return "Aucun créneau disponible pour cette date";
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="booking-actions">
                            <button
                                className="btn btn-primary btn-reserve"
                                onClick={handleBookStudio}
                                disabled={
                                    !selectedDate ||
                                    !selectedTimeSlot ||
                                    isBooking
                                }
                            >
                                {isBooking
                                    ? "Réservation en cours..."
                                    : "Réserver"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsSection studioId={studio.id} studioName={studio.name} />
            </div>
        </div>
    );
};

export default StudioDetails;
