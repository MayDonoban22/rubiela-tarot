const Turno = require("../models/Turno");

const Service = require("../models/Service");

const {
    createCheckoutSession,
    getCheckoutSession
} = require("../services/stripeService");

const createPaymentSession = async (req, res) => {

    try {

        const { turnoId } = req.params;

        const turno = await Turno.findById(turnoId);

        if (!turno) {

            return res.status(404).json({

                message: "Turno no encontrado"

            });

        }

        // Verificar que la reserva pertenece al usuario autenticado
        if (turno.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "No tienes autorización para pagar esta reserva"
            });
        }

        // Verificar si la reserva ya fue pagada
        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message: "Esta reserva ya fue pagada"
            });
        }

        // Verificar que la reserva siga pendiente
        if (turno.estado !== "pendiente") {
            return res.status(409).json({
                message: "Esta reserva no está disponible para pago"
            });
        }

        // Comprobar que la reserva tiene un plazo de pago
        if (!turno.paymentExpiresAt) {
            return res.status(409).json({
                message: "Esta reserva no tiene un plazo de pago válido"
            });
        }

        // Comprobar si terminó el plazo
        if (new Date(turno.paymentExpiresAt).getTime() <= Date.now()) {
            return res.status(409).json({
                message: "El plazo de pago ha terminado. Debes solicitar una nueva reserva."
            });
        }

        if (turno.paymentSessionId) {

            const session = await getCheckoutSession(
                turno.paymentSessionId
            );

            // Recuperar una sesión abierta y vigente
            if (
                session.status === "open" &&
                session.expires_at * 1000 > Date.now()
            ) {
                return res.json({
                    url: session.url
                });
            }

            // No generar otro cobro hasta resolver el estado anterior
            return res.status(409).json({
                message: "La sesión de pago anterior ya no está disponible. Debemos verificar su estado antes de continuar."
            });
        }

        // Bloquear la reserva mientras se prepara el pago
        const turnoBloqueado = await Turno.findOneAndUpdate(
            {
                _id: turnoId,
                user: req.user.id,
                estado: "pendiente",
                paymentStatus: "PENDING",
                paymentProcessing: false,
                paymentSessionId: { $exists: false },
                paymentExpiresAt: { $gt: new Date() }
            },
            {
                $set: {
                    paymentProcessing: true,
                    paymentCheckoutExpiresAt: new Date(
                        Math.ceil(Date.now() / 1000) * 1000 + 31 * 60 * 1000
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

        // Utilizar la reserva que obtuvo el bloqueo
        const service = await Service.findById(turnoBloqueado.servicio);

        if (!service || !service.activo) {
            return res.status(409).json({
                message: "El servicio ya no está disponible. Requiere revisión."
            });
        }

        const session = await createCheckoutSession(
            turnoBloqueado,
            service
        );

        // Guardar los datos de Stripe únicamente si conservamos el bloqueo
        const turnoActualizado = await Turno.findOneAndUpdate(
            {
                _id: turnoBloqueado._id,
                paymentProcessing: true,
                paymentStatus: "PENDING",
                estado: "pendiente",
                paymentSessionId: { $exists: false }
            },
            {
                $set: {
                    paymentSessionId: session.id,
                    paymentExpiresAt: new Date(session.expires_at * 1000),
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

        res.json({

            url: session.url

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Error creando sesión pago"

        });

    }

};

module.exports = {

    createPaymentSession

};