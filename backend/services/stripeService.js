
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (turno, service) => {

    // NUEVO: Obtener el precio en dólares
    const precio = Number(service.precio);

    // NUEVO: Validar el precio
    if (
        !Number.isFinite(precio) ||
        precio < 0.50 ||
        Math.abs(precio * 100 - Math.round(precio * 100)) > 0.000001
    ) {
        throw new Error("El servicio tiene un precio inválido en USD");
    }

    // NUEVO: Convertir dólares a centavos
    const precioEnCentavos = Math.round(precio * 100);

    if (!turno.paymentCheckoutExpiresAt) {
        throw new Error("La reserva no tiene un vencimiento configurado");
    }

    const expiresAt = Math.floor(
        new Date(turno.paymentCheckoutExpiresAt).getTime() / 1000
    );

    const segundosRestantes = expiresAt - Math.floor(Date.now() / 1000);

    if (segundosRestantes < 1800 || segundosRestantes > 86400) {
        throw new Error("Vencimiento fuera del rango permitido");
    }

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
                    // MODIFICADO: utilizar el precio validado
                    unit_amount: precioEnCentavos
                },
                quantity: 1
            }
        ],

        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

        metadata: {
            turnoId: turno._id.toString()
        }
    }, {
        idempotencyKey: `checkout-${turno._id.toString()}`
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
