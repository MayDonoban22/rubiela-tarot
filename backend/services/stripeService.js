const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (turno, service) => {

    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60;

    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],
        mode: "payment",
        expires_at: expiresAt,

        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: service.nombre,
                        description: `Consulta espiritual - ${service.duracion}`
                    },
                    unit_amount: service.precio * 100
                },
                quantity: 1
            }
        ],
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        metadata: {
            turnoId: turno._id.toString()
        }
    });

    return session;
};

// Consultar una sesión de pago existente en Stripe
const getCheckoutSession = async (sessionId) => {
    return stripe.checkout.sessions.retrieve(sessionId);
};

module.exports = {
    createCheckoutSession,
    getCheckoutSession
};