const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (turno, service) => {

    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        mode: "payment",

        line_items: [

            {

                price_data: {

                    currency: "usd",

                    product_data: {

                        name: service.title,

                        description: `Consulta espiritual - ${service.duration}`

                    },

                    unit_amount: service.price * 100

                },

                quantity: 1

            }

        ],

        success_url: `${process.env.FRONTEND_URL}/payment-success`,

        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,

        metadata: {

            turnoId: turno._id.toString()

        }

    });

    return session;

};

module.exports = {

    createCheckoutSession

};