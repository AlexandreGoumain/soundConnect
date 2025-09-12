import Studio from "../models/Studio.js";

class ScheduleController {
    // Get studio schedule (public)
    static async getSchedule(req, res) {
        try {
            const { studio_id } = req.params;

            const schedule = await Studio.getSchedule(studio_id);

            if (schedule === null) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            res.json({
                success: true,
                data: {
                    studio_id,
                    schedule,
                },
            });
        } catch (error) {
            console.error("Error getting schedule:", error);
            res.status(500).json({
                success: false,
                message: "Error retrieving schedule",
            });
        }
    }

    // Update studio schedule (studio owner only)
    static async updateSchedule(req, res) {
        try {
            const { studio_id } = req.params;
            const { schedule } = req.body;
            const user = req.user;

            // Check if studio exists and user is the owner
            const studio = await Studio.findById(studio_id);
            if (!studio) {
                return res.status(404).json({
                    success: false,
                    message: "Studio not found",
                });
            }

            // Check if user is the studio owner
            if (studio.owner_id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access denied. Only studio owners can update schedule.",
                });
            }

            // Validate schedule data
            if (!schedule || typeof schedule !== "object") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid schedule data",
                });
            }

            // Update schedule
            const updatedStudio = await Studio.updateSchedule(
                studio_id,
                schedule
            );

            res.json({
                success: true,
                message: "Schedule updated successfully",
                data: {
                    studio_id,
                    schedule: updatedStudio.schedule,
                },
            });
        } catch (error) {
            console.error("Error updating schedule:", error);

            if (
                error.message.includes("Invalid") ||
                error.message.includes("Missing")
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            res.status(500).json({
                success: false,
                message: "Error updating schedule",
            });
        }
    }

    // Get default schedule template
    static async getDefaultSchedule(req, res) {
        const defaultSchedule = {
            monday: { is_open: true, open_time: "09:00", close_time: "18:00" },
            tuesday: { is_open: true, open_time: "09:00", close_time: "18:00" },
            wednesday: {
                is_open: true,
                open_time: "09:00",
                close_time: "18:00",
            },
            thursday: {
                is_open: true,
                open_time: "09:00",
                close_time: "18:00",
            },
            friday: { is_open: true, open_time: "09:00", close_time: "18:00" },
            saturday: {
                is_open: true,
                open_time: "10:00",
                close_time: "16:00",
            },
            sunday: { is_open: false, open_time: null, close_time: null },
        };

        res.json({
            success: true,
            data: {
                default_schedule: defaultSchedule,
            },
        });
    }
}

export default ScheduleController;
