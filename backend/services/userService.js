import User from "../models/User.js";

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

export async function updateProfileById(id, payload) {
    const updateData = pickFields(payload, PROFILE_UPDATE_FIELDS);
    const updatedUser = await User.update(id, updateData);
    return formatUserProfile(updatedUser);
}
