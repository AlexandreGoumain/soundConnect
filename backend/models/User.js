import { pool } from "../config/database.js";
import { hashPassword } from "../utils/auth.js";

class User {
    static async create(userData) {
        const {
            username,
            email,
            password,
            role_id,
            first_name,
            last_name,
            phone,
            city,
            postal_code,
        } = userData;

        // hash password
        const hashedPassword = await hashPassword(password);

        const [result] = await pool.execute(
            `INSERT INTO users 
             (username, email, password, role_id, first_name, last_name, phone, city, postal_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                username,
                email,
                hashedPassword,
                role_id,
                first_name,
                last_name,
                phone,
                city,
                postal_code,
            ]
        );

        return await this.findById(result.insertId);
    }

    static async findById(id) {
        const [users] = await pool.execute(
            `SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
                    u.phone, u.city, u.postal_code, u.created_at, u.updated_at,
                    r.name as role_name, r.id as role_id, r.description as role_description
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [id]
        );

        return users.length > 0 ? users[0] : null;
    }

    static async findByEmail(email) {
        const [users] = await pool.execute(
            `SELECT u.*, r.name as role_name, r.description as role_description
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = ?`,
            [email]
        );

        return users.length > 0 ? users[0] : null;
    }

    static async findByUsername(username) {
        const [users] = await pool.execute(
            `SELECT u.*, r.name as role_name, r.description as role_description
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.username = ?`,
            [username]
        );

        return users.length > 0 ? users[0] : null;
    }

    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        // total count
        const [countResult] = await pool.execute(
            "SELECT COUNT(*) as total FROM users"
        );
        const total = countResult[0].total;

        // Utilisateurs avec pagination
        const [users] = await pool.execute(
            `SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
                    u.phone, u.city, u.postal_code, u.created_at, u.updated_at,
                    r.name as role_name, r.id as role_id, r.description as role_description
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             ORDER BY u.created_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        return {
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                limit,
            },
        };
    }

    static async update(id, updateData) {
        const allowedFields = [
            "first_name",
            "last_name",
            "phone",
            "city",
            "postal_code",
        ];
        const updates = [];
        const values = [];

        // dynamic query construction
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            throw new Error("No valid data to update");
        }

        values.push(id);

        await pool.execute(
            `UPDATE users SET ${updates.join(
                ", "
            )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        return await this.findById(id);
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await hashPassword(newPassword);

        await pool.execute(
            "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [hashedPassword, id]
        );
    }

    static async delete(id) {
        const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
            id,
        ]);

        return result.affectedRows > 0;
    }

    static async emailExists(email, excludeId = null) {
        let query = "SELECT COUNT(*) as count FROM users WHERE email = ?";
        let params = [email];

        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }

        const [result] = await pool.execute(query, params);
        return result[0].count > 0;
    }

    static async usernameExists(username, excludeId = null) {
        let query = "SELECT COUNT(*) as count FROM users WHERE username = ?";
        let params = [username];

        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }

        const [result] = await pool.execute(query, params);
        return result[0].count > 0;
    }
}

export default User;
