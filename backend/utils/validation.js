import Joi from "joi";

// AUTH SCHEMA VALIDATION -----------------------------

export const registerSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9\u00C0-\u017F_\-]+$/)
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.pattern.base":
                "Username can only contain letters, numbers, accented characters, underscores (_) and hyphens (-)",
            "string.min": "Username must contain at least 3 characters",
            "string.max": "Username cannot exceed 50 characters",
            "any.required": "Username is required",
        }),

    email: Joi.string().max(100).required().messages({
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

    phone: Joi.string().max(20).optional().messages({
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
    email: Joi.string().required().messages({
        "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

// USER SCHEMA VALIDATION -----------------------------

export const updateUserSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).optional().messages({
        "string.min": "First name must contain at least 2 characters",
        "string.max": "First name cannot exceed 50 characters",
    }),

    username: Joi.string()
        .pattern(/^[a-zA-Z0-9\u00C0-\u017F_\-]+$/)
        .min(3)
        .max(50)
        .optional()
        .messages({
            "string.pattern.base":
                "Username can only contain letters, numbers, accented characters, underscores (_) and hyphens (-)",
            "string.min": "Username must contain at least 3 characters",
            "string.max": "Username cannot exceed 50 characters",
        }),

    email: Joi.string().max(100).optional().messages({
        "string.max": "Email cannot exceed 100 characters",
    }),

    last_name: Joi.string().min(2).max(50).optional().messages({
        "string.min": "Last name must contain at least 2 characters",
        "string.max": "Last name cannot exceed 50 characters",
    }),

    phone: Joi.string().max(20).optional().allow("").messages({
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

// VALIDATION MIDDLEWARE -----------------------------
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

// =====================
// STUDIO VALIDATION SCHEMAS
// =====================

export const createStudioSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.min": "Studio name must contain at least 2 characters",
        "string.max": "Studio name cannot exceed 100 characters",
        "any.required": "Studio name is required",
    }),

    description: Joi.string().min(10).max(2000).required().messages({
        "string.min": "Description must contain at least 10 characters",
        "string.max": "Description cannot exceed 2000 characters",
        "any.required": "Description is required",
    }),

    street_number: Joi.string().max(10).required().messages({
        "string.max": "Street number cannot exceed 10 characters",
        "any.required": "Street number is required",
    }),

    street_name: Joi.string().min(2).max(255).required().messages({
        "string.min": "Street name must contain at least 2 characters",
        "string.max": "Street name cannot exceed 255 characters",
        "any.required": "Street name is required",
    }),

    postal_code: Joi.string().max(10).required().messages({
        "string.max": "Postal code cannot exceed 10 characters",
        "any.required": "Postal code is required",
    }),

    city: Joi.string().min(2).max(100).required().messages({
        "string.min": "City must contain at least 2 characters",
        "string.max": "City cannot exceed 100 characters",
        "any.required": "City is required",
    }),

    country: Joi.string().max(100).optional().messages({
        "string.max": "Country cannot exceed 100 characters",
    }),

    hourly_rate: Joi.number()
        .positive()
        .min(1)
        .max(999.99)
        .precision(2)
        .required()
        .messages({
            "number.positive": "Hourly rate must be positive",
            "number.min": "Hourly rate must be at least 1",
            "number.max": "Hourly rate cannot exceed 999.99",
            "any.required": "Hourly rate is required",
        }),

    phone: Joi.string().max(20).required().messages({
        "string.max": "Phone number cannot exceed 20 characters",
        "any.required": "Phone number is required",
    }),

    email: Joi.string().max(100).required().messages({
        "string.max": "Email cannot exceed 100 characters",
        "any.required": "Email is required",
    }),

    website: Joi.string().uri().max(255).optional().allow("").messages({
        "string.uri": "Website must be a valid URL",
        "string.max": "Website URL cannot exceed 255 characters",
    }),

    equipment_list: Joi.string().max(5000).optional().allow("").messages({
        "string.max": "Equipment list cannot exceed 5000 characters",
    }),

    tags: Joi.string().max(50).optional().allow("").messages({
        "string.max": "Tags cannot exceed 50 characters",
    }),

    images: Joi.string().max(2000).optional().allow("").messages({
        "string.max": "Images URLs cannot exceed 2000 characters",
    }),
});

export const updateStudioSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
        "string.min": "Studio name must contain at least 2 characters",
        "string.max": "Studio name cannot exceed 100 characters",
    }),

    description: Joi.string().min(10).max(2000).optional().messages({
        "string.min": "Description must contain at least 10 characters",
        "string.max": "Description cannot exceed 2000 characters",
    }),

    street_number: Joi.string().max(10).optional().messages({
        "string.max": "Street number cannot exceed 10 characters",
    }),

    street_name: Joi.string().min(2).max(255).optional().messages({
        "string.min": "Street name must contain at least 2 characters",
        "string.max": "Street name cannot exceed 255 characters",
    }),

    postal_code: Joi.string().max(10).optional().messages({
        "string.max": "Postal code cannot exceed 10 characters",
    }),

    city: Joi.string().min(2).max(100).optional().messages({
        "string.min": "City must contain at least 2 characters",
        "string.max": "City cannot exceed 100 characters",
    }),

    country: Joi.string().max(100).optional().messages({
        "string.max": "Country cannot exceed 100 characters",
    }),

    hourly_rate: Joi.number()
        .positive()
        .min(1)
        .max(999.99)
        .precision(2)
        .optional()
        .messages({
            "number.positive": "Hourly rate must be positive",
            "number.max": "Hourly rate cannot exceed 999.99",
        }),

    phone: Joi.string().max(20).optional().messages({
        "string.max": "Phone number cannot exceed 20 characters",
    }),

    email: Joi.string().max(100).optional().messages({
        "string.max": "Email cannot exceed 100 characters",
    }),

    website: Joi.string().uri().max(255).optional().allow("").messages({
        "string.uri": "Website must be a valid URL",
        "string.max": "Website URL cannot exceed 255 characters",
    }),

    equipment_list: Joi.string().max(5000).optional().allow("").messages({
        "string.max": "Equipment list cannot exceed 5000 characters",
    }),

    tags: Joi.string().max(50).optional().allow("").messages({
        "string.max": "Tags cannot exceed 50 characters",
    }),

    images: Joi.string().max(2000).optional().allow("").messages({
        "string.max": "Images URLs cannot exceed 2000 characters",
    }),
});
