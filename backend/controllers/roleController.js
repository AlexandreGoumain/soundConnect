import { pool } from '../config/database.js';

// Return available roles for registration (e.g., artist, studio)
export const getRoles = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, description FROM roles WHERE name IN (?, ?) ORDER BY name',
      ['artist', 'studio'],
    );

    res.json({ success: true, data: { roles: rows } });
  } catch (error) {
    console.error('getRoles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
};

