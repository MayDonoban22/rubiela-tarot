const { celebrate, Joi, Segments } = require('celebrate');

const schemas = {
    register: {
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }),
    },

    login: {
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
};

const validate = (schema) => {
    return celebrate(schemas[schema]);
};

module.exports = { validate };