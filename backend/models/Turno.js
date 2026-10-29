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

    // Indica si se está creando una sesión de pago
    paymentProcessing: {
        type: Boolean,
        default: false
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
    { fecha: 1, hora: 1 },
    {
        name: "fecha_hora_reserva_activa_unique",
        unique: true,
        partialFilterExpression: {
            estado: {
                $in: [
                    "pendiente",
                    "confirmado",
                    "completado",
                    "reagendado",
                    "no_asistio"
                ]
            }
        }
    }
);
module.exports = mongoose.model('Turno', turnoSchema);