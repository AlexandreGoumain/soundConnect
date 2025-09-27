import { useCallback, useState } from "react";
import { useToast } from "../../../../hooks/useToast.js";
import { apiClient } from "../../../../lib/apiClient";
import { getDayOfWeek } from "../../../../lib/dateUtils.js";

export const useAvailability = (studioId) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showError } = useToast();

    // Fetch available slots for a specific date
    const fetchAvailableSlots = useCallback(
        async (date, duration = 1) => {
            if (!studioId || !date) return;

            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.get(
                    `/availability/${studioId}/slots?date=${date}&duration=${duration}`
                );

                setAvailableSlots(response.data.data.available_slots || []);
            } catch {
                showError("Erreur lors du chargement des créneaux disponibles");
                setAvailableSlots([]);
            } finally {
                setLoading(false);
            }
        },
        [studioId, showError]
    );

    // Fetch weekly schedule
    const fetchWeeklySchedule = useCallback(async () => {
        if (!studioId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get(
                `/availability/${studioId}/schedule`
            );

            setWeeklySchedule(response.data.data.weekly_schedule || {});
        } catch {
            showError("Erreur lors du chargement des horaires");
            setWeeklySchedule({});
        } finally {
            setLoading(false);
        }
    }, [studioId, showError]);

    // Check if a specific slot is available
    const checkSlotAvailability = useCallback(
        async (date, startTime, endTime) => {
            if (!studioId || !date || !startTime || !endTime) return false;

            try {
                const response = await apiClient.post(
                    `/availability/${studioId}/check`,
                    {
                        date,
                        start_time: startTime,
                        end_time: endTime,
                    }
                );

                return response.data.data.available;
            } catch {
                showError(
                    "Erreur lors de la vérification de la disponibilité du créneau"
                );
                return false;
            }
        },
        [studioId, showError]
    );

    // Get availability for a date range (for calendar view)
    const fetchAvailabilityRange = useCallback(
        async (startDate, endDate) => {
            if (!studioId || !startDate || !endDate) return {};

            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.get(
                    `/availability/${studioId}/range?start_date=${startDate}&end_date=${endDate}`
                );

                return response.data.data.availability || {};
            } catch {
                showError("Erreur lors du chargement des disponibilités");
                return {};
            } finally {
                setLoading(false);
            }
        },
        [studioId, showError]
    );

    // Format time for display
    const formatTime = useCallback((timeString) => {
        const [hours, minutes] = timeString.split(":");
        return `${hours}:${minutes}`;
    }, []);

    // Check if studio is open on a specific day
    const isStudioOpen = useCallback(
        (date) => {
            const targetDate = new Date(date);
            const dayOfWeek = getDayOfWeek(targetDate);
            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const dayName = dayNames[dayOfWeek];

            const daySchedule = weeklySchedule[dayName];
            return daySchedule && daySchedule.is_open;
        },
        [weeklySchedule]
    );

    return {
        availableSlots,
        weeklySchedule,
        loading,
        error,
        fetchAvailableSlots,
        fetchWeeklySchedule,
        checkSlotAvailability,
        fetchAvailabilityRange,
        formatTime,
        isStudioOpen,
    };
};
