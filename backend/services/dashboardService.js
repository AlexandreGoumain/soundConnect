import { pool } from "../config/database.js";
import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";
import Studio from "../models/Studio.js";

class DashboardError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export async function fetchDashboardOverview(ownerId) {
    const [counts] = await pool.execute(
        `SELECT
            (SELECT COUNT(*) FROM studios WHERE owner_id = ?) AS total_studios,
            (SELECT COUNT(*) FROM reservations r JOIN studios s ON r.studio_id = s.id WHERE s.owner_id = ?) AS total_reservations,
            (SELECT COALESCE(SUM(r.total_price), 0) FROM reservations r JOIN studios s ON r.studio_id = s.id WHERE s.owner_id = ? AND r.status = 'completed') AS total_revenue`,
        [ownerId, ownerId, ownerId]
    );

    const [reservationsByStatus] = await pool.execute(
        `SELECT r.status, COUNT(*) as count
         FROM reservations r
         JOIN studios s ON r.studio_id = s.id
         WHERE s.owner_id = ?
         GROUP BY r.status`,
        [ownerId]
    );

    const [ratingRows] = await pool.execute(
        `SELECT COALESCE(AVG(r.rating), 0) as average_rating, COUNT(*) as total_reviews
         FROM reviews r
         JOIN studios s ON r.studio_id = s.id
         WHERE s.owner_id = ?`,
        [ownerId]
    );

    const [upcomingReservations] = await pool.execute(
        `SELECT r.id, r.start_datetime, r.end_datetime, r.status,
                u.first_name, u.last_name, u.username,
                s.id as studio_id, s.name as studio_name
         FROM reservations r
         JOIN studios s ON r.studio_id = s.id
         JOIN users u ON r.user_id = u.id
         WHERE s.owner_id = ?
           AND r.status IN ('pending','confirmed')
           AND r.start_datetime >= NOW()
         ORDER BY r.start_datetime ASC`,
        [ownerId]
    );

    const totalsRow = counts[0] || {};

    return {
        totals: {
            total_studios: Number(totalsRow.total_studios || 0),
            total_reservations: Number(totalsRow.total_reservations || 0),
            total_revenue: Number(totalsRow.total_revenue || 0),
        },
        reservations_by_status: reservationsByStatus,
        rating: {
            average: Number(ratingRows[0]?.average_rating || 0),
            total_reviews: Number(ratingRows[0]?.total_reviews || 0),
        },
        upcoming: upcomingReservations,
    };
}

export async function fetchStudiosForOwner(ownerId) {
    const [studios] = await pool.execute(
        `SELECT s.*
         FROM studios s
         WHERE s.owner_id = ?
         ORDER BY s.created_at DESC`,
        [ownerId]
    );

    for (const studio of studios) {
        studio.review_stats = await Review.getStudioStats(studio.id);
    }

    return studios;
}

export async function fetchOwnedStudio(ownerId, studioId) {
    const studio = await Studio.findById(studioId);

    if (!studio) {
        throw new DashboardError(404, "Studio not found");
    }

    if (studio.owner_id !== ownerId) {
        throw new DashboardError(403, "Unauthorized");
    }

    return studio;
}

export async function createStudioForOwner(ownerId, payload) {
    return Studio.create({
        ...payload,
        owner_id: ownerId,
    });
}

export async function updateStudioForOwner(ownerId, studioId, payload) {
    const studio = await fetchOwnedStudio(ownerId, studioId);

    const updated = await Studio.update(studio.id, payload);
    return updated;
}

export async function deleteStudioForOwner(ownerId, studioId) {
    const studio = await fetchOwnedStudio(ownerId, studioId);

    const deleted = await Studio.delete(studio.id);
    if (!deleted) {
        throw new DashboardError(404, "Studio not found");
    }

    return true;
}

export async function fetchOwnerReservations(ownerId) {
    const [reservations] = await pool.execute(
        `SELECT r.*, u.username, u.first_name, u.last_name, u.email as user_email,
                s.name as studio_name, s.id as studio_id
         FROM reservations r
         JOIN studios s ON r.studio_id = s.id
         JOIN users u ON r.user_id = u.id
         WHERE s.owner_id = ?
         ORDER BY r.start_datetime DESC`,
        [ownerId]
    );

    return reservations;
}

export async function fetchReservationsForOwnedStudio(ownerId, studioId) {
    const studio = await fetchOwnedStudio(ownerId, studioId);
    return Reservation.findByStudio(studio.id);
}

export { DashboardError };
