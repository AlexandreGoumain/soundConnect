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

    role_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required()
        .messages({
            "string.guid": "Role ID must be a valid UUID",
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

    schedule: Joi.object().optional().messages({
        "object.base": "Schedule must be an object",
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

// =====================
// RESERVATION VALIDATION SCHEMAS
// =====================

export const createReservationSchema = Joi.object({
    studio_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required()
        .messages({
            "string.guid": "Studio ID must be a valid UUID",
            "any.required": "Studio ID is required",
        }),

    start_datetime: Joi.date().iso().required().messages({
        "date.base": "Start datetime must be a valid date",
        "date.format": "Start datetime must be in ISO format",
        "any.required": "Start datetime is required",
    }),

    end_datetime: Joi.date()
        .iso()
        .greater(Joi.ref("start_datetime"))
        .required()
        .messages({
            "date.base": "End datetime must be a valid date",
            "date.format": "End datetime must be in ISO format",
            "date.greater": "End datetime must be after start datetime",
            "any.required": "End datetime is required",
        }),

    special_requests: Joi.string().max(1000).optional().allow("").messages({
        "string.max": "Special requests cannot exceed 1000 characters",
    }),
});

export const updateReservationSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "confirmed", "cancelled", "completed")
        .optional()
        .messages({
            "any.only":
                "Status must be one of: pending, confirmed, cancelled, completed",
        }),

    special_requests: Joi.string().max(1000).optional().allow("").messages({
        "string.max": "Special requests cannot exceed 1000 characters",
    }),
});

// =====================
// SCHEDULE VALIDATION SCHEMAS
// =====================

export const updateScheduleSchema = Joi.object({
    schedule: Joi.object({
        monday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Monday is_open must be a boolean",
                "any.required": "Monday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Monday open_time must be in HH:MM format",
                        "any.required":
                            "Monday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Monday close_time must be in HH:MM format",
                        "any.required":
                            "Monday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        tuesday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Tuesday is_open must be a boolean",
                "any.required": "Tuesday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Tuesday open_time must be in HH:MM format",
                        "any.required":
                            "Tuesday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Tuesday close_time must be in HH:MM format",
                        "any.required":
                            "Tuesday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        wednesday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Wednesday is_open must be a boolean",
                "any.required": "Wednesday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Wednesday open_time must be in HH:MM format",
                        "any.required":
                            "Wednesday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Wednesday close_time must be in HH:MM format",
                        "any.required":
                            "Wednesday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        thursday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Thursday is_open must be a boolean",
                "any.required": "Thursday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Thursday open_time must be in HH:MM format",
                        "any.required":
                            "Thursday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Thursday close_time must be in HH:MM format",
                        "any.required":
                            "Thursday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        friday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Friday is_open must be a boolean",
                "any.required": "Friday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Friday open_time must be in HH:MM format",
                        "any.required":
                            "Friday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Friday close_time must be in HH:MM format",
                        "any.required":
                            "Friday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        saturday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Saturday is_open must be a boolean",
                "any.required": "Saturday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Saturday open_time must be in HH:MM format",
                        "any.required":
                            "Saturday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Saturday close_time must be in HH:MM format",
                        "any.required":
                            "Saturday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),

        sunday: Joi.object({
            is_open: Joi.boolean().required().messages({
                "boolean.base": "Sunday is_open must be a boolean",
                "any.required": "Sunday is_open is required",
            }),
            open_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Sunday open_time must be in HH:MM format",
                        "any.required":
                            "Sunday open_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
            close_time: Joi.when("is_open", {
                is: true,
                then: Joi.string()
                    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                    .required()
                    .messages({
                        "string.pattern.base":
                            "Sunday close_time must be in HH:MM format",
                        "any.required":
                            "Sunday close_time is required when studio is open",
                    }),
                otherwise: Joi.any().forbidden(),
            }),
        }).optional(),
    })
        .required()
        .messages({
            "object.base": "Schedule must be an object",
            "any.required": "Schedule is required",
        }),
});
