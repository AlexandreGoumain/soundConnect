import Joi from "joi";

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
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
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
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    website: Joi.string().uri(),
    tags: Joi.array()
        .items(Joi.string())
        .max(5)
        .message("Vous ne pouvez pas avoir plus de 5 tags")
        .required(),
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
