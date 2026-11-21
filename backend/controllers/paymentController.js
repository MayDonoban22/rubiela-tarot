
const mongoose = require("mongoose");

const Turno = require("../models/Turno");
const Service = require("../models/Service");

const {
    getWompiConfig,
    generatePaymentReference,
    prepareCheckout,
    getTransaction
} = require("../services/wompiService");

const {
    convertUsdToCop
} = require("../services/currency.service");

// =====================================
// CONFIGURACIÓN
// =====================================

const WOMPI_CURRENCY = "COP";
const WOMPI_ENVIRONMENT = "sandbox";

const TERMINAL_STATUSES = [
    "DECLINED",
    "VOIDED",
    "ERROR"
];

// =====================================
// RESPUESTA PÚBLICA DEL CHECKOUT
// =====================================

const buildPaymentResponse = (turno) => {

    const snapshot = turno.paymentAttemptSnapshot;

    const checkout = prepareCheckout({
        reference: turno.paymentReference,
        amountInCents: snapshot.amount,
        expirationTime:
            turno.paymentCheckoutExpiresAt.toISOString()
    });

    return {
        turnoId: turno._id,
        provider: "WOMPI",
        environment: WOMPI_ENVIRONMENT,

        checkout,

        pricing: {
            originalAmount: snapshot.originalAmount,
            originalCurrency: snapshot.originalCurrency,
            convertedAmount: snapshot.convertedAmount,
            convertedCurrency: snapshot.convertedCurrency,
            exchangeRate: snapshot.exchangeRate,
            quotedAt: snapshot.quotedAt
        },

        paymentStatus: turno.paymentStatus,
        expiresAt: turno.paymentExpiresAt
    };
};

// =====================================
// VALIDAR UNA TRANSACCIÓN CONSULTADA
// DIRECTAMENTE EN WOMPI
// =====================================

const validateTransaction = (turno, transaction) => {

    if (
        !transaction ||
        typeof transaction.id !== "string" ||
        transaction.id.length === 0
    ) {
        return "Identificador de transacción inválido.";
    }

    if (
        turno.paymentProvider !== "WOMPI" ||
        turno.paymentEnvironment !== WOMPI_ENVIRONMENT
    ) {
        return "El proveedor de pago no coincide.";
    }

    if (
        !turno.paymentReference ||
        !turno.paymentAttemptId ||
        turno.paymentAttemptId !== turno.paymentReference
    ) {
        return "El intento de pago requiere revisión.";
    }

    if (
        transaction.reference !== turno.paymentReference
    ) {
        return "La referencia del pago no coincide.";
    }

    const snapshot = turno.paymentAttemptSnapshot;

    if (
        !snapshot ||
        snapshot.currency !== WOMPI_CURRENCY ||
        !Number.isSafeInteger(snapshot.amount) ||
        snapshot.amount <= 0
    ) {
        return "Los datos originales del pago son inválidos.";
    }

    if (
        transaction.currency !== snapshot.currency ||
        transaction.amount_in_cents !== snapshot.amount
    ) {
        return "El importe o la moneda no coinciden.";
    }

    if (
        turno.paymentTransactionId &&
        turno.paymentTransactionId !== transaction.id
    ) {
        return "Existe otra transacción asociada a esta reserva.";
    }

    const allowedStatuses = [
        "PENDING",
        "APPROVED",
        ...TERMINAL_STATUSES
    ];

    if (!allowedStatuses.includes(transaction.status)) {
        return "Estado de transacción no reconocido.";
    }

    return null;
};

// =====================================
// CONCILIAR UNA TRANSACCIÓN VERIFICADA
//
// Esta función podrá reutilizarse después
// desde el webhook de Wompi.
//
// IMPORTANTE:
// La transacción debe provenir de
// getTransaction(), nunca del navegador.
// =====================================

