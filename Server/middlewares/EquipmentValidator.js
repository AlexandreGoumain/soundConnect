import Joi from "joi";

const equipmentValidator = Joi.object({
    name: Joi.string().min(2).max(100).trim().required().message({
        "string.empty": "Le nom de l'équipement est requis",
        "string.min": "Le nom doit contenir au moins {#limit} caractères",
        "string.max": "Le nom ne peut pas dépasser {#limit} caractères",
    }),
    description: Joi.string().min(10).max(1000).trim().required().message({
        "string.empty": "La description est requise",
        "string.min":
            "La description doit contenir au moins {#limit} caractères",
        "string.max": "La description ne peut pas dépasser {#limit} caractères",
    }),
    category_id: Joi.string().required().message({
        "string.empty":
            "L'équipement doit obligatoirement appartenir à une catégorie",
    }),
    brand: Joi.string().trim().max(100).required().message({
        "string.empty": "La marque est requise",
        "string.max": "La marque ne peut pas dépasser {#limit} caractères",
    }),
});

module.exports = { equipmentValidator };
