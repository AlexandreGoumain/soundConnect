import { pool } from "../config/database.js";

class Studio {
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

        const [result] = await pool.execute(
            `INSERT INTO studios (
                name, description, street_number, street_name, postal_code, city, country,
                hourly_rate, phone, email, website, equipment_list, tags, images, owner_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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

        if (result.insertId) {
            return await this.findById(result.insertId);
        }
        return null;
    }

    static async findAll() {
        const [studios] = await pool.execute(
            `SELECT s.*, u.username as owner_username, u.email as owner_email,
                    u.first_name as owner_first_name, u.last_name as owner_last_name
             FROM studios s 
             JOIN users u ON s.owner_id = u.id 
             ORDER BY s.created_at DESC`
        );

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

        return studios.length > 0 ? studios[0] : null;
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
}

export default Studio;
