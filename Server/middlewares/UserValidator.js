const Joi = require("joi");

const userCreateValidator = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    password: Joi.string().min(8).max(30).required(),
    roles: Joi.array()
        .items(
            Joi.alternatives().try(
                Joi.string(),
                Joi.object() // Pour accepter les ObjectId de MongoDB
            )
        )
        .required(),
});

const userUpdateValidator = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    roles: Joi.array()
        .items(
            Joi.alternatives().try(
                Joi.string(),
                Joi.object() // Pour accepter les ObjectId de MongoDB
            )
        )
        .required(),
});

const passwordUpdateValidator = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(30).required(),
});

module.exports = {
    userCreateValidator,
    userUpdateValidator,
    passwordUpdateValidator,
};
