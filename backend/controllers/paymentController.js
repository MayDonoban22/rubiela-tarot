
const Turno = require("../models/Turno");

const Service = require("../models/Service");

const { randomUUID } = require("crypto");

const {
    createCheckoutSession,
    getCheckoutSession,
    retryCheckoutSession
} = require("../services/stripeService");

const createPaymentSession = async (req, res) => {

    try {

        const { turnoId } = req.params;

        // 1. Buscar la reserva en MongoDB
        const turno = await Turno.findById(turnoId);

        if (!turno) {
            return res.status(404).json({
                message: "Turno no encontrado"
            });
        }

        // 2. Verificar que la reserva pertenezca al usuario
        if (turno.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "No tienes autorización para pagar esta reserva"
            });
        }

        // 3. Verificar que la reserva no esté pagada
        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message: "Esta reserva ya fue pagada"
            });
        }

        // 4. Verificar el estado de la reserva
        if (turno.estado !== "pendiente") {
            return res.status(409).json({
                message: "Esta reserva no está disponible para pago"
            });
        }

        // 5. Verificar el plazo de pago
        if (!turno.paymentExpiresAt) {
            return res.status(409).json({
                message: "Esta reserva no tiene un plazo de pago válido"
            });
        }

        if (new Date(turno.paymentExpiresAt).getTime() <= Date.now()) {
            return res.status(409).json({
                message: "El plazo de pago ha terminado. Debes solicitar una nueva reserva."
            });
        }

        // 6. Detectar un intento de pago interrumpido
        if (turno.paymentAttemptId && !turno.paymentSessionId) {

            console.warn(
                `Intento pendiente de recuperación: ${turno.paymentAttemptId}`
            );

            return res.status(409).json({
                message: "Existe un intento de pago anterior que necesita verificación. Intenta nuevamente más tarde."
            });
        }

        // 7. Recuperar una sesión existente
        if (turno.paymentSessionId) {

            const session = await getCheckoutSession(
                turno.paymentSessionId
            );

            if (
                session.status === "open" &&
                session.expires_at * 1000 > Date.now()
            ) {
                return res.json({
                    url: session.url
                });
            }

            return res.status(409).json({
                message: "La sesión anterior no está disponible. Debemos verificar su estado."
            });
        }

        // 7. Consultar el servicio
        const service = await Service.findById(turno.servicio);

        if (!service || !service.activo) {
            return res.status(409).json({
                message: "El servicio no está disponible"
            });
        }

        // 8. Validar el precio en USD
        const precio = Number(service.precio);
        const amount = Math.round(precio * 100);

        if (
            !Number.isFinite(precio) ||
            precio < 0.50 ||
            Math.abs(precio * 100 - amount) > 0.000001
        ) {
            return res.status(409).json({
                message: "El servicio tiene un precio inválido"
            });
        }

        // 9. Generar un identificador único del intento
        const attemptId = randomUUID();

        // 10. Bloquear el turno y guardar el precio original
        const turnoBloqueado = await Turno.findOneAndUpdate(
            {
                _id: turnoId,
                user: req.user.id,
                estado: "pendiente",
                paymentStatus: "PENDING",
                paymentProcessing: { $ne: true },
                paymentAttemptId: null,
                paymentSessionId: { $exists: false },
                paymentExpiresAt: { $gt: new Date() }
            },
            {
                $set: {
                    paymentProcessing: true,
                    paymentAttemptId: attemptId,

                    paymentAttemptSnapshot: {
                        nombre: service.nombre,
                        duracion: service.duracion,
                        amount: amount,
                        currency: "USD"
                    },

                    paymentCheckoutExpiresAt: new Date(
                        Math.ceil(Date.now() / 1000) * 1000 +
                        31 * 60 * 1000
                    )
                }
            },
            {
                new: true
            }
        );

        if (!turnoBloqueado) {
            return res.status(409).json({
                message: "El pago ya se está preparando o la reserva no está disponible."
            });
        }

        // 11. Crear la sesión de Stripe
        const session = await createCheckoutSession(
            turnoBloqueado,
            service
        );

        // 12. Guardar la información de Stripe en MongoDB
        const turnoActualizado = await Turno.findOneAndUpdate(
            {
                _id: turnoBloqueado._id,
                paymentProcessing: true,
                paymentAttemptId: attemptId,
                paymentStatus: "PENDING",
                estado: "pendiente",
                paymentSessionId: { $exists: false }
            },
            {
                $set: {
                    paymentSessionId: session.id,
                    paymentExpiresAt: new Date(
                        session.expires_at * 1000
                    ),
                    paymentAmount: session.amount_total,
                    paymentCurrency: session.currency.toUpperCase(),
                    paymentProcessing: false
                }
            },
            {
                new: true
            }
        );

        if (!turnoActualizado) {
            console.error(
                "No fue posible registrar la sesión de Stripe:",
                session.id
            );

            return res.status(500).json({
                message: "La sesión de pago requiere verificación."
            });
        }

        // 13. Devolver al frontend la URL de Stripe
        return res.json({
            url: session.url
        });

    } catch (error) {

        console.error(
            "Error creando sesión de pago:",
            error
        );

        return res.status(500).json({
            message: "Error creando sesión de pago"
        });
    }
};

module.exports = {
    createPaymentSession
};
