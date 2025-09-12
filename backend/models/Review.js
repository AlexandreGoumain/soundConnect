import { randomUUID } from "crypto";
import { pool } from "../config/database.js";

class Review {
    static async create(reviewData) {
        const {
            user_id,
            studio_id,
            reservation_id,
            rating,
            comment = null,
        } = reviewData;

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        // Check if reservation exists and belongs to user
        const [reservations] = await pool.execute(
            `SELECT id, user_id, studio_id, status, end_datetime 
             FROM reservations 
             WHERE id = ? AND user_id = ? AND studio_id = ?`,
            [reservation_id, user_id, studio_id]
        );

        if (reservations.length === 0) {
            throw new Error("Reservation not found or does not belong to user");
        }

        const reservation = reservations[0];

        if (reservation.status !== "completed") {
            throw new Error("Can only review completed reservations");
        }

        const now = new Date();
        const endTime = new Date(reservation.end_datetime);
        if (endTime > now) {
            throw new Error("Can only review after reservation has ended");
        }

        // Check if user already reviewed this specific reservation
        const [existingReviews] = await pool.execute(
            "SELECT id FROM reviews WHERE user_id = ? AND reservation_id = ?",
            [user_id, reservation_id]
        );

        if (existingReviews.length > 0) {
            throw new Error("You have already reviewed this reservation");
        }

        // Check if user has artist role
        const [userRole] = await pool.execute(
            `SELECT r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [user_id]
        );

        if (userRole.length === 0 || userRole[0].role_name !== "artist") {
            throw new Error("Only artists can leave reviews");
        }

        const id = randomUUID();

        await pool.execute(
            `INSERT INTO reviews (id, user_id, studio_id, reservation_id, rating, comment)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, user_id, studio_id, reservation_id, rating, comment]
        );

        return await this.findById(id);
    }

    static async findAll() {
        const [reviews] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.first_name, u.last_name,
                    s.name as studio_name,
                    res.start_datetime, res.end_datetime
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN studios s ON r.studio_id = s.id
             JOIN reservations res ON r.reservation_id = res.id
             ORDER BY r.created_at DESC`
        );

        return reviews;
    }

    static async findById(id) {
        const [reviews] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.first_name, u.last_name,
                    s.name as studio_name,
                    res.start_datetime, res.end_datetime
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN studios s ON r.studio_id = s.id
             JOIN reservations res ON r.reservation_id = res.id
             WHERE r.id = ?`,
            [id]
        );

        return reviews.length > 0 ? reviews[0] : null;
    }

    static async findByStudio(studio_id) {
        const [reviews] = await pool.execute(
            `SELECT r.*, 
                    u.username, u.first_name, u.last_name,
                    res.start_datetime, res.end_datetime
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN reservations res ON r.reservation_id = res.id
             WHERE r.studio_id = ?
             ORDER BY r.created_at DESC`,
            [studio_id]
        );

        return reviews;
    }

    static async findByUser(user_id) {
        const [reviews] = await pool.execute(
            `SELECT r.*, 
                    s.name as studio_name,
                    res.start_datetime, res.end_datetime
             FROM reviews r
             JOIN studios s ON r.studio_id = s.id
             JOIN reservations res ON r.reservation_id = res.id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC`,
            [user_id]
        );

        return reviews;
    }

    static async getStudioStats(studio_id) {
        const [stats] = await pool.execute(
            `SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                MIN(rating) as min_rating,
                MAX(rating) as max_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
             FROM reviews 
             WHERE studio_id = ?`,
            [studio_id]
        );

        return stats.length > 0
            ? stats[0]
            : {
                  total_reviews: 0,
                  average_rating: 0,
                  min_rating: 0,
                  max_rating: 0,
                  five_star: 0,
                  four_star: 0,
                  three_star: 0,
                  two_star: 0,
                  one_star: 0,
              };
    }

    static async update(id, updateData) {
        const allowedFields = ["rating", "comment"];
        const fields = [];
        const values = [];

        // Build dynamic query with only provided fields
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                if (key === "rating" && (value < 1 || value > 5)) {
                    throw new Error("Rating must be between 1 and 5");
                }
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error("No valid data to update");
        }

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE reviews SET ${fields.join(
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
            "DELETE FROM reviews WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    }

    static async canUserReview(user_id, studio_id) {
        // Check if user has artist role
        const [userRole] = await pool.execute(
            `SELECT r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [user_id]
        );

        if (userRole.length === 0 || userRole[0].role_name !== "artist") {
            return {
                canReview: false,
                reason: "Only artists can leave reviews",
            };
        }

        // Check if user has completed reservations for this studio
        const [reservations] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM reservations 
             WHERE user_id = ? AND studio_id = ? AND status = 'completed' 
             AND end_datetime < NOW()`,
            [user_id, studio_id]
        );

        if (reservations[0].count === 0) {
            return {
                canReview: false,
                reason: "No completed reservations found",
            };
        }

        return { canReview: true };
    }

    static async getReservationsForReview(user_id, studio_id) {
        // Get completed reservations that haven't been reviewed yet
        const [reservations] = await pool.execute(
            `SELECT r.id, r.start_datetime, r.end_datetime, r.status,
                    s.name as studio_name
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             WHERE r.user_id = ? AND r.studio_id = ? AND r.status = 'completed' 
             AND r.end_datetime < NOW()
             AND r.id NOT IN (
                 SELECT reservation_id FROM reviews WHERE user_id = ? AND reservation_id = r.id
             )
             ORDER BY r.end_datetime DESC`,
            [user_id, studio_id, user_id]
        );

        return reservations;
    }
}

export default Review;
