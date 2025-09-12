import { pool } from "../config/database.js";

class AvailabilityController {
    // Get available time slots for a specific date
    static async getAvailableSlots(req, res) {
        try {
            const { studio_id } = req.params;
            const { date, duration = 1 } = req.query;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: "Date parameter is required",
                });
            }

            // Validate duration
            const durationHours = parseInt(duration);
            if (
                isNaN(durationHours) ||
                durationHours < 1 ||
                durationHours > 12
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Duration must be between 1 and 12 hours",
                });
            }

            // Validate date format
            const targetDate = new Date(date);
            if (isNaN(targetDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format. Use YYYY-MM-DD",
                });
            }

            // Check if date is not in the past
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (targetDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot book for past dates",
                });
            }

            // Get studio schedule
            const [studios] = await pool.execute(
                "SELECT schedule FROM studios WHERE id = ?",
                [studio_id]
            );

            if (studios.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            const schedule = studios[0].schedule;
            if (!schedule) {
                return res.json({
                    success: true,
                    data: {
                        studio_id,
                        date,
                        available_slots: [],
                        total_slots: 0,
                    },
                });
            }

            // Get day name from date
            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const dayName = dayNames[targetDate.getDay()];
            const daySchedule = schedule[dayName];

            if (!daySchedule || !daySchedule.is_open) {
                return res.json({
                    success: true,
                    data: {
                        studio_id,
                        date,
                        available_slots: [],
                        total_slots: 0,
                    },
                });
            }

            // Get existing reservations for this date
            const [reservations] = await pool.execute(
                `SELECT start_datetime, end_datetime 
                 FROM reservations 
                 WHERE studio_id = ? 
                 AND DATE(start_datetime) = DATE(?) 
                 AND status IN ('confirmed', 'pending')`,
                [studio_id, date]
            );

            // Generate available time slots
            const availableSlots = [];
            const slotDuration = durationHours * 60; // Convert hours to minutes
            const openTime = new Date(`${date}T${daySchedule.open_time}:00`);
            const closeTime = new Date(`${date}T${daySchedule.close_time}:00`);

            // If it's today, start from current time + 1 hour (minimum advance booking)
            let currentTime = new Date(openTime);
            if (targetDate.getTime() === today.getTime()) {
                // Calculate minimum advance time (1 hour from now)
                const minimumAdvanceTime = new Date(
                    now.getTime() + 60 * 60 * 1000
                );

                // Round up to the next hour for slot generation
                const nextSlotTime = new Date(minimumAdvanceTime);
                nextSlotTime.setMinutes(0, 0, 0); // Round to the hour

                // If the rounded time is before minimum advance time, move to next hour
                if (nextSlotTime < minimumAdvanceTime) {
                    nextSlotTime.setHours(nextSlotTime.getHours() + 1);
                }

                // Start from the calculated time if it's within opening hours
                if (nextSlotTime >= openTime && nextSlotTime < closeTime) {
                    currentTime = nextSlotTime;
                } else if (nextSlotTime >= closeTime) {
                    // No more slots available today
                    return res.json({
                        success: true,
                        data: {
                            studio_id,
                            date,
                            available_slots: [],
                            total_slots: 0,
                        },
                    });
                }
            }

            while (currentTime < closeTime) {
                const slotEnd = new Date(
                    currentTime.getTime() + slotDuration * 60000
                );

                // Skip if slot end time is past closing time
                if (slotEnd > closeTime) {
                    break;
                }

                // Check if this slot conflicts with existing reservations
                const isAvailable = !reservations.some((reservation) => {
                    const resStart = new Date(reservation.start_datetime);
                    const resEnd = new Date(reservation.end_datetime);

                    return currentTime < resEnd && slotEnd > resStart;
                });

                if (isAvailable) {
                    availableSlots.push({
                        start_time: currentTime.toTimeString().slice(0, 5),
                        end_time: slotEnd.toTimeString().slice(0, 5),
                        duration: durationHours,
                        date: date,
                        available: true,
                    });
                }

                currentTime = new Date(
                    currentTime.getTime() + slotDuration * 60000
                );
            }

            res.json({
                success: true,
                data: {
                    studio_id,
                    date,
                    available_slots: availableSlots,
                    total_slots: availableSlots.length,
                },
            });
        } catch (error) {
            console.error("Error getting available slots:", error);
            res.status(500).json({
                success: false,
                message: "Error retrieving available slots",
            });
        }
    }

    // Get weekly schedule for a studio
    static async getWeeklySchedule(req, res) {
        try {
            const { studio_id } = req.params;

            const [studios] = await pool.execute(
                "SELECT schedule FROM studios WHERE id = ?",
                [studio_id]
            );

            if (studios.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            const schedule = studios[0].schedule || {};

            res.json({
                success: true,
                data: {
                    studio_id,
                    weekly_schedule: schedule,
                },
            });
        } catch (error) {
            console.error("Error getting weekly schedule:", error);
            res.status(500).json({
                success: false,
                message: "Error retrieving weekly schedule",
            });
        }
    }

    // Get availability for multiple dates (for calendar view)
    static async getAvailabilityRange(req, res) {
        try {
            const { studio_id } = req.params;
            const { start_date, end_date, duration = 1 } = req.query;

            if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: "start_date and end_date parameters are required",
                });
            }

            const start = new Date(start_date);
            const end = new Date(end_date);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format. Use YYYY-MM-DD",
                });
            }

            // Get studio schedule
            const [studios] = await pool.execute(
                "SELECT schedule FROM studios WHERE id = ?",
                [studio_id]
            );

            if (studios.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            const schedule = studios[0].schedule || {};
            const availability = {};
            const currentDate = new Date(start);
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];

            while (currentDate <= end) {
                const dateString = currentDate.toISOString().split("T")[0];
                const dayName = dayNames[currentDate.getDay()];
                const daySchedule = schedule[dayName];

                if (daySchedule && daySchedule.is_open) {
                    // Get existing reservations for this date
                    const [reservations] = await pool.execute(
                        `SELECT start_datetime, end_datetime 
                         FROM reservations 
                         WHERE studio_id = ? 
                         AND DATE(start_datetime) = DATE(?) 
                         AND status IN ('confirmed', 'pending')`,
                        [studio_id, dateString]
                    );

                    // Calculate available slots
                    const slotDuration = parseInt(duration) * 60;
                    const openTime = new Date(
                        `${dateString}T${daySchedule.open_time}:00`
                    );
                    const closeTime = new Date(
                        `${dateString}T${daySchedule.close_time}:00`
                    );
                    let availableSlots = 0;

                    // If it's today, start from current time + 1 hour
                    let currentTime = new Date(openTime);
                    if (currentDate.getTime() === today.getTime()) {
                        // Calculate minimum advance time (1 hour from now)
                        const minimumAdvanceTime = new Date(
                            now.getTime() + 60 * 60 * 1000
                        );

                        // Round up to the next hour for slot generation
                        const nextSlotTime = new Date(minimumAdvanceTime);
                        nextSlotTime.setMinutes(0, 0, 0); // Round to the hour

                        // If the rounded time is before minimum advance time, move to next hour
                        if (nextSlotTime < minimumAdvanceTime) {
                            nextSlotTime.setHours(nextSlotTime.getHours() + 1);
                        }

                        if (
                            nextSlotTime >= openTime &&
                            nextSlotTime < closeTime
                        ) {
                            currentTime = nextSlotTime;
                        } else if (nextSlotTime >= closeTime) {
                            // No more slots available today
                            availability[dateString] = {
                                available: false,
                                total_slots: 0,
                            };
                            currentDate.setDate(currentDate.getDate() + 1);
                            continue;
                        }
                    }

                    while (currentTime < closeTime) {
                        const slotEnd = new Date(
                            currentTime.getTime() + slotDuration * 60000
                        );

                        // Skip if slot end time is past closing time
                        if (slotEnd > closeTime) {
                            break;
                        }

                        const isAvailable = !reservations.some(
                            (reservation) => {
                                const resStart = new Date(
                                    reservation.start_datetime
                                );
                                const resEnd = new Date(
                                    reservation.end_datetime
                                );
                                return (
                                    currentTime < resEnd && slotEnd > resStart
                                );
                            }
                        );

                        if (isAvailable) availableSlots++;
                        currentTime = new Date(
                            currentTime.getTime() + slotDuration * 60000
                        );
                    }

                    availability[dateString] = {
                        available: availableSlots > 0,
                        total_slots: availableSlots,
                    };
                } else {
                    availability[dateString] = {
                        available: false,
                        total_slots: 0,
                    };
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            res.json({
                success: true,
                data: {
                    studio_id,
                    start_date,
                    end_date,
                    availability,
                },
            });
        } catch (error) {
            console.error("Error getting availability range:", error);
            res.status(500).json({
                success: false,
                message: "Error retrieving availability range",
            });
        }
    }

    // Check if a specific time slot is available
    static async checkSlotAvailability(req, res) {
        try {
            const { studio_id } = req.params;
            const { date, start_time, end_time } = req.body;

            if (!date || !start_time || !end_time) {
                return res.status(400).json({
                    success: false,
                    message: "date, start_time, and end_time are required",
                });
            }

            // Get studio schedule
            const [studios] = await pool.execute(
                "SELECT schedule FROM studios WHERE id = ?",
                [studio_id]
            );

            if (studios.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            const schedule = studios[0].schedule || {};
            const targetDate = new Date(date);
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Validate date format
            if (isNaN(targetDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format. Use YYYY-MM-DD",
                });
            }

            // Check if date is not in the past
            if (targetDate < today) {
                return res.json({
                    success: true,
                    data: {
                        available: false,
                        reason: "Cannot book for past dates",
                    },
                });
            }

            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const dayName = dayNames[targetDate.getDay()];
            const daySchedule = schedule[dayName];

            if (!daySchedule || !daySchedule.is_open) {
                return res.json({
                    success: true,
                    data: {
                        available: false,
                        reason: "Studio is closed on this day",
                    },
                });
            }

            // Check if the requested time is within opening hours
            const requestedStart = new Date(`${date}T${start_time}:00`);
            const requestedEnd = new Date(`${date}T${end_time}:00`);
            const openTime = new Date(`${date}T${daySchedule.open_time}:00`);
            const closeTime = new Date(`${date}T${daySchedule.close_time}:00`);

            if (requestedStart < openTime || requestedEnd > closeTime) {
                return res.json({
                    success: true,
                    data: {
                        available: false,
                        reason: "Requested time is outside opening hours",
                    },
                });
            }

            // If it's today, check if the requested time is not in the past
            if (targetDate.getTime() === today.getTime()) {
                const currentTime = new Date();
                const minimumAdvanceTime = new Date(
                    currentTime.getTime() + 60 * 60 * 1000
                ); // 1 hour from now

                if (requestedStart < minimumAdvanceTime) {
                    return res.json({
                        success: true,
                        data: {
                            available: false,
                            reason: "Cannot book less than 1 hour in advance",
                        },
                    });
                }
            }

            // Check for conflicts with existing reservations
            const [conflicts] = await pool.execute(
                `SELECT COUNT(*) as count FROM reservations 
                 WHERE studio_id = ? 
                 AND DATE(start_datetime) = DATE(?) 
                 AND status IN ('confirmed', 'pending')
                 AND (
                     (start_datetime < ? AND end_datetime > ?) OR
                     (start_datetime < ? AND end_datetime > ?) OR
                     (start_datetime >= ? AND end_datetime <= ?)
                 )`,
                [
                    studio_id,
                    date,
                    requestedEnd,
                    requestedStart,
                    requestedStart,
                    requestedEnd,
                    requestedStart,
                    requestedEnd,
                ]
            );

            const hasConflict = conflicts[0].count > 0;

            res.json({
                success: true,
                data: {
                    available: !hasConflict,
                    reason: hasConflict
                        ? "Time slot is already booked"
                        : "Time slot is available",
                },
            });
        } catch (error) {
            console.error("Error checking slot availability:", error);
            res.status(500).json({
                success: false,
                message: "Error checking slot availability",
            });
        }
    }
}

export default AvailabilityController;
