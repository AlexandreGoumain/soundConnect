import { pool } from "../config/database.js";

const REGISTRATION_ROLE_NAMES = ["artist", "studio"];

export async function getRegistrationRoles() {
    const placeholders = REGISTRATION_ROLE_NAMES.map(() => "?").join(", ");
    const query = `SELECT id, name, description FROM roles WHERE name IN (${placeholders}) ORDER BY name`;

    const [rows] = await pool.execute(query, REGISTRATION_ROLE_NAMES);
    return rows;
}
