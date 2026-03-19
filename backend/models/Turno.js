const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    estado: {

        type: String,

        enum: [

            'pendiente',

            'pagado',

            'cancelado',

            'completado'

        ],

        default: 'pendiente'

    }
}, { timestamps: true });

module.exports = mongoose.model('Turno', turnoSchema);
