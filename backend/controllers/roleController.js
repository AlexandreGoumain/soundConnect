import { getRegistrationRoles } from "../services/roleService.js";

// Return available roles for registration (e.g., artist, studio)
export const getRoles = async (req, res) => {
    try {
        const roles = await getRegistrationRoles();

        res.json({ success: true, data: { roles } });
    } catch (error) {
        error("getRoles error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch roles",
        });
    }
};