const reconcileVerifiedTransaction = async (
    turno,
    transaction
) => {

    const validationError = validateTransaction(
        turno,
        transaction
    );

    if (validationError) {
        return {
            httpStatus: 409,
            message: validationError
        };
    }

    const transactionId = transaction.id;
    const transactionStatus = transaction.status;

    // =====================================
    // RESERVA YA PAGADA
    // =====================================

    if (turno.paymentStatus === "PAID") {

        if (
            transactionStatus === "APPROVED" &&
            turno.paymentTransactionId === transactionId &&
            turno.paymentAmount ===
            transaction.amount_in_cents &&
            turno.paymentCurrency === transaction.currency
        ) {
            return {
                httpStatus: 200,
                message: "El pago ya estaba confirmado.",
                paymentStatus: "PAID",
                estado: turno.estado,
                alreadyProcessed: true
            };
        }

        return {
            httpStatus: 409,
            message:
                "El pago confirmado requiere revisión administrativa."
        };
    }

    // =====================================
    // PROTEGER RESERVAS CERRADAS
    // =====================================

    if (
        turno.estado !== "pendiente" ||
        turno.paymentStatus !== "PENDING"
    ) {
        return {
            httpStatus: 409,
            message:
                "La reserva no puede actualizarse automáticamente."
        };
    }

    // No reemplazar automáticamente un estado
    // terminal por otro resultado diferente.
    if (
        TERMINAL_STATUSES.includes(
            turno.wompiTransactionStatus
        ) &&
        turno.wompiTransactionStatus !== transactionStatus
    ) {
        return {
            httpStatus: 409,
            message:
                "La transacción cambió después de un resultado terminal y requiere revisión."
        };
    }

    // =====================================
    // FILTRO ATÓMICO COMÚN
    // =====================================

    const filter = {

        _id: turno._id,

        estado: "pendiente",

        paymentStatus: "PENDING",

        paymentProvider: "WOMPI",

        paymentEnvironment: WOMPI_ENVIRONMENT,

        paymentAttemptId: turno.paymentReference,

        paymentReference: turno.paymentReference,

        "paymentAttemptSnapshot.amount":
            transaction.amount_in_cents,

        "paymentAttemptSnapshot.currency":
            transaction.currency,

        paymentTransactionId: {
            $in: [null, transactionId]
        }
    };

    // =====================================
    // PAGO APROBADO
    // =====================================

    if (transactionStatus === "APPROVED") {

        const now = new Date();

        const updated = await Turno.findOneAndUpdate(
            {
                ...filter,

                wompiTransactionStatus: {
                    $in: [null, "PENDING", "APPROVED"]
                }
            },
            {
                $set: {
                    paymentTransactionId: transactionId,

                    wompiTransactionStatus: "APPROVED",

                    paymentStatus: "PAID",

                    paymentAmount:
                        transaction.amount_in_cents,

                    paymentCurrency:
                        transaction.currency,

                    paymentProcessing: false,

                    estado: "confirmado",

                    paidAt: now,

                    paymentVerifiedAt: now
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updated) {

            // Puede que otro proceso haya confirmado
            // la misma transacción simultáneamente.
            const current = await Turno.findById(
                turno._id
            );

            if (
                current?.paymentStatus === "PAID" &&
                current.paymentTransactionId ===
                transactionId &&
                current.paymentAmount ===
                transaction.amount_in_cents &&
                current.paymentCurrency ===
                transaction.currency
            ) {
                return {
                    httpStatus: 200,
                    message:
                        "El pago ya estaba confirmado.",
                    paymentStatus: "PAID",
                    estado: current.estado,
                    alreadyProcessed: true
                };
            }

            return {
                httpStatus: 409,
                message:
                    "La reserva cambió de estado durante la verificación."
            };
        }

        console.log(
            "Wompi: reserva confirmada:",
            turno.paymentReference
        );

        return {
            httpStatus: 200,
            message: "Pago verificado y reserva confirmada.",
            paymentStatus: "PAID",
            estado: updated.estado,
            confirmed: true
        };
    }

    // =====================================
    // PAGO TODAVÍA PENDIENTE
    // =====================================

    if (transactionStatus === "PENDING") {

        const updated = await Turno.findOneAndUpdate(
            {
                ...filter,

                wompiTransactionStatus: {
                    $in: [null, "PENDING"]
                }
            },
            {
                $set: {
                    paymentTransactionId: transactionId,

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
            return {
                httpStatus: 409,
                message:
                    "La transacción cambió de estado durante la verificación."
            };
        }

        return {
            httpStatus: 200,
            message: "El pago continúa pendiente.",
            paymentStatus: "PENDING",
            estado: updated.estado
        };
    }

    // =====================================
    // RECHAZADO, ANULADO O ERROR
    // =====================================

    if (
        TERMINAL_STATUSES.includes(
            transactionStatus
        )
    ) {

        const updated = await Turno.findOneAndUpdate(
            {
                ...filter,

                wompiTransactionStatus: {
                    $in: [
                        null,
                        "PENDING",
                        transactionStatus
                    ]
                }
            },
            {
                $set: {
                    paymentTransactionId: transactionId,

                    wompiTransactionStatus:
                        transactionStatus,

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
            return {
                httpStatus: 409,
                message:
                    "La transacción cambió durante la conciliación."
            };
        }

        console.warn(
            "Wompi: transacción no aprobada:",
            turno.paymentReference,
            transactionStatus
        );

        // El horario continúa protegido.
        // No liberar hasta implementar una
        // política segura para estos resultados.

        return {
            httpStatus: 200,
            message:
                "Resultado registrado. La reserva requiere conciliación antes de liberar el horario.",
            paymentStatus: updated.paymentStatus,
            transactionStatus,
            estado: updated.estado,
            requiresReconciliation: true
        };
    }

    return {
        httpStatus: 409,
        message: "Estado de transacción no admitido."
    };
};

// =====================================
// CREAR SESIÓN DE PAGO CON WOMPI
// =====================================

const createPaymentSession = async (req, res) => {

    try {

        const { turnoId } = req.params;

        // 1. Validar identificador
        if (!mongoose.isValidObjectId(turnoId)) {
            return res.status(400).json({
                message: "Identificador de reserva inválido."
            });
        }

        // 2. Buscar reserva
        const turno = await Turno.findById(turnoId);

        if (!turno) {
            return res.status(404).json({
                message: "Reserva no encontrada."
            });
        }

        // 3. Verificar propietario
        if (String(turno.user) !== String(req.user.id)) {
            return res.status(403).json({
                message:
                    "No tienes autorización para pagar esta reserva."
            });
        }

        // 4. Evitar pagos duplicados
        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message: "Esta reserva ya fue pagada."
            });
        }

        // 5. Validar estado
        if (
            turno.estado !== "pendiente" ||
            turno.paymentStatus !== "PENDING"
        ) {
            return res.status(409).json({
                message:
                    "La reserva no está disponible para pago."
            });
        }

        // 6. Validar vencimiento
        if (
            !turno.paymentExpiresAt ||
            !Number.isFinite(
                turno.paymentExpiresAt.getTime()
            ) ||
            turno.paymentExpiresAt.getTime() <= Date.now()
        ) {
            return res.status(409).json({
                message:
                    "El plazo de pago terminó. Debes solicitar una nueva reserva."
            });
        }

        // 7. Verificar Wompi Sandbox
        try {
            getWompiConfig();
        } catch (error) {

            console.warn(
                "Wompi Sandbox no está configurado."
            );

            return res.status(503).json({
                message:
                    "El sistema de pagos todavía no está disponible."
            });
        }

        // 8. Proteger intentos anteriores de Stripe
        if (
            turno.paymentProvider === "STRIPE" ||
            turno.paymentSessionId
        ) {
            return res.status(409).json({
                message:
                    "Existe un pago anterior que requiere verificación."
            });
        }

        // 9. No crear un nuevo intento si existe
        // alguna transacción registrada.
        if (
            turno.paymentTransactionId ||
            turno.wompiTransactionStatus
        ) {
            return res.status(409).json({
                message:
                    "Existe una transacción que requiere verificación."
            });
        }

        // 10. Reutilizar un Checkout vigente
        if (turno.paymentReference) {

            if (
                turno.paymentProvider !== "WOMPI" ||
                turno.paymentEnvironment !==
                WOMPI_ENVIRONMENT ||
                turno.paymentAttemptId !==
                turno.paymentReference ||
                turno.paymentProcessing ||
                !turno.paymentAttemptSnapshot ||
                !turno.paymentCheckoutExpiresAt ||
                turno.paymentCheckoutExpiresAt.getTime()
                <= Date.now()
            ) {
                return res.status(409).json({
                    message:
                        "El intento anterior requiere verificación."
                });
            }

            return res.json(
                buildPaymentResponse(turno)
            );
        }

        // 11. Proteger intentos interrumpidos
        if (
            turno.paymentProvider ||
            turno.paymentProcessing ||
            turno.paymentAttemptId
        ) {
            return res.status(409).json({
                message:
                    "Existe un intento de pago pendiente de revisión."
            });
        }

        // 12. Obtener servicio
        const service = await Service.findById(
            turno.servicio
        );

        if (!service || !service.activo) {
            return res.status(409).json({
                message: "El servicio no está disponible."
            });
        }

        // 13. Convertir USD a COP
        const conversion = convertUsdToCop(
            service.precio
        );

        // 14. Crear referencia
        const reference = generatePaymentReference();

        const expirationTime =
            turno.paymentExpiresAt.toISOString();

        // Comprobar firma y datos de Checkout
        prepareCheckout({
            reference,
            amountInCents: conversion.amountInCents,
            expirationTime
        });

        // 15. Guardar intento atómicamente
        const turnoActualizado =
            await Turno.findOneAndUpdate(
                {
                    _id: turnoId,

                    user: req.user.id,

                    estado: "pendiente",

                    paymentStatus: "PENDING",

                    paymentProvider: null,

                    paymentProcessing: { $ne: true },

                    paymentAttemptId: null,

                    paymentReference: null,

                    paymentTransactionId: null,

                    wompiTransactionStatus: null,

                    paymentSessionId: null,

                    paymentExpiresAt: {
                        $eq: turno.paymentExpiresAt,
                        $gt: new Date()
                    }
                },
                {
                    $set: {

                        paymentProvider: "WOMPI",

                        paymentEnvironment:
                            WOMPI_ENVIRONMENT,

                        paymentAttemptId: reference,

                        paymentReference: reference,

                        paymentProcessing: false,

                        paymentCheckoutExpiresAt:
                            turno.paymentExpiresAt,

                        paymentAttemptSnapshot: {

                            nombre: service.nombre,

                            duracion: service.duracion,

                            amount:
                                conversion.amountInCents,

                            currency: WOMPI_CURRENCY,

                            originalAmount:
                                conversion.originalAmount,

                            originalCurrency:
                                conversion.originalCurrency,

                            convertedAmount:
                                conversion.convertedAmount,

                            convertedCurrency:
                                conversion.convertedCurrency,

                            exchangeRate:
                                conversion.exchangeRate,

                            exchangeRateSource:
                                conversion.exchangeRateSource,

                            quotedAt:
                                new Date(conversion.quotedAt)
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!turnoActualizado) {
            return res.status(409).json({
                message:
                    "La reserva cambió de estado o ya tiene un intento de pago."
            });
        }

        // 16. Responder al frontend
        return res.status(200).json(
            buildPaymentResponse(turnoActualizado)
        );

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Existe un conflicto con la referencia de pago."
            });
        }

        console.error(
            "Error preparando el pago de Wompi:",
            error.message
        );

        return res.status(500).json({
            message:
                "No fue posible preparar el pago."
        });
    }
};

// =====================================
// CONSULTAR Y CONCILIAR PAGO EXISTENTE
// =====================================

const reconcilePayment = async (req, res) => {

    try {

        const { turnoId } = req.params;

        if (!mongoose.isValidObjectId(turnoId)) {
            return res.status(400).json({
                message: "Identificador de reserva inválido."
            });
        }

        const turno = await Turno.findById(turnoId);

        if (!turno) {
            return res.status(404).json({
                message: "Reserva no encontrada."
            });
        }

        // Únicamente el propietario puede consultar
        // el resultado de su reserva.
        if (String(turno.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: "No autorizado."
            });
        }

        if (
            turno.paymentProvider !== "WOMPI" ||
            turno.paymentEnvironment !==
            WOMPI_ENVIRONMENT
        ) {
            return res.status(409).json({
                message:
                    "Esta reserva no tiene un pago de Wompi para verificar."
            });
        }

        // Sin identificador real no podemos consultar
        // una transacción concreta de forma segura.
        if (!turno.paymentTransactionId) {
            return res.status(409).json({
                message:
                    "Todavía no hay una transacción identificada. Espera la notificación de Wompi.",
                reconciliationPending: true
            });
        }

        // Consultar la API oficial de Wompi.
        // Nunca confiar en un estado enviado por React.
        const transaction = await getTransaction(
            turno.paymentTransactionId
        );

        const result = await reconcileVerifiedTransaction(
            turno,
            transaction
        );

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
            "Error conciliando pago Wompi:",
            error.message
        );

        return res.status(503).json({
            message:
                "No fue posible consultar Wompi en este momento. Intenta nuevamente."
        });
    }
};

module.exports = {
    createPaymentSession,
    reconcilePayment,
    reconcileVerifiedTransaction
};
