import Reservation from "../models/Reservation.js";
import Studio from "../models/Studio.js";

export const createReservation = async (req, res) => {
    try {
        // Only artists can create reservations
        if (req.user.role_name !== "artist") {
            return res.status(403).json({
                success: false,
                message: "Only artists can create reservations",
            });
        }

        const { studio_id, start_datetime, end_datetime, special_requests } =
            req.body;
        const user_id = req.user.id;

        // Validate dates
        const startTime = new Date(start_datetime);
        const endTime = new Date(end_datetime);
        const now = new Date();

        if (startTime <= now) {
            return res.status(400).json({
                success: false,
                message: "Start date must be in the future",
            });
        }

        if (endTime <= startTime) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date",
            });
        }

        // Same-day minimum advance booking: at least 1 hour ahead
        const sameDay =
            startTime.getFullYear() === now.getFullYear() &&
            startTime.getMonth() === now.getMonth() &&
            startTime.getDate() === now.getDate();
        if (sameDay) {
            const minAdvance = new Date(now.getTime() + 60 * 60 * 1000);
            if (startTime < minAdvance) {
                return res.status(400).json({
                    success: false,
                    message: "Start time must be at least 1 hour in advance",
                });
            }
        }

        // Check if studio exists
        const studio = await Studio.findById(studio_id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        // Validate schedule: studio must be open and booking within opening hours
        try {
            const scheduleRaw = studio.schedule;
            const schedule =
                typeof scheduleRaw === "string"
                    ? JSON.parse(scheduleRaw)
                    : scheduleRaw || {};

            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const dayName = dayNames[startTime.getDay()];
            const daySchedule = schedule?.[dayName];

            if (!daySchedule || !daySchedule.is_open) {
                return res.status(400).json({
                    success: false,
                    message: "Studio is closed on the selected date",
                });
            }

            const dateStr = start_datetime.split("T")[0];
            const openTime = new Date(`${dateStr}T${daySchedule.open_time}:00`);
            const closeTime = new Date(
                `${dateStr}T${daySchedule.close_time}:00`
            );

            if (startTime < openTime || endTime > closeTime) {
                return res.status(400).json({
                    success: false,
                    message: `Reservation must be within opening hours (${daySchedule.open_time}-${daySchedule.close_time})`,
                });
            }
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Invalid studio schedule configuration",
            });
        }

        const reservationData = {
            user_id,
            studio_id,
            start_datetime,
            end_datetime,
            special_requests,
        };

        const reservation = await Reservation.create(reservationData);

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: { reservation },
        });
    } catch (error) {
        console.error("Error creating reservation:", error);

        if (error.message.includes("conflicts with")) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "Studio not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating reservation",
        });
    }
};

export const getAllReservations = async (req, res) => {
    try {
        let reservations;
        if (req.user.role_name === "studio") {
            // Studio owner can see reservations for their studios
            reservations = await Reservation.findByStudioOwner(req.user.id);
        } else {
            // Artists can only see their own reservations
            reservations = await Reservation.findByUser(req.user.id);
        }

        res.json({
            success: true,
            data: { reservations },
        });
    } catch (error) {
        console.error("Error retrieving reservations:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving reservations",
        });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        // Check permissions
        const isOwner = req.user.id === reservation.user_id;
        const isStudioOwner = req.user.id === reservation.studio_owner_id;

        if (!isOwner && !isStudioOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this reservation",
            });
        }

        res.json({
            success: true,
            data: { reservation },
        });
    } catch (error) {
        console.error("Error retrieving reservation:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving reservation",
        });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, special_requests } = req.body;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        // Check permissions and allowed status changes
        const isOwner = req.user.id === reservation.user_id;
        const isStudioOwner = req.user.id === reservation.studio_owner_id;

        if (!isOwner && !isStudioOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Validate status transitions
        if (status) {
            const allowedTransitions = {
                pending: {
                    studio: ["confirmed", "cancelled"],
                    artist: ["cancelled"],
                },
                confirmed: {
                    studio: ["completed", "cancelled"],
                    artist: [],
                },
                cancelled: {
                    studio: [],
                    artist: [],
                },
                completed: {
                    studio: [],
                    artist: [],
                },
            };

            let userType;
            if (isStudioOwner) userType = "studio";
            else userType = "artist";

            const allowedStatuses =
                allowedTransitions[reservation.status]?.[userType] || [];

            if (status && !allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot change status from ${reservation.status} to ${status}`,
                });
            }
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (special_requests !== undefined)
            updateData.special_requests = special_requests;

        const updatedReservation = await Reservation.update(id, updateData);

        res.json({
            success: true,
            message: "Reservation updated successfully",
            data: { reservation: updatedReservation },
        });
    } catch (error) {
        console.error("Error updating reservation:", error);

        if (error.message === "No valid data to update") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating reservation",
        });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        // Check permissions
        const isOwner = req.user.id === reservation.user_id;
        const isStudioOwner = req.user.id === reservation.studio_owner_id;

        if (!isOwner && !isStudioOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Users can only delete pending reservations
        if (!isStudioOwner && reservation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const deleted = await Reservation.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        res.json({
            success: true,
            message: "Reservation deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting reservation",
        });
    }
};

export const getReservationsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Check permissions: users can only see their own reservations
        if (req.user.id !== user_id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const reservations = await Reservation.findByUser(user_id);

        res.json({
            success: true,
            data: { reservations },
        });
    } catch (error) {
        console.error("Error retrieving user reservations:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving user reservations",
        });
    }
};

export const getReservationsByStudio = async (req, res) => {
    try {
        const { studio_id } = req.params;

        // Check if studio exists and get studio owner
        const studio = await Studio.findById(studio_id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        // Auth may be optional on this route
        const isAuthenticated = !!req.user;
        const isStudioOwner =
            isAuthenticated && req.user.id === studio.owner_id;

        const reservations = await Reservation.findByStudio(studio_id);

        // If not owner, return only time slots (no personal details)
        if (!isStudioOwner) {
            const slots = reservations.map((r) => ({
                id: r.id,
                start_datetime: r.start_datetime,
                end_datetime: r.end_datetime,
                status: r.status,
            }));

            return res.json({
                success: true,
                data: { reservations: slots },
            });
        }

        // Owner: full details
        return res.json({
            success: true,
            data: { reservations },
        });
    } catch (error) {
        console.error("Error retrieving studio reservations:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving studio reservations",
        });
    }
};
