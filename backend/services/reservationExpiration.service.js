
const Turno = require("../models/Turno");

/**
 * LUZ DE RUBÍ
 * Servicio de vencimiento automático de reservas.
 *
 * Libera únicamente reservas pendientes vencidas
 * que no tengan ningún intento de pago registrado.
 *
 * Compatible con Wompi y registros antiguos de Stripe.
 */

const expireUnpaidReservations = async () => {

    const now = new Date();

    const result = await Turno.updateMany(
        {
            // Solo reservas pendientes de pago
            estado: "pendiente",

            paymentStatus: "PENDING",

            // El plazo de pago ya terminó
            paymentExpiresAt: {
                $type: "date",
                $lte: now
            },

            // No existe un proceso de pago activo
            paymentProcessing: { $ne: true },

            // No existe un proveedor de pago asociado
            paymentProvider: null,

            // No existe un intento interno registrado
            paymentAttemptId: null,

            // WOMPI: sin referencia de pago
            paymentReference: null,

            // WOMPI: sin transacción registrada
            paymentTransactionId: null,

            // WOMPI: sin estado de transacción
            wompiTransactionStatus: null,

            // STRIPE: compatibilidad temporal
            paymentSessionId: null
        },
        {
            $set: {
                estado: "expirado"
            }
        }
    );

    return {
        examinedAt: now,
        expiredCount: result.modifiedCount
    };
};

module.exports = {
    expireUnpaidReservations
};
