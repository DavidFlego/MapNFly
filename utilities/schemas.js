
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Basic - Prevent HTML/SCRIPT as input
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.sessionSchema = Joi.object({
    session: Joi.object({
        title: Joi.string().required().escapeHTML(),
        user: Joi.string().allow('').escapeHTML(), // not required
        duration: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().allow('').escapeHTML(), // not required
        rating: Joi.number().required(),
        // image: Joi.any().allow(''), // not required
    }).required()
});
