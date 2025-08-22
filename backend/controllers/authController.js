import User from "../models/User.js";
import { comparePassword, generateToken } from "../utils/auth.js";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    path: "/",
});

export const register = async (req, res) => {
    try {
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
        } = req.body;

        const [emailExists, usernameExists, phoneExists] = await Promise.all([
            User.emailExists(email),
            User.usernameExists(username),
            User.phoneExists(phone),
        ]);

        switch (true) {
            case emailExists:
                return res.status(400).json({
                    success: false,
                    message: "This email is already in use",
                });
            case usernameExists:
                return res.status(400).json({
                    success: false,
                    message: "This username is already in use",
                });
            case phoneExists:
                return res.status(400).json({
                    success: false,
                    message: "This phone number is already in use",
                });
            default:
                break;
        }


        const user = await User.create({
            username,
            email,
            password,
            role_id,
            first_name,
            last_name,
            phone,
            city,
            postal_code,
        });

        // generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role_name,
        });

        res.cookie("auth_token", token, getCookieOptions());

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role_name: user.role_name,
                },
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // get user by email
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role_name,
        });

        res.cookie("auth_token", token, getCookieOptions());

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role_name: user.role_name,
                },
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("auth_token", getCookieOptions());

        res.json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    city: user.city,
                    postal_code: user.postal_code,
                    role_name: user.role_name,
                    role_description: user.role_description,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            },
        });
    } catch (error) {
        console.error("Profile retrieval error:", error);
        res.status(500).json({
            success: false,
            message: "Profile retrieval failed",
        });
    }
};
