const joi = require("joi");

// This joi schema is used for validation across the direct requests that does not
// come from the frontend of the page or to handle validations for requests that come
// from tools like hoppscotch or postman..

module.exports.listingSchemaJoi = joi.object({
    listing: joi
        .object({
            title: joi.string().required(),
            description: joi.string().required(),
            image: joi.string().allow(null, ""),
            price: joi.number().required().min(0),
            country: joi.string().required(),
            location: joi.string().required(),
            category: joi.string().required(),
        })
        .required(),
});

module.exports.ratingSchemaJoi = joi.object({
    review: joi
        .object({
            rating: joi.number().required().min(1).max(5),
            comment: joi.string().required(),
        })
        .required(),
});
