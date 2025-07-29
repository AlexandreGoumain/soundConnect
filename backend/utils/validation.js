import Joi from "joi";

// validation schemas for authentication and users

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required().messages({
        "string.alphanum": "Username must contain only letters and numbers",
        "string.min": "Username must contain at least 3 characters",
        "string.max": "Username cannot exceed 50 characters",
        "any.required": "Username is required",
    }),

    email: Joi.string().email().max(100).required().messages({
        "string.email": "Email must be valid",
        "string.max": "Email cannot exceed 100 characters",
        "any.required": "Email is required",
    }),

    password: Joi.string()
        .min(6)
        .max(128)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
        .required()
        .messages({
            "string.min": "Password must contain at least 6 characters",
            "string.max": "Password cannot exceed 128 characters",
            "string.pattern.base":
                "Password must contain at least one lowercase letter, one uppercase letter and one number",
            "any.required": "Password is required",
        }),

    role_id: Joi.number().integer().valid(2, 3).required().messages({
        "number.base": "Please select a valid role",
        "number.integer": "Role must be a valid number",
        "any.only":
            "The selected role is not valid. Choose between: Artist, or Studio Owner",
        "any.required": "Please select a role",
    }),

    first_name: Joi.string().min(2).max(50).required().messages({
        "string.min": "First name must contain at least 2 characters",
        "string.max": "First name cannot exceed 50 characters",
        "any.required": "First name is required",
    }),

    last_name: Joi.string().min(2).max(50).required().messages({
        "string.min": "Last name must contain at least 2 characters",
        "string.max": "Last name cannot exceed 50 characters",
        "any.required": "Last name is required",
    }),

    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .max(20)
        .optional()
        .messages({
            "string.pattern.base": "Phone number is not valid",
            "string.max": "Phone number cannot exceed 20 characters",
        }),

    city: Joi.string().max(100).optional().messages({
        "string.max": "City cannot exceed 100 characters",
    }),

    postal_code: Joi.string().max(10).optional().messages({
        "string.max": "Postal code cannot exceed 10 characters",
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

export const updateUserSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).optional().messages({
        "string.min": "First name must contain at least 2 characters",
        "string.max": "First name cannot exceed 50 characters",
    }),

    username: Joi.string().alphanum().min(3).max(50).optional().messages({
        "string.alphanum": "Username must contain only letters and numbers",
        "string.min": "Username must contain at least 3 characters",
        "string.max": "Username cannot exceed 50 characters",
    }),

    email: Joi.string().email().max(100).optional().messages({
        "string.email": "Email must be valid",
        "string.max": "Email cannot exceed 100 characters",
    }),

    last_name: Joi.string().min(2).max(50).optional().messages({
        "string.min": "Last name must contain at least 2 characters",
        "string.max": "Last name cannot exceed 50 characters",
    }),

    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .max(20)
        .optional()
        .allow("")
        .messages({
            "string.pattern.base": "Phone number is not valid",
            "string.max": "Phone number cannot exceed 20 characters",
        }),

    city: Joi.string().max(100).optional().allow("").messages({
        "string.max": "City cannot exceed 100 characters",
    }),

    postal_code: Joi.string().max(10).optional().allow("").messages({
        "string.max": "Postal code cannot exceed 10 characters",
    }),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required",
    }),

    newPassword: Joi.string()
        .min(6)
        .max(128)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
        .required()
        .messages({
            "string.min": "New password must contain at least 6 characters",
            "string.max": "New password cannot exceed 128 characters",
            "string.pattern.base":
                "New password must contain at least one lowercase letter, one uppercase letter and one number",
            "any.required": "New password is required",
        }),
});

export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors,
            });
        }

        req.body = value;
        next();
    };
};
