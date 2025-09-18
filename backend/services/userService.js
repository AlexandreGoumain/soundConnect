import User from "../models/User.js";
import { comparePassword } from "../utils/auth.js";

class UserError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const PROFILE_UPDATE_FIELDS = [
    "first_name",
    "last_name",
    "email",
    "username",
    "phone",
    "city",
    "postal_code",
];

const pickFields = (source, fields) => {
    const result = {};

    for (const field of fields) {
        if (Object.prototype.hasOwnProperty.call(source, field)) {
            result[field] = source[field];
        }
    }

    return result;
};

export const formatUserProfile = (user) => ({
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
});

export async function findProfileById(id) {
    const user = await User.findById(id);
    return user ? formatUserProfile(user) : null;
}

export async function updateProfileById(id, payload, requester) {
    if (requester?.id !== id) {
        throw new UserError(
            403,
            "Unauthorized: You can only update your own profile"
        );
    }

    const updateData = pickFields(payload, PROFILE_UPDATE_FIELDS);
    const updatedUser = await User.update(id, updateData);

    if (!updatedUser) {
        throw new UserError(404, "User not found");
    }

    return formatUserProfile(updatedUser);
}

export async function getUserByIdForOwner(id, requester) {
    const user = await findProfileById(id);

    if (!user) {
        throw new UserError(404, "User not found");
    }

    if (requester?.id !== id) {
        throw new UserError(
            403,
            "Unauthorized: You can only access your own profile"
        );
    }

    return user;
}

export async function changePasswordForUser(id, requester, payload) {
    const { currentPassword, newPassword } = payload;

    if (requester?.id !== id) {
        throw new UserError(
            403,
            "Unauthorized: You can only change your own password"
        );
    }

    const user = await User.findByEmail(requester.email);

    if (!user) {
        throw new UserError(404, "User not found");
    }

    const isCurrentPasswordValid = await comparePassword(
        currentPassword,
        user.password
    );

    if (!isCurrentPasswordValid) {
        throw new UserError(400, "Current password is incorrect");
    }

    await User.updatePassword(id, newPassword);
}

export async function deleteUserAccount(id, requester) {
    if (requester?.id !== id) {
        throw new UserError(
            403,
            "Unauthorized: You can only delete your own account"
        );
    }

    const deleted = await User.delete(id);

    if (!deleted) {
        throw new UserError(404, "User not found");
    }

    return true;
}

export { UserError };
