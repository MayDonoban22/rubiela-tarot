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

        const turnoId = session.metadata.turnoId;

        const turno = await Turno.findById(turnoId);

        if (turno) {

            turno.paymentStatus = "PAID";

            turno.estado = "confirmado";

            await turno.save();

        }

    }

    res.json({

        received: true

    });

};

module.exports = stripeWebhook;