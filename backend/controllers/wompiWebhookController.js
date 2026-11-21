
const {
    verifyWebhookSignature,
    getTransaction
} = require("../services/wompiService");

const {
    reconcileVerifiedTransaction
} = require("./paymentController");

const Turno = require("../models/Turno");

// =====================================
// WOMPI WEBHOOK CONTROLLER
// =====================================

const wompiWebhook = async (req, res) => {

    try {

        // =====================================
        // 1. RECIBIR EVENTO
        // =====================================

        const event = req.body;

        const checksum =
            req.headers["x-event-checksum"];

        // =====================================
        // 2. VALIDAR FIRMA DEL EVENTO
        // =====================================

        const validSignature =
            verifyWebhookSignature(
                event,
                checksum
            );

        if (!validSignature) {

            console.warn(
                "Wompi: notificación con firma inválida."
            );

            return res.status(401).json({
                message:
                    "No se pudo verificar la autenticidad del evento."
            });
        }

        // =====================================
        // 3. VERIFICAR TIPO DE EVENTO
        // =====================================

        if (event.event !== "transaction.updated") {

            return res.status(200).json({
                received: true,
                ignored: true
            });
        }

        // =====================================
        // 4. EXTRAER IDENTIFICADOR
        // =====================================

        const transactionId =
            event.data?.transaction?.id;

        if (
            typeof transactionId !== "string" ||
            !/^[A-Za-z0-9_-]+$/.test(transactionId)
        ) {

            return res.status(400).json({
                message:
                    "El evento no contiene una transacción válida."
            });
        }

        // =====================================
        // 5. CONSULTAR DIRECTAMENTE A WOMPI
        // =====================================

        // Nunca confirmar una reserva utilizando
        // únicamente la información recibida
        // en la notificación.

        const transaction = await getTransaction(
            transactionId
        );

        // =====================================
        // 6. LOCALIZAR RESERVA EN MONGODB
        // =====================================

        const reference = transaction.reference;

        if (
            typeof reference !== "string" ||
            reference.length === 0
        ) {

            console.error(
                "Wompi: transacción sin referencia válida."
            );

            return res.status(409).json({
                message:
                    "La transacción requiere revisión."
            });
        }

        const turno = await Turno.findOne({
            paymentReference: reference,
            paymentProvider: "WOMPI",
            paymentEnvironment: "sandbox"
        });

        if (!turno) {

            console.warn(
                "Wompi: no se encontró una reserva para la referencia:",
                reference
            );

            // Reconocemos el evento, pero no
            // modificamos ninguna reserva.

            return res.status(200).json({
                received: true,
                ignored: true
            });
        }

        // =====================================
        // 7. EVITAR CONFLICTOS DE TRANSACCIONES
        // =====================================

        if (
            turno.paymentTransactionId &&
            turno.paymentTransactionId !== transaction.id
        ) {

            console.error(
                "Wompi: conflicto de transacciones para:",
                reference
            );

            return res.status(409).json({
                message:
                    "La reserva tiene otra transacción asociada."
            });
        }

        // =====================================
        // 8. CONCILIACIÓN CENTRALIZADA
        // =====================================

        // Esta función también es utilizada
        // por paymentController.js.
        //
        // Valida referencia, importe, moneda,
        // estado y condiciones de actualización.
        //
        // Los cambios se aplican mediante
        // operaciones atómicas en MongoDB.

        const result =
            await reconcileVerifiedTransaction(
                turno,
                transaction
            );

        // =====================================
        // 9. REGISTRAR RESULTADO
        // =====================================

        if (result.confirmed) {

            console.log(
                "Wompi: pago aprobado y reserva confirmada:",
                reference
            );
        }

        if (result.alreadyProcessed) {

            console.log(
                "Wompi: evento duplicado procesado:",
                reference
            );
        }

        if (result.requiresReconciliation) {

            console.warn(
                "Wompi: transacción pendiente de revisión:",
                reference,
                transaction.status
            );
        }

        // =====================================
        // 10. RESPONDER A WOMPI
        // =====================================

        if (result.httpStatus !== 200) {

            console.error(
                "Wompi: conciliación no completada:",
                reference,
                result.message
            );

            return res.status(
                result.httpStatus
            ).json({
                received: true,
                reconciled: false
            });
        }

        return res.status(200).json({
            received: true,
            reconciled: true
        });

    } catch (error) {

        if (error.code === 11000) {

            console.error(
                "Wompi: conflicto de identificadores únicos."
            );

            return res.status(409).json({
                received: true,
                reconciled: false
            });
        }

        console.error(
            "Error en webhook de Wompi:",
            error.message
        );

        return res.status(500).json({
            message:
                "No fue posible procesar el evento."
        });
    }
};

module.exports = wompiWebhook;
