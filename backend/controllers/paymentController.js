
const mongoose = require("mongoose");

const Turno = require("../models/Turno");
const Service = require("../models/Service");

const {
    getWompiConfig,
    generatePaymentReference,
    prepareCheckout
} = require("../services/wompiService");

const {
    convertUsdToCop
} = require("../services/currency.service");

// Preparar los datos públicos del pago
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
        environment: "sandbox",

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

// Preparar una sesión de pago con Wompi
const createPaymentSession = async (req, res) => {

    try {

        const { turnoId } = req.params;

        // 1. Validar identificador de la reserva
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

        // 3. Comprobar propietario de la reserva
        if (String(turno.user) !== String(req.user.id)) {
            return res.status(403).json({
                message:
                    "No tienes autorización para pagar esta reserva."
            });
        }

        // 4. Evitar pagar nuevamente una reserva pagada
        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message: "Esta reserva ya fue pagada."
            });
        }

        // 5. Validar estado actual
        if (
            turno.estado !== "pendiente" ||
            turno.paymentStatus !== "PENDING"
        ) {
            return res.status(409).json({
                message:
                    "La reserva no está disponible para pago."
            });
        }

        // 6. Validar vencimiento de la reserva
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

        // 7. Verificar configuración de Wompi
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

        // 8. Proteger intentos antiguos de Stripe
        if (
            turno.paymentProvider === "STRIPE" ||
            turno.paymentSessionId
        ) {
            return res.status(409).json({
                message:
                    "Existe un pago anterior que requiere verificación."
            });
        }

        // 9. Evitar iniciar otro pago si ya existe
        // una transacción registrada en Wompi
        if (turno.paymentTransactionId) {
            return res.status(409).json({
                message:
                    "Existe una transacción que debe verificarse."
            });
        }

        // 10. Reutilizar un intento de Wompi existente
        if (turno.paymentReference) {

            if (
                turno.paymentProvider !== "WOMPI" ||
                turno.paymentEnvironment !== "sandbox" ||
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

        // 11. Detectar intentos interrumpidos
        if (
            turno.paymentProcessing ||
            turno.paymentAttemptId
        ) {
            return res.status(409).json({
                message:
                    "Existe un intento de pago pendiente de revisión."
            });
        }

        // 12. Obtener servicio desde MongoDB
        const service = await Service.findById(
            turno.servicio
        );

        if (!service || !service.activo) {
            return res.status(409).json({
                message: "El servicio no está disponible."
            });
        }

        // 13. Convertir el precio original de USD a COP
        const conversion = convertUsdToCop(
            service.precio
        );

        // 14. Generar referencia única de Wompi
        const reference = generatePaymentReference();

        // Respetar el vencimiento original de la reserva
        const expirationTime =
            turno.paymentExpiresAt.toISOString();

        // Verificar los parámetros antes de guardar
        prepareCheckout({
            reference,
            amountInCents: conversion.amountInCents,
            expirationTime
        });

        // 15. Guardar el intento de forma atómica
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

                    paymentSessionId: null,

                    paymentExpiresAt: {
                        $eq: turno.paymentExpiresAt,
                        $gt: new Date()
                    }
                },
                {
                    $set: {

                        paymentProvider: "WOMPI",

                        paymentEnvironment: "sandbox",

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

                            currency: "COP",

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
                    "La reserva cambió de estado o ya tiene un intento de pago. Intenta nuevamente."
            });
        }

        // 16. Entregar información pública al frontend
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

module.exports = {
    createPaymentSession
};
