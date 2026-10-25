const Stripe = require("stripe");

const Turno = require("../models/Turno");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhook = async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    try {

        event = stripe.webhooks.constructEvent(

            req.body,

            sig,

            endpointSecret

        );

    } catch (err) {

        console.log("Webhook error:", err.message);

        return res.status(400).send();

    }

    if (event.type === "checkout.session.completed") {

        const session = event.data.object;

        // Confirmar que Stripe registra el pago como completado
        if (session.payment_status !== "paid") {
            return res.json({ received: true });
        }

        const turnoId = session.metadata?.turnoId;

        if (!turnoId) {
            return res.status(400).json({
                message: "Turno no identificado"
            });
        }

        const turno = await Turno.findById(turnoId);

        if (!turno) {
            return res.status(404).json({
                message: "Turno no encontrado"
            });
        }

        // Verificar que la sesión corresponde a la reserva
        if (turno.paymentSessionId !== session.id) {
            return res.status(400).json({
                message: "La sesión de pago no corresponde al turno"
            });
        }

        // Evitar procesar dos veces el mismo pago
        if (turno.paymentStatus === "PAID") {
            return res.json({ received: true });
        }

        turno.paymentStatus = "PAID";
        turno.estado = "confirmado";

        await turno.save();
    }

    res.json({

        received: true

    });

};

module.exports = stripeWebhook;