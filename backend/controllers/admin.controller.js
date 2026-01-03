const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');

const createToken = (admin) => {
    return jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const loginAdmin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return next(new AppError('Credenciales inválidas', 401));
        }

        const valid = await admin.comparePassword(password);
        if (!valid) {
            return next(new AppError('Credenciales inválidas', 401));
        }

        const token = createToken(admin);

        res.json({
            message: 'Login admin exitoso',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { loginAdmin };
