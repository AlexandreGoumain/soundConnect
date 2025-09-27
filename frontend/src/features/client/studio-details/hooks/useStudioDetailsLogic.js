import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth.js";
import { useToast } from "../../../../hooks/useToast.js";
import { apiClient } from "../../../../lib/apiClient";
import {
    formatTimeFromComponents,
    getFutureDateISO,
    getNextHourTime,
    getTodayISO,
} from "../../../../lib/dateUtils.js";
import {
    parseStudioImagesField,
    resolveStudioImageSrc,
} from "../../../studio-dashboard/lib/studioImages.js";
import { useAvailability } from "./useAvailability";

export function useStudioDetailsLogic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    // Studio state
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Image carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Booking form state
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

    // Fetch studio details
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

    // Image carousel logic
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

    // Booking handlers
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

    const handleSpecialRequestsChange = (e) => {
        setSpecialRequests(e.target.value);
    };

    const handleCarouselIndicatorClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Utility functions
    const calculateEndTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(
            startDate.getTime() + duration * 60 * 60 * 1000
        );
        return formatTimeFromComponents(
            endDate.getHours(),
            endDate.getMinutes()
        );
    };

    const getMinDate = () => {
        return getTodayISO();
    };

    const getMaxDate = () => {
        return getFutureDateISO(30); // 30 days in advance
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

    const getTotalPrice = () => {
        if (!studio || !selectedDate || !selectedTimeSlot) return 0;
        return parseFloat(studio.hourly_rate) * selectedDuration;
    };

    const getNoSlotsMessage = () => {
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDateObj.getTime() === today.getTime()) {
            const now = new Date();
            return `Aucun créneau disponible pour aujourd'hui. Prochains créneaux disponibles à partir de ${getNextHourTime(
                now
            )} (réservation minimum 1h à l'avance)`;
        } else if (!isStudioOpen(selectedDate)) {
            return "Le studio est fermé ce jour";
        } else {
            return "Aucun créneau disponible pour cette date";
        }
    };

    return {
        // Studio data
        studio,
        loading,
        error,

        // Image carousel
        carouselImages,
        currentImageIndex,
        activeImage,
        hasMultipleImages,
        showPrevImage,
        showNextImage,
        handleCarouselIndicatorClick,

        // Booking form
        selectedDate,
        selectedTimeSlot,
        selectedDuration,
        specialRequests,
        isBooking,
        handleDateChange,
        handleDurationChange,
        handleTimeSlotSelect,
        handleSpecialRequestsChange,
        handleBookStudio,

        // Availability
        availableSlots,
        availabilityLoading,
        formatTime,

        // Utilities
        formatAddress,
        getTotalPrice,
        getMinDate,
        getMaxDate,
        calculateEndTime,
        getNoSlotsMessage,

        // Navigation
        navigate,
    };
}
