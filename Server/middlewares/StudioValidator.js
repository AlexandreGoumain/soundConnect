const Joi = require("joi");

const tldsAllowed = [
    "com",
    "net",
    "fr",
    "eu",
    "org",
    "info",
    "biz",
    "pro",
    "name",
    "co",
    "be",
    "ca",
    "ch",
    "de",
    "es",
    "it",
    "nl",
    "pl",
    "pt",
    "ro",
    "ru",
    "se",
    "tr",
    "ua",
    "vn",
    "io",
    "au",
    "nz",
    "in",
    "mx",
    "ar",
    "br",
];

const createDayHoursSchema = () => {
    return Joi.object({
        is_open: Joi.boolean().default(false),
        open: Joi.object({
            hour: Joi.number().min(0).max(23).allow(null),
            minute: Joi.number().min(0).max(59).allow(null),
        }).allow(null),
        close: Joi.object({
            hour: Joi.number().min(0).max(23).allow(null),
            minute: Joi.number().min(0).max(59).allow(null),
        }).allow(null),
    });
};

const studioValidator = Joi.object({
    owner_id: Joi.string().required(),
    name: Joi.string().max(50).required(),
    description: Joi.string().max(1000).required(),
    address: Joi.string().max(250).required(),
    city: Joi.string().max(100).required(),
    hourly_rate: Joi.number().required(),
    phone: Joi.string()
        .pattern(/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/)
        .message(
            "Le numéro de téléphone doit être au format français (ex: 0612345678 ou +33612345678)"
        )
        .required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: tldsAllowed,
            },
        })
        .required(),
    website: Joi.string().uri(),
    tags: Joi.array()
        .items(Joi.string())
        .min(0)
        .max(5)
        .message("Vous ne pouvez pas avoir plus de 5 tags")
        .optional()
        .default([]),
    operating_hours: Joi.object({
        monday: createDayHoursSchema(),
        tuesday: createDayHoursSchema(),
        wednesday: createDayHoursSchema(),
        thursday: createDayHoursSchema(),
        friday: createDayHoursSchema(),
        saturday: createDayHoursSchema(),
        sunday: createDayHoursSchema(),
    }),
});

module.exports = { studioValidator };
