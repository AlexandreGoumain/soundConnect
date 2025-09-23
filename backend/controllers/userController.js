import {
    UserError,
    changePasswordForUser,
    deleteUserAccount,
    getUserByIdForOwner,
    updateProfileById,
} from "../services/userService.js";

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdForOwner(id, req.user);

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        handleUserError(res, error, "Error retrieving user");
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await updateProfileById(id, req.body, req.user);

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: { user: updatedUser },
        });
    } catch (error) {
        handleUserError(res, error, "Error updating profile");
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        await changePasswordForUser(id, req.user, req.body);

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        handleUserError(res, error, "Error changing password");
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteUserAccount(id, req.user);

        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        handleUserError(res, error, "Error deleting user");
    }
};

function handleUserError(res, error, fallbackMessage) {
    if (error instanceof UserError || typeof error?.statusCode === "number") {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}
