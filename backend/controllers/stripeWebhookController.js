
const Stripe = require("stripe");

const Turno = require("../models/Turno");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhook = async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    // PRIMER TRY/CATCH: verificar que el evento venga de Stripe
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

    // SEGUNDO TRY/CATCH: proteger las operaciones con MongoDB
    try {

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

            // Confirmar el pago mediante una operación atómica
            const turno = await Turno.findOneAndUpdate(
                {
                    _id: turnoId,
                    paymentSessionId: session.id,
                    paymentStatus: "PENDING",
                    estado: "pendiente",

                    // NUEVO: verificar el importe cobrado
                    paymentAmount: session.amount_total,

                    // NUEVO: verificar la moneda utilizada
                    paymentCurrency: session.currency.toUpperCase()
                },
                {
                    $set: {
                        paymentStatus: "PAID",
                        estado: "confirmado"
                    }
                },
                {
                    new: true
                }
            );

            if (!turno) {
                console.warn(
                    `No se confirmó el turno ${turnoId}. Revisar su estado.`
                );
            }
        }

        // Gestionar sesiones de Stripe que han expirado
        if (event.type === "checkout.session.expired") {

            const session = event.data.object;
            const turnoId = session.metadata?.turnoId;

            if (!turnoId) {
                return res.json({ received: true });
            }

            const turno = await Turno.findOneAndUpdate(
                {
                    _id: turnoId,
                    paymentSessionId: session.id,
                    paymentStatus: "PENDING",
                    estado: "pendiente"
                },
                {
                    $set: {
                        estado: "expirado"
                    }
                },
                {
                    new: true
                }
            );

            if (turno) {
                console.log(
                    `Reserva ${turnoId} expirada correctamente`
                );
            }
        }

        return res.json({
            received: true
        });

    } catch (error) {

        console.error(
            "Error procesando webhook de Stripe:",
            error
        );

        return res.status(500).json({
            message: "Error procesando el evento de Stripe"
        });

    }

};

module.exports = stripeWebhook;
