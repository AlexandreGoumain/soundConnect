import { randomUUID } from "crypto";
import { pool } from "../config/database.js";

class Studio {
    static async findFiltered(filters) {
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

        // Base query
        const where = [];
        const params = [];

        if (city) {
            where.push("s.city LIKE ?");
            params.push(`%${city}%`);
        }
        if (postal_code) {
            where.push("s.postal_code LIKE ?");
            params.push(`%${postal_code}%`);
        }
        if (min_rate) {
            where.push("s.hourly_rate >= ?");
            params.push(min_rate);
        }
        if (max_rate) {
            where.push("s.hourly_rate <= ?");
            params.push(max_rate);
        }
        if (tags) {
            const list = String(tags)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            for (const t of list) {
                where.push("s.tags LIKE ?");
                params.push(`%${t}%`);
            }
        }

        if (equipment) {
            const list = String(equipment)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            for (const t of list) {
                where.push("s.equipment_list LIKE ?");
                params.push(`%${t}%`);
            }
        }

        let orderBy = "s.created_at DESC";
        if (sort === "price_asc") orderBy = "s.hourly_rate ASC";
        if (sort === "price_desc") orderBy = "s.hourly_rate DESC";
        if (sort === "rating_desc") orderBy = "rs.average_rating DESC";

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

        // Attach review stats via LEFT JOIN subquery for ordering by rating
        const [rows] = await pool.execute(
            `SELECT s.*, u.username as owner_username, u.email as owner_email,
                    u.first_name as owner_first_name, u.last_name as owner_last_name,
                    rs.total_reviews, rs.average_rating, rs.five_star, rs.four_star,
                    rs.three_star, rs.two_star, rs.one_star
             FROM studios s
             JOIN users u ON s.owner_id = u.id
             LEFT JOIN (
                SELECT studio_id,
                       COUNT(*) as total_reviews,
                       AVG(rating) as average_rating,
                       SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                       SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                       SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                       SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                       SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
                FROM reviews
                GROUP BY studio_id
             ) rs ON rs.studio_id = s.id
             ${whereSql}
             ORDER BY ${orderBy}`,
            params
        );

        // Normalize to match findAll shape (review_stats object)
        for (const studio of rows) {
            studio.review_stats = {
                total_reviews: studio.total_reviews || 0,
                average_rating: studio.average_rating || 0,
                five_star: studio.five_star || 0,
                four_star: studio.four_star || 0,
                three_star: studio.three_star || 0,
                two_star: studio.two_star || 0,
                one_star: studio.one_star || 0,
            };
            delete studio.total_reviews;
            delete studio.average_rating;
            delete studio.five_star;
            delete studio.four_star;
            delete studio.three_star;
            delete studio.two_star;
            delete studio.one_star;
        }

        // Optional: filter by availability on date with given duration (hours)
        if (available_on) {
            const targetDate = new Date(available_on);
            if (!isNaN(targetDate.getTime())) {
                const durationHours = Math.min(
                    12,
                    Math.max(1, parseInt(duration || "1", 10) || 1)
                );
                const dayNames = [
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                ];
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const targetYMD = new Date(targetDate);
                targetYMD.setHours(0, 0, 0, 0);
                const sameDay = targetYMD.getTime() === today.getTime();

                const keep = [];
                for (const studio of rows) {
                    const schedule = studio.schedule || null;
                    if (!schedule) continue;
                    const daySchedule = schedule[dayNames[targetDate.getDay()]];
                    if (!daySchedule || !daySchedule.is_open) continue;

                    const openTime = new Date(
                        `${available_on}T${daySchedule.open_time}:00`
                    );
                    const closeTime = new Date(
                        `${available_on}T${daySchedule.close_time}:00`
                    );
                    if (!(closeTime > openTime)) continue;

                    // Apply minimum advance booking if date is today (1h, rounded to next hour)
                    let effectiveOpen = new Date(openTime);
                    if (sameDay) {
                        const now = new Date();
                        const minAdvance = new Date(now.getTime() + 60 * 60 * 1000);
                        const nextHour = new Date(minAdvance);
                        nextHour.setMinutes(0, 0, 0);
                        while (nextHour < minAdvance) {
                            nextHour.setHours(nextHour.getHours() + 1);
                        }
                        if (nextHour > effectiveOpen) effectiveOpen = nextHour;
                    }
                    if (effectiveOpen >= closeTime) continue;

                    // Get reservations on that date
                    const [reservations] = await pool.execute(
                        `SELECT start_datetime, end_datetime
                         FROM reservations
                         WHERE studio_id = ?
                           AND DATE(start_datetime) = DATE(?)
                           AND status IN ('confirmed','pending')`,
                        [studio.id, available_on]
                    );

                    const inWindow = reservations
                        .map((r) => ({
                            start: new Date(r.start_datetime),
                            end: new Date(r.end_datetime),
                        }))
                        .filter((iv) => iv.end > effectiveOpen && iv.start < closeTime)
                        .map((iv) => ({
                            start: iv.start < effectiveOpen ? effectiveOpen : iv.start,
                            end: iv.end > closeTime ? closeTime : iv.end,
                        }))
                        .sort((a, b) => a.start - b.start);

                    // Merge overlaps
                    const merged = [];
                    for (const iv of inWindow) {
                        if (!merged.length || iv.start > merged[merged.length - 1].end) {
                            merged.push({ ...iv });
                        } else {
                            merged[merged.length - 1].end = new Date(
                                Math.max(
                                    merged[merged.length - 1].end.getTime(),
                                    iv.end.getTime()
                                )
                            );
                        }
                    }

                    // Check free gaps >= duration
                    const needMs = durationHours * 60 * 60 * 1000;
                    let prev = effectiveOpen;
                    let ok = false;
                    if (!merged.length) {
                        ok = closeTime.getTime() - prev.getTime() >= needMs;
                    } else {
                        for (const iv of merged) {
                            if (iv.start.getTime() - prev.getTime() >= needMs) {
                                ok = true;
                                break;
                            }
                            if (iv.end > prev) prev = iv.end;
                        }
                        if (!ok && closeTime.getTime() - prev.getTime() >= needMs) {
                            ok = true;
                        }
                    }
                    if (ok) keep.push(studio);
                }

                rows.length = 0;
                for (const s of keep) rows.push(s);
            }
        }

        return rows;
    }
    static async create(studioData) {
        const {
            name,
            description,
            street_number,
            street_name,
            postal_code,
            city,
            country = "France",
            hourly_rate,
            phone,
            email,
            website,
            equipment_list,
            tags,
            images,
            owner_id,
        } = studioData;

        const [emailExists, phoneExists] = await Promise.all([
            Studio.emailExists(email),
            Studio.phoneExists(phone),
        ]);

        if (emailExists) {
            throw new Error("This email is already in use");
        }

        if (phoneExists) {
            throw new Error("This phone number is already in use");
        }

        const id = randomUUID();

        const [result] = await pool.execute(
            `INSERT INTO studios (
                id, name, description, street_number, street_name, postal_code, city, country,
                hourly_rate, phone, email, website, equipment_list, tags, images, owner_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                name,
                description,
                street_number,
                street_name,
                postal_code,
                city,
                country,
                hourly_rate,
                phone,
                email,
                website || null,
                equipment_list || null,
                tags || null,
                images || null,
                owner_id,
            ]
        );

        return await this.findById(id);
    }

    static async findAll() {
        const [studios] = await pool.execute(
            `SELECT s.*, u.username as owner_username, u.email as owner_email,
                    u.first_name as owner_first_name, u.last_name as owner_last_name
             FROM studios s 
             JOIN users u ON s.owner_id = u.id 
             ORDER BY s.created_at DESC`
        );

        // Add review statistics to each studio
        for (let studio of studios) {
            const [reviewStats] = await pool.execute(
                `SELECT 
                    COUNT(*) as total_reviews,
                    AVG(rating) as average_rating,
                    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
                 FROM reviews 
                 WHERE studio_id = ?`,
                [studio.id]
            );

            studio.review_stats = reviewStats[0];
        }

        return studios;
    }

    static async findById(id) {
        const [studios] = await pool.execute(
            `SELECT s.*, u.username as owner_username, u.email as owner_email,
                    u.first_name as owner_first_name, u.last_name as owner_last_name
             FROM studios s 
             JOIN users u ON s.owner_id = u.id 
             WHERE s.id = ?`,
            [id]
        );

        if (studios.length === 0) {
            return null;
        }

        const studio = studios[0];

        // Get review statistics
        const [reviewStats] = await pool.execute(
            `SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
             FROM reviews 
             WHERE studio_id = ?`,
            [id]
        );

        studio.review_stats = reviewStats[0];

        return studio;
    }

    static async findByOwner(owner_id) {
        const [studios] = await pool.execute(
            `SELECT s.*, u.username as owner_username, u.email as owner_email,
                    u.first_name as owner_first_name, u.last_name as owner_last_name
             FROM studios s 
             JOIN users u ON s.owner_id = u.id 
             WHERE s.owner_id = ?
             ORDER BY s.created_at DESC`,
            [owner_id]
        );

        return studios;
    }

    static async update(id, updateData) {
        const allowedFields = [
            "name",
            "description",
            "street_number",
            "street_name",
            "postal_code",
            "city",
            "country",
            "hourly_rate",
            "phone",
            "email",
            "website",
            "equipment_list",
            "tags",
            "images",
            "schedule",
        ];

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

        if (updateData.email) {
            const emailExists = await Studio.emailExists(updateData.email, id);
            if (emailExists) {
                throw new Error("This email is already in use");
            }
        }

        if (updateData.phone) {
            const phoneExists = await Studio.phoneExists(updateData.phone, id);
            if (phoneExists) {
                throw new Error("This phone number is already in use");
            }
        }

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE studios SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        if (result.affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }

    static async delete(id) {
        const [result] = await pool.execute(
            "DELETE FROM studios WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    }

    static async emailExists(email, excludeId = null) {
        let query = "SELECT COUNT(*) as count FROM studios WHERE email = ?";
        let params = [email];

        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }

        const [result] = await pool.execute(query, params);
        return result[0].count > 0;
    }

    static async phoneExists(phone, excludeId = null) {
        let query = "SELECT COUNT(*) as count FROM studios WHERE phone = ?";
        let params = [phone];

        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }

        const [result] = await pool.execute(query, params);
        return result[0].count > 0;
    }

    static async updateSchedule(id, scheduleData) {
        // Validate schedule data structure
        const validDays = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];

        for (const day of validDays) {
            if (scheduleData[day]) {
                const daySchedule = scheduleData[day];
                if (typeof daySchedule.is_open !== "boolean") {
                    throw new Error(`Invalid is_open value for ${day}`);
                }
                if (daySchedule.is_open) {
                    if (!daySchedule.open_time || !daySchedule.close_time) {
                        throw new Error(
                            `Missing open_time or close_time for ${day}`
                        );
                    }
                    // Validate time format (HH:MM)
                    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                    if (
                        !timeRegex.test(daySchedule.open_time) ||
                        !timeRegex.test(daySchedule.close_time)
                    ) {
                        throw new Error(
                            `Invalid time format for ${day}. Use HH:MM format.`
                        );
                    }
                    // Validate that close_time is after open_time
                    const openTime = new Date(
                        `2000-01-01T${daySchedule.open_time}:00`
                    );
                    const closeTime = new Date(
                        `2000-01-01T${daySchedule.close_time}:00`
                    );
                    if (closeTime <= openTime) {
                        throw new Error(
                            `Close time must be after open time for ${day}`
                        );
                    }
                }
            }
        }

        const [result] = await pool.execute(
            "UPDATE studios SET schedule = ? WHERE id = ?",
            [JSON.stringify(scheduleData), id]
        );

        if (result.affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }

    static async getSchedule(id) {
        const [studios] = await pool.execute(
            "SELECT schedule FROM studios WHERE id = ?",
            [id]
        );

        if (studios.length === 0) {
            return null;
        }

        return studios[0].schedule || {};
    }
}

export default Studio;
