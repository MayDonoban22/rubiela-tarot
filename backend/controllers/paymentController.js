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

        // Evitar crear otra sesión mientras exista una asociada
        if (turno.paymentSessionId) {
            return res.status(409).json({
                message: "Esta reserva ya tiene una sesión de pago. Debemos verificar su estado antes de crear otra."
            });
        }
        const service = await Service.findById(turno.servicio);

        const session = await createCheckoutSession(turno, service);

        // Guardar la sesión de Stripe
        turno.paymentSessionId = session.id;

        // Convertir el vencimiento de Stripe a Date de JavaScript
        turno.paymentExpiresAt = new Date(session.expires_at * 1000);

        // Guardar los cambios en MongoDB
        await turno.save();
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