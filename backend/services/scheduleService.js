import Studio from "../models/Studio.js";

class ScheduleError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const DEFAULT_SCHEDULE = {
    monday: { is_open: true, open_time: "09:00", close_time: "18:00" },
    tuesday: { is_open: true, open_time: "09:00", close_time: "18:00" },
    wednesday: { is_open: true, open_time: "09:00", close_time: "18:00" },
    thursday: { is_open: true, open_time: "09:00", close_time: "18:00" },
    friday: { is_open: true, open_time: "09:00", close_time: "18:00" },
    saturday: { is_open: true, open_time: "10:00", close_time: "16:00" },
    sunday: { is_open: false, open_time: null, close_time: null },
};

export async function getScheduleForStudio(studioId) {
    const schedule = await Studio.getSchedule(studioId);

    if (schedule === null) {
        throw new ScheduleError(404, "Studio not found");
    }

    return schedule;
}

export async function updateScheduleForOwner(studioId, user, schedulePayload) {
    const studio = await Studio.findById(studioId);

    if (!studio) {
        throw new ScheduleError(404, "Studio not found");
    }

    if (studio.owner_id !== user.id) {
        throw new ScheduleError(
            403,
            "Access denied. Only studio owners can update schedule."
        );
    }

    if (!schedulePayload || typeof schedulePayload !== "object") {
        throw new ScheduleError(400, "Invalid schedule data");
    }

    const updatedStudio = await Studio.updateSchedule(
        studioId,
        schedulePayload
    );

    return updatedStudio.schedule;
}

export function getDefaultScheduleTemplate() {
    return DEFAULT_SCHEDULE;
}

export { ScheduleError };
