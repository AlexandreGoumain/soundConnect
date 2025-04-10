const Joi = require("joi");

const roleValidator = Joi.object({
    name: Joi.string().min(3).max(50).trim().required().messages({
        "string.empty": "Le nom du rôle est requis",
        "string.min":
            "Le nom du rôle doit contenir au moins {#limit} caractères",
        "string.max": "Le nom du rôle ne peut pas dépasser {#limit} caractères",
    }),
    description: Joi.string().min(10).max(200).trim().allow("").messages({
        "string.min":
            "La description doit contenir au moins {#limit} caractères",
        "string.max": "La description ne peut pas dépasser {#limit} caractères",
    }),
});

module.exports = { roleValidator };
