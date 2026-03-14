const Contact = require('../models/Contact');

const getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMessages
};