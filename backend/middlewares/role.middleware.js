const AppError = require('../utils/AppError');

const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(new AppError('Acceso denegado', 403));
        }
        next();
    };
};

module.exports = roleMiddleware;