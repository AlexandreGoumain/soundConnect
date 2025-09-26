import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth.js";
import { useToast } from "../../../../hooks/useToast.js";
import { apiClient } from "../../../../lib/apiClient";
import {
    parseStudioImagesField,
    resolveStudioImageSrc,
} from "../../../studio-dashboard/lib/studioImages.js";
import { useAvailability } from "./useAvailability";

// Helper function to calculate end time
function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 60;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`;
}

export function useStudioDetails() {
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
            setError(null);
            const response = await apiClient.get(`/studios/${id}`);
            setStudio(response.data.data.studio);
        } catch (error) {
            error("Error fetching studio details:", error);
            const errorMessage =
                "Erreur lors du chargement des détails du studio";
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    // Initialize data
    useEffect(() => {
        fetchStudioDetails();
        fetchWeeklySchedule();
    }, [fetchStudioDetails, fetchWeeklySchedule]);

    // Process studio images for carousel
    const carouselImages = useMemo(() => {
        if (!studio) return [];
        const parsed = parseStudioImagesField(studio.images);
        return parsed.map((image) => resolveStudioImageSrc(image));
    }, [studio]);

    // Reset image index when images change
    useEffect(() => {
        if (carouselImages.length === 0) {
            setCurrentImageIndex(0);
            return;
        }
        setCurrentImageIndex((previous) =>
            previous >= carouselImages.length ? 0 : previous
        );
    }, [carouselImages.length]);

    // Image carousel computed values
    const activeImage = carouselImages[currentImageIndex] || "";
    const hasMultipleImages = carouselImages.length > 1;

    // Image carousel handlers
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

    // Booking form handlers
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTimeSlot(""); // Reset time slot when date changes
    };

    const handleTimeSlotChange = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(parseInt(e.target.value));
        setSelectedTimeSlot(""); // Reset time slot when duration changes
    };

    const handleSpecialRequestsChange = (e) => {
        setSpecialRequests(e.target.value);
    };

    // Studio booking logic
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

            // Make the reservation
            const reservationData = {
                studio_id: studio.id,
                start_datetime: startDateTime,
                end_datetime: endDateTime,
                special_requests: specialRequests.trim() || "",
            };

            await apiClient.post("/reservations", reservationData);

            showSuccess(
                `Réservation confirmée pour le ${selectedDate} de ${selectedTimeSlot} à ${endTime}`
            );

            // Reset booking form
            setSelectedDate("");
            setSelectedTimeSlot("");
            setSelectedDuration(1);
            setSpecialRequests("");

            // Optionally navigate to bookings page
            navigate("/profile");
        } catch (error) {
            error("Error making reservation:", error);
            const message =
                error?.response?.data?.message ||
                "Erreur lors de la réservation";
            showError(message);
        } finally {
            setIsBooking(false);
        }
    };

    // Get minimum date for date picker (today)
    const minDate = useMemo(() => {
        return new Date().toISOString().split("T")[0];
    }, []);

    // Generate duration options
    const durationOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1);
    }, []);

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

        // Booking form state
        selectedDate,
        selectedTimeSlot,
        selectedDuration,
        specialRequests,
        isBooking,
        minDate,
        durationOptions,

        // Booking form handlers
        handleDateChange,
        handleTimeSlotChange,
        handleDurationChange,
        handleSpecialRequestsChange,
        handleBookStudio,

        // Availability data
        availableSlots,
        availabilityLoading,
        formatTime,
        isStudioOpen,

        // User state
        user,
        canBook: user?.role_name === "artist",
    };
}
