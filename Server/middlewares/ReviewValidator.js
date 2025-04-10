const Joi = require("joi");

const reviewValidator = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
});

module.exports = { reviewValidator };
