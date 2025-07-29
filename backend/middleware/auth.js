import { pool } from "../config/database.js";
import { verifyToken } from "../utils/auth.js";

export const authenticateToken = async (req, res, next) => {
    try {
        // Authentication via httpOnly cookie ONLY
        const token = req.cookies?.auth_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required - please login",
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // get user from db
        const [users] = await pool.execute(
            `SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
                    u.phone, u.city, u.postal_code, r.name as role_name, r.id as role_id
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // add user to request
        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }

        console.error("Authentication middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    try {
        // Authentication via httpOnly cookie ONLY
        const token = req.cookies?.auth_token;

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = verifyToken(token);

        const [users] = await pool.execute(
            `SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
                    u.phone, u.city, u.postal_code, r.name as role_name, r.id as role_id
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [decoded.userId]
        );

        req.user = users.length > 0 ? users[0] : null;
        next();
    } catch (error) {
        // if error, continue without authenticated user
        req.user = null;
        next();
    }
};
