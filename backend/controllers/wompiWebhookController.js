
const Turno = require("../models/Turno");

const {
    verifyWebhookSignature,
    getTransaction
} = require("../services/wompiService");

// Estados reconocidos por Wompi
const WOMPI_STATUSES = [
    "PENDING",
    "APPROVED",
    "DECLINED",
    "VOIDED",
    "ERROR"
];

// =====================================
// WEBHOOK DE WOMPI
// =====================================

const wompiWebhook = async (req, res) => {

    try {

        const event = req.body;

        // 1. Obtener la firma del evento
        const checksum = req.headers["x-event-checksum"];

        // 2. Verificar autenticidad de la notificación
        const validSignature = verifyWebhookSignature(
            event,
            checksum
        );

        if (!validSignature) {
            return res.status(401).json({
                message: "Firma de Wompi inválida."
            });
        }

        // 3. Procesar únicamente eventos de transacciones
        if (event.event !== "transaction.updated") {
            return res.status(200).json({
                received: true,
                ignored: true
            });
        }

        const eventTransaction = event.data?.transaction;

        if (
            !eventTransaction ||
            typeof eventTransaction.id !== "string" ||
            !event.signature.properties.includes("transaction.id")
        ) {
            return res.status(400).json({
                message: "Evento de transacción inválido."
            });
        }

        // 4. Consultar directamente a Wompi.
        // No confiar únicamente en los datos del webhook.
        const transaction = await getTransaction(
            eventTransaction.id
        );

        const {
            id,
            reference,
            status,
            currency,
            amount_in_cents
        } = transaction;

        // 5. Validar datos de la transacción
        if (
            typeof reference !== "string" ||
            typeof id !== "string" ||
            currency !== "COP" ||
            !Number.isSafeInteger(amount_in_cents) ||
            amount_in_cents <= 0 ||
            !WOMPI_STATUSES.includes(status)
        ) {
            console.error(
                "Wompi: datos de transacción inválidos."
            );

            return res.status(409).json({
                message: "La transacción requiere revisión."
            });
        }

        // 6. Buscar la reserva asociada
        const turno = await Turno.findOne({
            paymentReference: reference,
            paymentProvider: "WOMPI",
            paymentEnvironment: "sandbox"
        });

        if (!turno) {

            console.warn(
                "Wompi: referencia sin reserva asociada:",
                reference
            );

            return res.status(200).json({
                received: true,
                ignored: true
            });
        }

        // 7. Verificar el importe original del Checkout
        const snapshot = turno.paymentAttemptSnapshot;

        if (
            !snapshot ||
            snapshot.amount !== amount_in_cents ||
            snapshot.currency !== currency
        ) {

            console.error(
                "Wompi: diferencia en el importe del pago:",
                reference
            );

            return res.status(409).json({
                message:
                    "El importe no coincide con la reserva."
            });
        }

        // 8. Evitar asociar otra transacción a la reserva
        if (
            turno.paymentTransactionId &&
            turno.paymentTransactionId !== id
        ) {

            console.error(
                "Wompi: conflicto de transacciones:",
                reference
            );

            return res.status(409).json({
                message:
                    "La reserva tiene otra transacción asociada."
            });
        }

        // =====================================
        // PAGOS YA CONFIRMADOS
        // =====================================

        if (turno.paymentStatus === "PAID") {

            // Evento repetido de un pago ya procesado
            if (
                turno.paymentTransactionId === id &&
                status === "APPROVED" &&
                turno.paymentAmount === amount_in_cents &&
                turno.paymentCurrency === currency
            ) {
                return res.status(200).json({
                    received: true,
                    alreadyProcessed: true
                });
            }

            // Una anulación posterior requiere conciliación.
            // No liberar automáticamente una reserva pagada.
            console.error(
                "Wompi: pago confirmado requiere revisión:",
                reference,
                status
            );

            return res.status(409).json({
                message:
                    "El pago confirmado requiere revisión administrativa."
            });
        }

        // No confirmar automáticamente reservas cerradas.
        if (
            turno.estado !== "pendiente" ||
            turno.paymentStatus !== "PENDING"
        ) {
            console.error(
                "Wompi: reserva no disponible para confirmación:",
                reference,
                status
            );

            return res.status(409).json({
                message:
                    "El pago requiere conciliación administrativa."
            });
        }

        // Condiciones comunes para actualizaciones atómicas
        const filter = {
            _id: turno._id,

            estado: "pendiente",

            paymentStatus: "PENDING",

            paymentProvider: "WOMPI",

            paymentEnvironment: "sandbox",

            paymentReference: reference,

            "paymentAttemptSnapshot.amount": amount_in_cents,

            "paymentAttemptSnapshot.currency": currency,

            $or: [
                { paymentTransactionId: null },
                { paymentTransactionId: id }
            ]
        };

        // =====================================
        // PAGO APROBADO
        // =====================================

        if (status === "APPROVED") {

            const updated = await Turno.findOneAndUpdate(
                filter,
                {
                    $set: {

                        paymentTransactionId: id,

                        wompiTransactionStatus: "APPROVED",

                        paymentStatus: "PAID",

                        paymentAmount: amount_in_cents,

                        paymentCurrency: currency,

                        paymentProcessing: false,

                        estado: "confirmado",

                        paidAt: new Date(),

                        paymentVerifiedAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updated) {

                // Comprobar si otro evento simultáneo
                // ya confirmó el mismo pago.
                const current = await Turno.findById(
                    turno._id
                );

                if (
                    current?.paymentStatus === "PAID" &&
                    current.paymentTransactionId === id &&
                    current.paymentAmount === amount_in_cents &&
                    current.paymentCurrency === currency
                ) {
                    return res.status(200).json({
                        received: true,
                        alreadyProcessed: true
                    });
                }

                return res.status(409).json({
                    message:
                        "No fue posible confirmar la reserva automáticamente."
                });
            }

            console.log(
                "Wompi: pago aprobado y reserva confirmada:",
                reference
            );

            // El correo de confirmación se incorporará
            // después de verificar esta integración.

            return res.status(200).json({
                received: true,
                confirmed: true
            });
        }

        // =====================================
        // PAGO PENDIENTE
        // =====================================

        if (status === "PENDING") {

            const updated = await Turno.findOneAndUpdate(
                {
                    ...filter,
                    wompiTransactionStatus: {
                        $in: [null, "PENDING"]
                    }
                },
                {
                    $set: {
                        paymentTransactionId: id,
                        wompiTransactionStatus: "PENDING",
                        paymentVerifiedAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updated) {
                return res.status(409).json({
                    message:
                        "La transacción cambió de estado."
                });
            }

            return res.status(200).json({
                received: true,
                pending: true
            });
        }

        // =====================================
        // PAGOS RECHAZADOS, ANULADOS O CON ERROR
        // =====================================

        if (
            ["DECLINED", "VOIDED", "ERROR"].includes(status)
        ) {

            const updated = await Turno.findOneAndUpdate(
                filter,
                {
                    $set: {
                        paymentTransactionId: id,
                        wompiTransactionStatus: status,
                        paymentProcessing: false,
                        paymentVerifiedAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updated) {
                return res.status(409).json({
                    message:
                        "La reserva cambió de estado."
                });
            }

            console.warn(
                "Wompi: transacción requiere conciliación:",
                reference,
                status
            );

            // No liberar todavía el horario.
            // Primero implementaremos la conciliación
            // y las reglas de reintentos de pago.

            return res.status(200).json({
                received: true,
                requiresReconciliation: true
            });
        }

        return res.status(200).json({
            received: true
        });

    } catch (error) {

        if (error.code === 11000) {

            console.error(
                "Wompi: conflicto de identificadores únicos."
            );

            return res.status(409).json({
                message:
                    "Existe un conflicto de transacciones."
            });
        }

        console.error(
            "Error procesando webhook de Wompi:",
            error.message
        );

        return res.status(500).json({
            message:
                "No fue posible procesar el evento de Wompi."
        });
    }
};

module.exports = wompiWebhook;
