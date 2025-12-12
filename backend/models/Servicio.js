const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    duracion: {
        type: Number, // en minutos
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Servicio', servicioSchema);
