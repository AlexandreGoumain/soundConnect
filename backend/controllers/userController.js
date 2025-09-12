import User from "../models/User.js";
import { comparePassword } from "../utils/auth.js";

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // check if user has permission to access this user (owner)
        if (req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only access your own profile",
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving user",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // check if user has permission to update this user (owner)
        if (req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only update your own profile",
            });
        }

        const updatedUser = await User.update(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: { user: updatedUser },
        });
    } catch (error) {
        console.error("Error updating profile:", error);

        if (error.message === "No valid data to update") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating profile",
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // check if user has permission to change password (owner)
        if (req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only change your own password",
            });
        }

        // get user by email
        const user = await User.findByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // check if current password is valid
        const isCurrentPasswordValid = await comparePassword(
            currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // update password
        await User.updatePassword(id, newPassword);

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            success: false,
            message: "Error changing password",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check permissions: user can delete own account
        const isOwner = req.user.id === id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own account",
            });
        }

        const deleted = await User.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
        });
    }
};
