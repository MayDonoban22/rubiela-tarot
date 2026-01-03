const User = require('../models/User.model');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile };