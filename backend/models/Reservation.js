import { randomUUID } from "crypto";
import { pool } from "../config/database.js";

class Reservation {
    static async create(reservationData) {
        const {
            user_id,
            studio_id,
            start_datetime,
            end_datetime,
            special_requests = null,
        } = reservationData;

        // Check if studio exists and get hourly rate
        const [studios] = await pool.execute(
            "SELECT id, hourly_rate FROM studios WHERE id = ?",
            [studio_id]
        );

        if (studios.length === 0) {
            throw new Error("Studio not found");
        }

        // Check for overlapping reservations
        const hasConflict = await this.checkTimeConflict(
            studio_id,
            start_datetime,
            end_datetime
        );

        if (hasConflict) {
            throw new Error(
                "This time slot conflicts with an existing reservation"
            );
        }

        // Calculate total price (in hours)
        const startTime = new Date(start_datetime);
        const endTime = new Date(end_datetime);
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        const total_price = (hours * studios[0].hourly_rate).toFixed(2);

        const id = randomUUID();

        await pool.execute(
            `INSERT INTO reservations (
                id, user_id, studio_id, start_datetime, end_datetime, total_price, special_requests, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                id,
                user_id,
                studio_id,
                start_datetime,
                end_datetime,
                total_price,
                special_requests,
            ]
        );

        return await this.findById(id);
    }

    static async findAll() {
        const [reservations] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.email as user_email, u.first_name, u.last_name,
                    s.name as studio_name, s.email as studio_email, s.city as studio_city,
                    s.owner_id as studio_owner_id
             FROM reservations r
             JOIN users u ON r.user_id = u.id
             JOIN studios s ON r.studio_id = s.id
             ORDER BY r.created_at DESC`
        );

        return reservations;
    }

    static async findById(id) {
        const [reservations] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.email as user_email, u.first_name, u.last_name, u.phone as user_phone,
                    s.name as studio_name, s.email as studio_email, s.phone as studio_phone,
                    s.street_number, s.street_name, s.city as studio_city, s.postal_code as studio_postal_code,
                    s.owner_id as studio_owner_id
             FROM reservations r 
             JOIN users u ON r.user_id = u.id 
             JOIN studios s ON r.studio_id = s.id 
             WHERE r.id = ?`,
            [id]
        );

        return reservations.length > 0 ? reservations[0] : null;
    }

    static async findByUserWithPagination(user_id, options = {}) {
        const { page = 1, limit = 5, status = null, sort = 'date' } = options;
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const offset = (pageInt - 1) * limitInt;

        let whereClause = 'WHERE r.user_id = ?';
        let params = [user_id];

        if (status && status !== 'all') {
            whereClause += ' AND r.status = ?';
            params.push(status);
        }

        let orderClause = 'ORDER BY r.start_datetime DESC';
        if (sort === 'status') {
            orderClause = 'ORDER BY r.status ASC, r.start_datetime DESC';
        } else if (sort === 'studio') {
            orderClause = 'ORDER BY s.name ASC, r.start_datetime DESC';
        }

        // Get total count
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM reservations r ${whereClause}`,
            params
        );

        const totalReservations = countResult[0].total;
        const totalPages = Math.ceil(totalReservations / limitInt);

        // Get paginated results with has_reviewed flag
        const [reservations] = await pool.execute(
            `SELECT r.*,
                    s.name as studio_name, s.email as studio_email, s.phone as studio_phone,
                    s.street_number, s.street_name, s.city as studio_city, s.postal_code as studio_postal_code,
                    CONCAT(s.street_number, ' ', s.street_name) as studio_address,
                    EXISTS(SELECT 1 FROM reviews WHERE reservation_id = r.id) as has_reviewed
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             ${whereClause}
             ${orderClause}
             LIMIT ${limitInt} OFFSET ${offset}`,
            params
        );

        return {
            reservations,
            pagination: {
                currentPage: pageInt,
                totalPages,
                totalReservations,
                pageSize: limitInt,
                hasNextPage: pageInt < totalPages,
                hasPrevPage: pageInt > 1,
            }
        };
    }

    static async findByUser(user_id) {
        const [reservations] = await pool.execute(
            `SELECT r.*,
                    s.name as studio_name, s.email as studio_email, s.phone as studio_phone,
                    s.street_number, s.street_name, s.city as studio_city, s.postal_code as studio_postal_code,
                    CONCAT(s.street_number, ' ', s.street_name) as studio_address,
                    EXISTS(SELECT 1 FROM reviews WHERE reservation_id = r.id) as has_reviewed
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             WHERE r.user_id = ?
             ORDER BY r.start_datetime DESC`,
            [user_id]
        );

        return reservations;
    }

    static async findByStudio(studio_id) {
        const [reservations] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.email as user_email, u.first_name, u.last_name, u.phone as user_phone
             FROM reservations r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.studio_id = ?
             ORDER BY r.start_datetime DESC`,
            [studio_id]
        );

        return reservations;
    }

    static async findByStudioOwner(owner_id) {
        const [reservations] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.email as user_email, u.first_name, u.last_name, u.phone as user_phone,
                    s.name as studio_name, s.id as studio_id
             FROM reservations r 
             JOIN users u ON r.user_id = u.id 
             JOIN studios s ON r.studio_id = s.id 
             WHERE s.owner_id = ?
             ORDER BY r.start_datetime DESC`,
            [owner_id]
        );

        return reservations;
    }

    static async update(id, updateData) {
        const allowedFields = ["status", "special_requests"];
        const fields = [];
        const values = [];

        // Build dynamic query with only provided fields
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error("No valid data to update");
        }

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE reservations SET ${fields.join(
                ", "
            )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        if (result.affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }

    static async delete(id) {
        const [result] = await pool.execute(
            "DELETE FROM reservations WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    }

    static async checkTimeConflict(
        studio_id,
        start_datetime,
        end_datetime,
        excludeId = null
    ) {
        // Overlap exists if an existing reservation starts before the new end
        // and ends after the new start. This single condition covers all cases.
        let query = `
            SELECT COUNT(*) as count
            FROM reservations
            WHERE studio_id = ?
              AND status IN ('pending', 'confirmed')
              AND start_datetime < ?
              AND end_datetime > ?
        `;
        const params = [studio_id, end_datetime, start_datetime];

        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }

        const [result] = await pool.execute(query, params);
        return result[0].count > 0;
    }

    static async findExpiredNotCompleted(currentTime) {
        const [reservations] = await pool.execute(
            `SELECT * FROM reservations
             WHERE end_datetime < ?
             AND status NOT IN ('completed', 'cancelled', 'expired')`,
            [currentTime]
        );

        return reservations;
    }
}

export default Reservation;
