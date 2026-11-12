
const Turno = require("../models/Turno");

/**
 * Expirar reservas pendientes sin intentos de pago.
 *
 * IMPORTANTE:
 * - No modifica reservas pagadas.
 * - No modifica reservas con intentos de pago.
 * - No modifica reservas confirmadas.
 * - No elimina documentos de MongoDB.
 */
const expireUnpaidReservations = async () => {
    const now = new Date();

    const result = await Turno.updateMany(
        {
            estado: "pendiente",
            paymentStatus: "PENDING",

            // El plazo de pago ya terminó
            paymentExpiresAt: {
                $type: "date",
                $lte: now
            },

            // No existe un proceso de cobro activo
            paymentProcessing: { $ne: true },

            // No existe un intento registrado
            paymentAttemptId: null,

            // No existe una sesión registrada
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
