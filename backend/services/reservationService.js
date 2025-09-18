import Reservation from "../models/Reservation.js";
import Studio from "../models/Studio.js";

class ReservationError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const DAY_NAMES = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const HOUR_IN_MS = 60 * 60 * 1000;

const parseDateTime = (value, fieldName) => {
    if (!value) {
        throw new ReservationError(400, `${fieldName} is required`);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new ReservationError(400, `${fieldName} must be a valid ISO date string`);
    }

    return parsed;
};

export async function createReservationForUser(user, payload) {
    if (user.role_name !== "artist") {
        throw new ReservationError(403, "Only artists can create reservations");
    }

    const { studio_id, start_datetime, end_datetime, special_requests } = payload;

    const startTime = parseDateTime(start_datetime, "start_datetime");
    const endTime = parseDateTime(end_datetime, "end_datetime");
    const now = new Date();

    if (startTime <= now) {
        throw new ReservationError(400, "Start date must be in the future");
    }

    if (endTime <= startTime) {
        throw new ReservationError(400, "End date must be after start date");
    }

    const sameDay =
        startTime.getFullYear() === now.getFullYear() &&
        startTime.getMonth() === now.getMonth() &&
        startTime.getDate() === now.getDate();

    if (sameDay) {
        const minAdvance = new Date(now.getTime() + HOUR_IN_MS);
        if (startTime < minAdvance) {
            throw new ReservationError(400, "Start time must be at least 1 hour in advance");
        }
    }

    const studio = await Studio.findById(studio_id);
    if (!studio) {
        throw new ReservationError(404, "Studio not found");
    }

    validateScheduleForReservation(studio.schedule, start_datetime, end_datetime);

    const reservationData = {
        user_id: user.id,
        studio_id,
        start_datetime,
        end_datetime,
        special_requests,
    };

    return Reservation.create(reservationData);
}

export async function getReservationsForActor(user) {
    if (user.role_name === "studio") {
        return Reservation.findByStudioOwner(user.id);
    }

    return Reservation.findByUser(user.id);
}

export async function getReservationWithPermissions(user, id) {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
        throw new ReservationError(404, "Reservation not found");
    }

    const isOwner = user.id === reservation.user_id;
    const isStudioOwner = user.id === reservation.studio_owner_id;

    if (!isOwner && !isStudioOwner) {
        throw new ReservationError(
            403,
            "Unauthorized access to this reservation"
        );
    }

    return reservation;
}

export async function updateReservationForActor(user, id, payload) {
    const reservation = await getReservationWithPermissions(user, id);

    const { status, special_requests } = payload;

    if (!status && !special_requests) {
        throw new ReservationError(
            400,
            "No valid reservation data provided"
        );
    }

    if (status) {
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new ReservationError(400, "Invalid reservation status");
        }

        if (user.id !== reservation.studio_owner_id) {
            throw new ReservationError(
                403,
                "Only studio owners can update reservation status"
            );
        }

        if (reservation.status === "cancelled" || reservation.status === "completed") {
            throw new ReservationError(400, "Cannot change status of completed or cancelled reservations");
        }

        if (reservation.status === "confirmed" && status === "pending") {
            throw new ReservationError(400, "Cannot revert status to pending once confirmed");
        }
    }

    if (special_requests && user.id !== reservation.user_id) {
        throw new ReservationError(
            403,
            "Only reservation owners can update special requests"
        );
    }

    const updated = await Reservation.update(id, {
        status,
        special_requests,
    });

    if (!updated) {
        throw new ReservationError(404, "Reservation not found");
    }

    return updated;
}

export async function deleteReservationForActor(user, id) {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
        throw new ReservationError(404, "Reservation not found");
    }

    const isOwner = user.id === reservation.user_id;
    const isStudioOwner = user.id === reservation.studio_owner_id;

    if (!isOwner && !isStudioOwner) {
        throw new ReservationError(403, "Unauthorized");
    }

    if (!isStudioOwner && reservation.status !== "pending") {
        throw new ReservationError(400, "Unauthorized");
    }

    const deleted = await Reservation.delete(id);

    if (!deleted) {
        throw new ReservationError(404, "Reservation not found");
    }

    return true;
}

export async function getReservationsForUser(userId, requester) {
    if (requester.id !== userId) {
        throw new ReservationError(403, "Unauthorized");
    }

    return Reservation.findByUser(userId);
}

export async function getReservationsForStudio(studioId, requester) {
    const studio = await Studio.findById(studioId);
    if (!studio) {
        throw new ReservationError(404, "Studio not found");
    }

    const reservations = await Reservation.findByStudio(studioId);

    const isAuthenticated = !!requester;
    const isOwner = isAuthenticated && requester.id === studio.owner_id;

    if (!isOwner) {
        return reservations.map((reservation) => ({
            id: reservation.id,
            start_datetime: reservation.start_datetime,
            end_datetime: reservation.end_datetime,
            status: reservation.status,
        }));
    }

    return reservations;
}

function validateScheduleForReservation(scheduleRaw, startDatetime, endDatetime) {
    try {
        const schedule =
            typeof scheduleRaw === "string"
                ? JSON.parse(scheduleRaw)
                : scheduleRaw || {};

        const start = new Date(startDatetime);
        const end = new Date(endDatetime);

        const daySchedule = schedule?.[DAY_NAMES[start.getDay()]];

        if (!daySchedule || !daySchedule.is_open) {
            throw new ReservationError(400, "Studio is closed on the selected date");
        }

        const dateStr = startDatetime.split("T")[0];
        const openTime = new Date(`${dateStr}T${daySchedule.open_time}:00`);
        const closeTime = new Date(`${dateStr}T${daySchedule.close_time}:00`);

        if (start < openTime || end > closeTime) {
            throw new ReservationError(
                400,
                `Reservation must be within opening hours (${daySchedule.open_time}-${daySchedule.close_time})`
            );
        }
    } catch (error) {
        if (error instanceof ReservationError) {
            throw error;
        }

        throw new ReservationError(400, "Invalid studio schedule configuration");
    }
}

export { ReservationError };
