import {
    AvailabilityError,
    checkSlotAvailabilityForStudio,
    getAvailabilityRangeForStudio,
    getAvailableSlotsForStudio,
    getWeeklyScheduleForStudio,
} from "../services/availabilityService.js";

class AvailabilityController {
    static async getAvailableSlots(req, res) {
        try {
            const { studio_id } = req.params;
            const { date, duration = 1 } = req.query;

            const data = await getAvailableSlotsForStudio({
                studioId: studio_id,
                date,
                duration,
            });

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            AvailabilityController.handleServiceError(
                res,
                error,
                "Error retrieving available slots"
            );
        }
    }

    static async getWeeklySchedule(req, res) {
        try {
            const { studio_id } = req.params;
            const data = await getWeeklyScheduleForStudio(studio_id);

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            AvailabilityController.handleServiceError(
                res,
                error,
                "Error retrieving weekly schedule"
            );
        }
    }

    static async getAvailabilityRange(req, res) {
        try {
            const { studio_id } = req.params;
            const { start_date, end_date, duration = 1 } = req.query;

            const data = await getAvailabilityRangeForStudio({
                studioId: studio_id,
                startDate: start_date,
                endDate: end_date,
                duration,
            });

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            AvailabilityController.handleServiceError(
                res,
                error,
                "Error retrieving availability range"
            );
        }
    }

    static async checkSlotAvailability(req, res) {
        try {
            const { studio_id } = req.params;
            const { date, start_time, end_time } = req.body;

            const data = await checkSlotAvailabilityForStudio({
                studioId: studio_id,
                date,
                startTime: start_time,
                endTime: end_time,
            });

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            AvailabilityController.handleServiceError(
                res,
                error,
                "Error checking slot availability"
            );
        }
    }

    static handleServiceError(res, error, fallbackMessage) {
        if (error instanceof AvailabilityError || typeof error?.statusCode === "number") {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error(fallbackMessage, error);
        return res.status(500).json({
            success: false,
            message: fallbackMessage,
        });
    }
}

export default AvailabilityController;
