class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // llama al constructor de Error y guarda el mensaje
        this.statusCode = statusCode; // por ejemplo: 400, 401, 404, 500
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // categoriza tipo de error
        this.isOperational = true; // marca el error como controlado

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;