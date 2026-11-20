
const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({

    // =====================================
    // INFORMACIÓN DE LA RESERVA
    // =====================================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
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
            "pendiente",
            "confirmado",
            "completado",
            "cancelado",
            "reagendado",
            "no_asistio",
            "expirado"
        ],
        default: "pendiente"
    },

    // =====================================
    // ADMINISTRACIÓN DE LA RESERVA
    // =====================================

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

    // =====================================
    // ESTADO GENERAL DEL PAGO
    // =====================================

    paymentStatus: {
        type: String,
        enum: [
            "PENDING",
            "PAID",
            "FAILED"
        ],
        default: "PENDING"
    },

    paymentProvider: {
        type: String,
        enum: ["WOMPI", "STRIPE"],
        default: null
    },

    // Identificar si se prepara un pago
    paymentProcessing: {
        type: Boolean,
        default: false
    },

    // Identificador interno del intento
    paymentAttemptId: {
        type: String,
        default: null
    },

    // =====================================
    // INTEGRACIÓN WOMPI
    // =====================================

    // Referencia única generada por Luz de Rubí
    paymentReference: {
        type: String,
        trim: true
    },

    // Identificador asignado por Wompi
    paymentTransactionId: {
        type: String,
        trim: true
    },

    // Estado original informado por Wompi
    wompiTransactionStatus: {
        type: String,
        enum: [
            "PENDING",
            "APPROVED",
            "DECLINED",
            "VOIDED",
            "ERROR"
        ],
        default: null
    },

    // Entorno en el que se generó el pago
    paymentEnvironment: {
        type: String,
        enum: ["sandbox", "production"],
        default: null
    },

    // =====================================
    // SNAPSHOT DEL INTENTO DE PAGO
    // =====================================

    paymentAttemptSnapshot: {

        nombre: String,

        duracion: Number,

        // Importe en la unidad mínima de la
        // moneda utilizada por la pasarela
        amount: Number,

        currency: {
            type: String,
            enum: ["USD", "COP"],
            default: "USD"
        },

        // Precio original del servicio
        originalAmount: {
            type: Number,
            min: 0
        },

        originalCurrency: {
            type: String,
            enum: ["USD"]
        },

        // Precio convertido a pesos colombianos
        convertedAmount: {
            type: Number,
            min: 0
        },

        convertedCurrency: {
            type: String,
            enum: ["COP"]
        },

        // Tasa utilizada en el intento de pago
        exchangeRate: {
            type: Number,
            min: 0
        },

        exchangeRateSource: {
            type: String
        },

        quotedAt: {
            type: Date
        }
    },

    // =====================================
    // VENCIMIENTOS
    // =====================================

    // Vencimiento del proceso de Checkout
    paymentCheckoutExpiresAt: {
        type: Date,
        default: null
    },

    // Vencimiento de la reserva pendiente
    paymentExpiresAt: {
        type: Date,
        default: null
    },

    // =====================================
    // INFORMACIÓN DEL PAGO VERIFICADO
    // =====================================

    // Importe en centavos
    paymentAmount: {
        type: Number,
        min: 0
    },

    paymentCurrency: {
        type: String,
        enum: ["USD", "COP"],
        default: "USD"
    },

    // Fecha de confirmación del pago
    paidAt: {
        type: Date,
        default: null
    },

    // Última verificación con la pasarela
    paymentVerifiedAt: {
        type: Date,
        default: null
    },

    // =====================================
    // STRIPE - COMPATIBILIDAD TEMPORAL
    // =====================================

    paymentSessionId: {
        type: String
    }

}, {
    timestamps: true
});

// =====================================
// ÍNDICE ÚNICO DE RESERVAS
// =====================================

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

// =====================================
// ÍNDICE ÚNICO DE REFERENCIAS WOMPI
// =====================================

turnoSchema.index(
    { paymentReference: 1 },
    {
        name: "wompi_payment_reference_unique",
        unique: true,
        partialFilterExpression: {
            paymentReference: {
                $type: "string"
            }
        }
    }
);

// =====================================
// ÍNDICE ÚNICO DE TRANSACCIONES WOMPI
// =====================================

turnoSchema.index(
    { paymentTransactionId: 1 },
    {
        name: "wompi_transaction_id_unique",
        unique: true,
        partialFilterExpression: {
            paymentTransactionId: {
                $type: "string"
            }
        }
    }
);

module.exports = mongoose.model("Turno", turnoSchema);
