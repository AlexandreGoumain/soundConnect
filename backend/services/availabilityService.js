import { pool } from "../config/database.js";

const DAY_NAMES = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const MIN_DURATION_HOURS = 1;
const MAX_DURATION_HOURS = 12;
const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;

class AvailabilityError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const startOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const parseDuration = (duration) => {
    const durationHours = parseInt(duration, 10);

    if (
        Number.isNaN(durationHours) ||
        durationHours < MIN_DURATION_HOURS ||
        durationHours > MAX_DURATION_HOURS
    ) {
        throw new AvailabilityError(
            400,
            "Duration must be between 1 and 12 hours"
        );
    }

    return durationHours;
};

const parseDateParam = (
    value,
    { fieldName = "date", requiredMessage = "Date parameter is required" } = {}
) => {
    if (!value) {
        throw new AvailabilityError(400, requiredMessage);
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new AvailabilityError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    return date;
};

const fetchStudioSchedule = async (studioId) => {
    const [studios] = await pool.execute(
        "SELECT schedule FROM studios WHERE id = ?",
        [studioId]
    );

    if (studios.length === 0) {
        throw new AvailabilityError(404, "Studio not found");
    }

    return studios[0].schedule || {};
};

const fetchReservationsForDate = async (studioId, date) => {
    const [reservations] = await pool.execute(
        `SELECT start_datetime, end_datetime
         FROM reservations
         WHERE studio_id = ?
         AND DATE(start_datetime) = DATE(?)
         AND status IN ('confirmed', 'pending')`,
        [studioId, date]
    );

    return reservations;
};

const roundUpToNextHour = (date) => {
    const rounded = new Date(date);
    rounded.setMinutes(0, 0, 0);

    if (rounded < date) {
        rounded.setHours(rounded.getHours() + 1);
    }

    return rounded;
};

const computeAvailableSlots = ({
    date,
    daySchedule,
    reservations,
    durationHours,
    now,
    today,
}) => {
    const slots = [];
    const slotDurationMinutes = durationHours * 60;
    const openTime = new Date(`${date}T${daySchedule.open_time}:00`);
    const closeTime = new Date(`${date}T${daySchedule.close_time}:00`);

    let currentTime = new Date(openTime);

    if (today && new Date(date).getTime() === today.getTime()) {
        const minimumAdvanceTime = new Date(now.getTime() + HOUR_IN_MS);
        const nextSlotTime = roundUpToNextHour(minimumAdvanceTime);

        if (nextSlotTime >= openTime && nextSlotTime < closeTime) {
            currentTime = nextSlotTime;
        } else if (nextSlotTime >= closeTime) {
            return [];
        }
    }

    while (currentTime < closeTime) {
        const slotEnd = new Date(
            currentTime.getTime() + slotDurationMinutes * MINUTE_IN_MS
        );

        if (slotEnd > closeTime) {
            break;
        }

        const isAvailable = !reservations.some((reservation) => {
            const resStart = new Date(reservation.start_datetime);
            const resEnd = new Date(reservation.end_datetime);

            return currentTime < resEnd && slotEnd > resStart;
        });

        if (isAvailable) {
            slots.push({
                start_time: currentTime.toTimeString().slice(0, 5),
                end_time: slotEnd.toTimeString().slice(0, 5),
                duration: durationHours,
                date,
                available: true,
            });
        }

        currentTime = new Date(
            currentTime.getTime() + slotDurationMinutes * MINUTE_IN_MS
        );
    }

    return slots;
};

export async function getAvailableSlotsForStudio({
    studioId,
    date,
    duration = MIN_DURATION_HOURS,
    now = new Date(),
}) {
    const durationHours = parseDuration(duration);
    const targetDate = parseDateParam(date, {
        requiredMessage: "Date parameter is required",
    });

    const today = startOfToday();
    if (targetDate < today) {
        throw new AvailabilityError(400, "Cannot book for past dates");
    }

    const schedule = await fetchStudioSchedule(studioId);
    const daySchedule = schedule[DAY_NAMES[targetDate.getDay()]];

    if (!daySchedule || !daySchedule.is_open) {
        return {
            studio_id: studioId,
            date,
            available_slots: [],
            total_slots: 0,
        };
    }

    const reservations = await fetchReservationsForDate(studioId, date);

    const slots = computeAvailableSlots({
        date,
        daySchedule,
        reservations,
        durationHours,
        now,
        today,
    });

    return {
        studio_id: studioId,
        date,
        available_slots: slots,
        total_slots: slots.length,
    };
}

export async function getWeeklyScheduleForStudio(studioId) {
    const schedule = await fetchStudioSchedule(studioId);

    return {
        studio_id: studioId,
        weekly_schedule: schedule,
    };
}

export async function getAvailabilityRangeForStudio({
    studioId,
    startDate,
    endDate,
    duration = MIN_DURATION_HOURS,
    now = new Date(),
}) {
    const start = parseDateParam(startDate, {
        fieldName: "start_date",
        requiredMessage: "start_date and end_date parameters are required",
    });
    const end = parseDateParam(endDate, {
        fieldName: "end_date",
        requiredMessage: "start_date and end_date parameters are required",
    });

    const durationHours = parseDuration(duration);
    const schedule = await fetchStudioSchedule(studioId);
    const availability = {};
    const currentDate = new Date(start);
    const today = startOfToday();

    while (currentDate <= end) {
        const dateString = currentDate.toISOString().split("T")[0];
        const daySchedule = schedule[DAY_NAMES[currentDate.getDay()]];

        if (!daySchedule || !daySchedule.is_open) {
            availability[dateString] = {
                available: false,
                total_slots: 0,
            };
        } else if (currentDate < today) {
            availability[dateString] = {
                available: false,
                total_slots: 0,
            };
        } else {
            const reservations = await fetchReservationsForDate(
                studioId,
                dateString
            );
            const slots = computeAvailableSlots({
                date: dateString,
                daySchedule,
                reservations,
                durationHours,
                now,
                today,
            });

            availability[dateString] = {
                available: slots.length > 0,
                total_slots: slots.length,
            };
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        studio_id: studioId,
        start_date: startDate,
        end_date: endDate,
        availability,
    };
}

export async function checkSlotAvailabilityForStudio({
    studioId,
    date,
    startTime,
    endTime,
    now = new Date(),
}) {
    const targetDate = parseDateParam(date, {
        requiredMessage: "date, start_time, and end_time are required",
    });

    if (!startTime || !endTime) {
        throw new AvailabilityError(
            400,
            "date, start_time, and end_time are required"
        );
    }

    const schedule = await fetchStudioSchedule(studioId);
    const today = startOfToday();
    const daySchedule = schedule[DAY_NAMES[targetDate.getDay()]];

    if (!daySchedule || !daySchedule.is_open) {
        return {
            available: false,
            reason: "Studio is closed on this day",
        };
    }

    const requestedStart = new Date(`${date}T${startTime}:00`);
    const requestedEnd = new Date(`${date}T${endTime}:00`);
    const openTime = new Date(`${date}T${daySchedule.open_time}:00`);
    const closeTime = new Date(`${date}T${daySchedule.close_time}:00`);

    if (requestedStart < openTime || requestedEnd > closeTime) {
        return {
            available: false,
            reason: "Requested time is outside opening hours",
        };
    }

    if (targetDate.getTime() === today.getTime()) {
        const minimumAdvanceTime = new Date(now.getTime() + HOUR_IN_MS);

        if (requestedStart < minimumAdvanceTime) {
            return {
                available: false,
                reason: "Cannot book less than 1 hour in advance",
            };
        }
    }

    const [conflicts] = await pool.execute(
        `SELECT COUNT(*) as count FROM reservations
         WHERE studio_id = ?
         AND DATE(start_datetime) = DATE(?)
         AND status IN ('confirmed', 'pending')
         AND (
             (start_datetime < ? AND end_datetime > ?)
             OR
             (start_datetime < ? AND end_datetime > ?)
             OR
             (start_datetime >= ? AND end_datetime <= ?)
         )`,
        [
            studioId,
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

    return {
        available: !hasConflict,
        reason: hasConflict
            ? "Time slot is already booked"
            : "Time slot is available",
    };
}

export { AvailabilityError };
