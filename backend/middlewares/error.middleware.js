const { isCelebrateError } = require('celebrate');

const errorMiddleware = (err, req, res, next) => {
    // Errores de validación Joi
    if (isCelebrateError(err)) {
        const errorBody = err.details.get('body');
        return res.status(400).json({
            status: 'fail',
            message: errorBody.message
        });
    }

    // Errores personalizados
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        status: err.status || 'error',
        message
    });
};

module.exports = errorMiddleware;
