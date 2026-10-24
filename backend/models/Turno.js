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
            'no_asistio',
            'expirado'
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
    },

    paymentStatus: {

        type: String,

        enum: [

            "PENDING",
            "PAID",
            "FAILED"

        ],

        default: "PENDING"

    },

    paymentSessionId: {

        type: String

    },

    paymentExpiresAt: {
        type: Date,
        default: null
    },


    paymentAmount: {

        type: Number

    },

    paymentCurrency: {

        type: String,

        default: "USD"

    }

}, { timestamps: true });

turnoSchema.index(
    {
        fecha: 1,
        hora: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            estado: {
                $in: [
                    'pendiente',
                    'confirmado',
                    'completado',
                    'reagendado',
                    'no_asistio'
                ]
            }
        }
    }
);

module.exports = mongoose.model('Turno', turnoSchema);