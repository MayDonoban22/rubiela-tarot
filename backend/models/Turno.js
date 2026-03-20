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
        type: Date,
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
            'confirmado',
            'completado',
            'cancelado',
            'reagendado',
            'no_asistio'
        ],
        default: 'pendiente'
    },

    notasAdmin: {
        type: String
    },

    motivoCancelacion: {
        type: String
    },

    reagendadoPara: {
        fecha: Date,
        hora: String
    }

}, { timestamps: true });

turnoSchema.index({

    fecha: 1,
    hora: 1

});

module.exports = mongoose.model('Turno', turnoSchema);