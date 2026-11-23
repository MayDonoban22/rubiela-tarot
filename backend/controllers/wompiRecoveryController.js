
const mongoose = require("mongoose");

const Turno = require("../models/Turno");

const {
    getTransaction
} = require("../services/wompiService");

const {
    reconcileVerifiedTransaction
} = require("./paymentController");

// =====================================
// RECUPERAR PAGO DESDE EL CHECKOUT
// =====================================

// Esta función recibe el identificador
// de transacción que Wompi devuelve al
// terminar el Checkout.
//
// IMPORTANTE:
// El identificador no demuestra que
// el pago fue aprobado.
//
// Siempre consultamos directamente
// a Wompi antes de actualizar MongoDB.

const recoverPayment = async (req, res) => {
    try {
        const { turnoId } = req.params;

        const { transactionId } = req.body || {};

        // =====================================
        // 1. VALIDAR IDENTIFICADORES
        // =====================================

        if (!mongoose.isValidObjectId(turnoId)) {
            return res.status(400).json({
                message: "Identificador de reserva inválido."
            });
        }

        if (
            typeof transactionId !== "string" ||
            !/^[A-Za-z0-9_-]{1,255}$/.test(transactionId)
        ) {
            return res.status(400).json({
                message:
                    "Identificador de transacción inválido."
            });
        }

        // =====================================
        // 2. BUSCAR LA RESERVA
        // =====================================

        const turno = await Turno.findById(turnoId);

        if (!turno) {
            return res.status(404).json({
                message: "Reserva no encontrada."
            });
        }

        // =====================================
        // 3. VALIDAR PROPIETARIO
        // =====================================

        if (
            String(turno.user) !==
            String(req.user.id)
        ) {
            return res.status(403).json({
                message: "No autorizado."
            });
        }

        // =====================================
        // 4. VERIFICAR PROVEEDOR
        // =====================================

        if (
            turno.paymentProvider !== "WOMPI" ||
            turno.paymentEnvironment !== "sandbox" ||
            !turno.paymentReference ||
            !turno.paymentAttemptId ||
            turno.paymentAttemptId !==
            turno.paymentReference
        ) {
            return res.status(409).json({
                message:
                    "La reserva no tiene un intento válido de Wompi."
            });
        }

        // =====================================
        // 5. PROTEGER TRANSACCIONES EXISTENTES
        // =====================================

        if (
            turno.paymentTransactionId &&
            turno.paymentTransactionId !==
            transactionId
        ) {
            return res.status(409).json({
                message:
                    "Existe otra transacción asociada a la reserva."
            });
        }

        // =====================================
        // 6. CONSULTAR A WOMPI
        // =====================================

        // La respuesta del navegador no se
        // utiliza para determinar si el pago
        // fue aprobado.

        const transaction = await getTransaction(
            transactionId
        );

        // =====================================
        // 7. VERIFICAR REFERENCIA
        // =====================================

        if (
            transaction.reference !==
            turno.paymentReference
        ) {
            console.warn(
                "Wompi: intento de recuperación con referencia diferente."
            );

            return res.status(409).json({
                message:
                    "La transacción no corresponde a esta reserva."
            });
        }

        // =====================================
        // 8. CONCILIACIÓN CENTRALIZADA
        // =====================================

        // La función compartida también
        // comprueba importe, moneda, estado
        // y condiciones de actualización.

        const result =
            await reconcileVerifiedTransaction(
                turno,
                transaction
            );

        if (result.confirmed) {
            console.log(
                "Wompi: reserva recuperada y confirmada:",
                turno.paymentReference
            );
        }

        // =====================================
        // 9. RESPONDER
        // =====================================

        return res.status(
            result.httpStatus
        ).json(result);

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Conflicto con un identificador de transacción."
            });
        }

        console.error(
            "Error recuperando pago de Wompi:",
            error.message
        );

        return res.status(503).json({
            message:
                "No fue posible verificar el pago en este momento."
        });
    }
};

module.exports = {
    recoverPayment
};
