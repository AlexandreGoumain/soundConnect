import Joi from "joi";

const equipmentCategoryValidator = Joi.object({
    name: Joi.string().min(2).max(100).trim().required().messages({
        "string.empty": "Le nom de la catégorie est requis",
        "string.min": "Le nom doit contenir au moins {#limit} caractères",
        "string.max": "Le nom ne peut pas dépasser {#limit} caractères",
    }),
    description: Joi.string().min(10).max(500).trim().allow("").messages({
        "string.min":
            "La description doit contenir au moins {#limit} caractères",
        "string.max": "La description ne peut pas dépasser {#limit} caractères",
    }),
    isVerified: Joi.boolean().default(false),
    created_by: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.pattern.base":
                "L'identifiant de l'utilisateur doit être un ObjectId valide",
        }),
    created_at: Joi.date().default(Date.now),
});

module.exports = { equipmentCategoryValidator };
