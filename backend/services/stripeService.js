const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Obtener snapshot del intento o, como respaldo, construirlo desde service
const getCheckoutSnapshot = (turno, service) => {
    if (
        turno.paymentAttemptSnapshot &&
        Number.isFinite(turno.paymentAttemptSnapshot.amount) &&
        turno.paymentAttemptSnapshot.amount > 0 &&
        turno.paymentAttemptSnapshot.currency
    ) {
        return {
            nombre: turno.paymentAttemptSnapshot.nombre,
            duracion: turno.paymentAttemptSnapshot.duracion,
            amount: turno.paymentAttemptSnapshot.amount,
            currency: turno.paymentAttemptSnapshot.currency.toLowerCase()
        };
    }

    // Respaldo para turnos antiguos
    const precio = Number(service?.precio);
    const amount = Math.round(precio * 100);

    if (
        !Number.isFinite(precio) ||
        precio < 0.50 ||
        Math.abs(precio * 100 - amount) > 0.000001
    ) {
        throw new Error("El servicio tiene un precio inválido en USD");
    }

    return {
        nombre: service.nombre,
        duracion: service.duracion,
        amount,
        currency: "usd"
    };
};

const createCheckoutSession = async (turno, service, isRetry = false) => {
    if (!turno.paymentCheckoutExpiresAt) {
        throw new Error("La reserva no tiene un vencimiento configurado");
    }

    const expiresAt = Math.floor(
        new Date(turno.paymentCheckoutExpiresAt).getTime() / 1000
    );

    const segundosRestantes = expiresAt - Math.floor(Date.now() / 1000);

    if (
        segundosRestantes <= 0 ||
        segundosRestantes > 86400 ||
        (!isRetry && segundosRestantes < 1800)
    ) {
        throw new Error("Vencimiento fuera del rango permitido");
    }

    const snapshot = getCheckoutSnapshot(turno, service);

    const session = await stripe.checkout.sessions.create(
        {
            payment_method_types: ["card"],
            mode: "payment",
            expires_at: expiresAt,

            line_items: [
                {
                    price_data: {
                        currency: snapshot.currency,
                        product_data: {
                            name: snapshot.nombre,
                            description: `Consulta espiritual - ${snapshot.duracion}`
                        },
                        unit_amount: snapshot.amount
                    },
                    quantity: 1
                }
            ],

            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

            metadata: {
                turnoId: turno._id.toString(),
                paymentAttemptId: turno.paymentAttemptId
            }
        },
        {
            idempotencyKey: `checkout-${turno.paymentAttemptId}`
        }
    );

    return session;
};

const getCheckoutSession = async (sessionId) => {
    return stripe.checkout.sessions.retrieve(sessionId);
};

const retryCheckoutSession = async (turno, service) => {
    return createCheckoutSession(turno, service, true);
};

module.exports = {
    createCheckoutSession,
    getCheckoutSession,
    retryCheckoutSession
};