const DAY_CONFIG = {
    monday: {
        label: "Lundi",
        defaults: { is_open: true, open_time: "09:00", close_time: "18:00" },
    },
    tuesday: {
        label: "Mardi",
        defaults: { is_open: true, open_time: "09:00", close_time: "18:00" },
    },
    wednesday: {
        label: "Mercredi",
        defaults: { is_open: true, open_time: "09:00", close_time: "18:00" },
    },
    thursday: {
        label: "Jeudi",
        defaults: { is_open: true, open_time: "09:00", close_time: "18:00" },
    },
    friday: {
        label: "Vendredi",
        defaults: { is_open: true, open_time: "09:00", close_time: "18:00" },
    },
    saturday: {
        label: "Samedi",
        defaults: { is_open: false, open_time: "10:00", close_time: "16:00" },
    },
    sunday: {
        label: "Dimanche",
        defaults: { is_open: false, open_time: "10:00", close_time: "16:00" },
    },
};

export const WEEK_DAYS = Object.entries(DAY_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
}));

export const DAY_KEYS = WEEK_DAYS.map((day) => day.key);

const DAY_LABEL_MAP = WEEK_DAYS.reduce((acc, day) => {
    acc[day.key] = day.label;
    return acc;
}, {});

export function getDefaultDaySchedule(day) {
    const config = DAY_CONFIG[day];
    if (!config) {
        return { is_open: false, open_time: "09:00", close_time: "18:00" };
    }
    return { ...config.defaults };
}

export function createDefaultSchedule() {
    const schedule = {};
    for (const day of DAY_KEYS) {
        schedule[day] = getDefaultDaySchedule(day);
    }
    return schedule;
}

export function normalizeSchedule(rawSchedule) {
    const parsed =
        typeof rawSchedule === "string"
            ? safeJsonParse(rawSchedule)
            : rawSchedule || {};

    // SIMPLIFIED: Start with empty object instead of defaults
    const result = {};

    for (const day of DAY_KEYS) {
        const incoming = parsed?.[day];

        if (incoming && typeof incoming === "object") {
            result[day] = {
                is_open: Boolean(incoming.is_open),
                open_time:
                    incoming.open_time || getDefaultDaySchedule(day).open_time,
                close_time:
                    incoming.close_time ||
                    getDefaultDaySchedule(day).close_time,
            };
        } else {
            // Fallback to default for missing days
            const defaults = getDefaultDaySchedule(day);
            result[day] = defaults;
        }
    }

    return result;
}

export function buildSchedulePayload(schedule) {
    const payload = {};

    for (const day of DAY_KEYS) {
        const entry = schedule?.[day];

        if (entry?.is_open) {
            payload[day] = {
                is_open: true,
                open_time: entry.open_time,
                close_time: entry.close_time,
            };
        } else {
            payload[day] = { is_open: false };
        }
    }

    return payload;
}

export function validateSchedule(schedule) {
    for (const day of DAY_KEYS) {
        const entry = schedule?.[day];
        if (!entry) continue;

        if (entry.is_open) {
            if (!entry.open_time || !entry.close_time) {
                return {
                    day,
                    message: `Veuillez renseigner les horaires complets pour ${DAY_LABEL_MAP[day]}.`,
                };
            }

            const openMinutes = toMinutes(entry.open_time);
            const closeMinutes = toMinutes(entry.close_time);

            if (openMinutes === null || closeMinutes === null) {
                return {
                    day,
                    message: `Les horaires de ${DAY_LABEL_MAP[day]} ne sont pas valides.`,
                };
            }

            if (closeMinutes <= openMinutes) {
                return {
                    day,
                    message: `L'heure de fermeture doit être postérieure à l'heure d'ouverture pour ${DAY_LABEL_MAP[day]}.`,
                };
            }
        }
    }

    return null;
}

function safeJsonParse(value) {
    try {
        return JSON.parse(value) || {};
    } catch {
        return {};
    }
}

function toMinutes(time) {
    if (!time || typeof time !== "string") return null;
    const [hours, minutes] = time.split(":").map((part) => Number(part));

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return hours * 60 + minutes;
}
