const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return next(new AppError('El correo ya está registrado', 400));

        const user = await User.create({ name, email, password });

        const token = createToken(user);

        res.status(201).json({
            message: 'Usuario registrado con éxito',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new AppError('Credenciales incorrectas', 401));

        const valid = await user.comparePassword(password);
        if (!valid) return next(new AppError('Credenciales incorrectas', 401));

        const token = createToken(user);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
