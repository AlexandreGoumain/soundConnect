import Studio from "../models/Studio.js";

class StudioError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const parseDate = (value, fieldName) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new StudioError(400, `Invalid date format for ${fieldName}. Use YYYY-MM-DD`);
    }
    return parsed;
};

export async function createStudioForOwner(user, payload) {
    if (user.role_name !== "studio") {
        throw new StudioError(403, "Only studio accounts can create studios");
    }

    const studioData = {
        ...payload,
        owner_id: user.id,
    };

    return Studio.create(studioData);
}

export async function listStudios(filters = {}) {
    const {
        city,
        postal_code,
        min_rate,
        max_rate,
        tags,
        equipment,
        sort,
        available_on,
        duration,
    } = filters;

    if (available_on) {
        const target = parseDate(available_on, "available_on");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);

        if (target < today) {
            throw new StudioError(400, "Cannot search availability for past dates");
        }
    }

    const hasFilters =
        city ||
        postal_code ||
        min_rate ||
        max_rate ||
        tags ||
        equipment ||
        sort ||
        available_on ||
        duration;

    if (hasFilters) {
        return Studio.findFiltered({
            city,
            postal_code,
            min_rate,
            max_rate,
            tags,
            equipment,
            sort,
            available_on,
            duration,
        });
    }

    return Studio.findAll();
}

export async function getStudio(studioId) {
    const studio = await Studio.findById(studioId);

    if (!studio) {
        throw new StudioError(404, "Studio not found");
    }

    return studio;
}

export async function listStudiosByOwner(ownerId) {
    return Studio.findByOwner(ownerId);
}

export async function updateStudioForOwner(user, studioId, payload) {
    const studio = await getStudio(studioId);

    if (studio.owner_id !== user.id) {
        throw new StudioError(
            403,
            "Unauthorized: You can only update your own studios"
        );
    }

    const updatedStudio = await Studio.update(studioId, payload);

    if (!updatedStudio) {
        throw new StudioError(404, "Studio not found");
    }

    return updatedStudio;
}

export async function deleteStudioForOwner(user, studioId) {
    const studio = await getStudio(studioId);

    if (studio.owner_id !== user.id) {
        throw new StudioError(
            403,
            "Unauthorized: You can only delete your own studios"
        );
    }

    const deleted = await Studio.delete(studioId);

    if (!deleted) {
        throw new StudioError(404, "Studio not found");
    }

    return true;
}

export { StudioError };
