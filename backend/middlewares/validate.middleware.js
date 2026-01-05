const { celebrate, Joi, Segments } = require('celebrate');

const schemas = {
    register: {
        [Segments.BODY]: Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    },
    login: {
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    },
    service: {
        [Segments.BODY]: Joi.object({
            nombre: Joi.string().min(3).required(),
            descripcion: Joi.string().min(10).required(),
            precio: Joi.number().positive().required(),
            duracion: Joi.number().positive().required()
        })
    }

};

const validate = (schemaName) => {
    if (!schemas[schemaName]) {
        throw new Error(`Schema ${schemaName} no existe`);
    }
    return celebrate(schemas[schemaName]);
};

module.exports = { validate };
