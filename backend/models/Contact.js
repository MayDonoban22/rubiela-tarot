const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['nuevo', 'respondido'],
        default: 'nuevo'
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);