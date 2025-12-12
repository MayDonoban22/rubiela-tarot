const { isCelebrateError } = require('celebrate');
const AppError = require('../utils/AppError');

const errorMiddleware = (err, req, res, next) => {

    // Errores de Celebrate (validaciones)
    if (isCelebrateError(err)) {
        const message = err.details.get('body')?.message || 'Datos inválidos';
        return res.status(400).json({ status: 'fail', message });
    }

    // Errores operacionales
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    console.error('❌ ERROR NO CONTROLADO:', err);

    // Error 500
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};

module.exports = errorMiddleware;
