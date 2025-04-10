import Joi from "joi";

const userValidator = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    roles: Joi.array().items(Joi.string()).required(),
});

module.exports = userValidator;
