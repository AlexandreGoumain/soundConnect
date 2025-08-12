import Reservation from "../models/Reservation.js";
import Studio from "../models/Studio.js";

export const createReservation = async (req, res) => {
    try {
        // Only artists and admins can create reservations
        if (req.user.role_name !== "artist" && req.user.role_name !== "admin") {
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

        // Check if studio exists
        const studio = await Studio.findById(studio_id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
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

        if (req.user.role_name === "admin") {
            // Admin can see all reservations
            reservations = await Reservation.findAll();
        } else if (req.user.role_name === "studio") {
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
        const isAdmin = req.user.role_name === "admin";

        if (!isOwner && !isStudioOwner && !isAdmin) {
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
        const isAdmin = req.user.role_name === "admin";

        if (!isOwner && !isStudioOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Validate status transitions
        if (status) {
            const allowedTransitions = {
                pending: {
                    admin: ["confirmed", "cancelled"],
                    studio: ["confirmed", "cancelled"],
                    artist: ["cancelled"],
                },
                confirmed: {
                    admin: ["completed", "cancelled"],
                    studio: ["completed", "cancelled"],
                    artist: [], // Users cannot change confirmed reservations
                },
                cancelled: {
                    admin: ["pending"], // Only admin can reactivate
                    studio: [],
                    artist: [],
                },
                completed: {
                    admin: [], // Completed reservations cannot be changed
                    studio: [],
                    artist: [],
                },
            };

            let userType;
            if (isAdmin) userType = "admin";
            else if (isStudioOwner) userType = "studio";
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
        const isAdmin = req.user.role_name === "admin";

        if (!isOwner && !isStudioOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Users can only delete pending reservations
        if (!isAdmin && !isStudioOwner && reservation.status !== "pending") {
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

        // Check permissions: admin can see any user's reservations, users can only see their own
        if (req.user.role_name !== "admin" && req.user.id !== user_id) {
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
        const isAdmin = isAuthenticated && req.user.role_name === "admin";

        const reservations = await Reservation.findByStudio(studio_id);

        // If not owner/admin, return only time slots (no personal details)
        if (!isStudioOwner && !isAdmin) {
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

        // Owner/admin: full details
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

// export const getStudioStats = async (req, res) => {
//     try {
//         const { studio_id } = req.params;

//         // Check if studio exists and get studio owner
//         const studio = await Studio.findById(studio_id);
//         if (!studio) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Studio not found",
//             });
//         }

//         // Check permissions: admin or studio owner can see studio stats
//         const isStudioOwner = req.user.id === studio.owner_id;
//         const isAdmin = req.user.role_name === "admin";

//         if (!isStudioOwner && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message:
//                     "Unauthorized: You can only view stats for your own studios",
//             });
//         }

//         const stats = await Reservation.getReservationStats(studio_id);

//         res.json({
//             success: true,
//             data: { stats },
//         });
//     } catch (error) {
//         console.error("Error retrieving studio stats:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error retrieving studio stats",
//         });
//     }
// };
