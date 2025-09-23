import {
    ScheduleError,
    getDefaultScheduleTemplate,
    getScheduleForStudio,
    updateScheduleForOwner,
} from "../services/scheduleService.js";

class ScheduleController {
    static async getSchedule(req, res) {
        try {
            const { studio_id } = req.params;
            const schedule = await getScheduleForStudio(studio_id);

            res.json({
                success: true,
                data: {
                    studio_id,
                    schedule,
                },
            });
        } catch (error) {
            ScheduleController.handleError(
                res,
                error,
                "Error retrieving schedule"
            );
        }
    }

    static async updateSchedule(req, res) {
        try {
            const { studio_id } = req.params;
            const { schedule } = req.body || {};
            const updatedSchedule = await updateScheduleForOwner(
                studio_id,
                req.user,
                schedule
            );

            res.json({
                success: true,
                message: "Schedule updated successfully",
                data: {
                    studio_id,
                    schedule: updatedSchedule,
                },
            });
        } catch (error) {
            ScheduleController.handleError(
                res,
                error,
                "Error updating schedule"
            );
        }
    }

    static async getDefaultSchedule(req, res) {
        const defaultSchedule = getDefaultScheduleTemplate();

        res.json({
            success: true,
            data: {
                default_schedule: defaultSchedule,
            },
        });
    }

    static handleError(res, error, fallbackMessage) {
        if (
            error instanceof ScheduleError ||
            typeof error?.statusCode === "number"
        ) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        error(fallbackMessage, error);
        return res.status(500).json({
            success: false,
            message: fallbackMessage,
        });
    }
}

export default ScheduleController;
