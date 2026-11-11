
const Stripe = require("stripe");

// Stripe permanece deshabilitado cuando no hay credenciales.
// La pasarela principal prevista para Luz de Rubí es Wompi.
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// Obtener los datos originales del intento de pago
const getCheckoutSnapshot = (turno, service) => {

    // Utilizar el precio guardado originalmente en MongoDB
    if (
        turno.paymentAttemptSnapshot &&
        Number.isFinite(turno.paymentAttemptSnapshot.amount) &&
        Number.isInteger(turno.paymentAttemptSnapshot.amount) &&
        turno.paymentAttemptSnapshot.amount >= 50 &&
        turno.paymentAttemptSnapshot.currency
    ) {
        return {
            nombre: turno.paymentAttemptSnapshot.nombre,
            duracion: turno.paymentAttemptSnapshot.duracion,
            amount: turno.paymentAttemptSnapshot.amount,
            currency: turno.paymentAttemptSnapshot.currency.toLowerCase()
        };
    }

    // Compatibilidad con intentos anteriores sin snapshot
    const precio = Number(service?.precio);
    const amount = Math.round(precio * 100);

    if (
        !Number.isFinite(precio) ||
        precio < 0.50 ||
        Math.abs(precio * 100 - amount) > 0.000001
    ) {
        throw new Error(
            "El servicio tiene un precio inválido en USD"
        );
    }

    return {
        nombre: service.nombre,
        duracion: service.duracion,
        amount,
        currency: "usd"
    };
};

// Crear sesión de Stripe (integración temporal no activa)
const createCheckoutSession = async (
    turno,
    service,
    isRetry = false
) => {

    if (!stripe) {
        throw new Error(
            "Stripe no está configurado. La pasarela prevista es Wompi."
        );
    }

    if (!turno.paymentCheckoutExpiresAt) {
        throw new Error(
            "La reserva no tiene un vencimiento configurado"
        );
    }

    const expiresAt = Math.floor(
        new Date(turno.paymentCheckoutExpiresAt).getTime() / 1000
    );

    const segundosRestantes =
        expiresAt - Math.floor(Date.now() / 1000);

    if (
        !Number.isFinite(segundosRestantes) ||
        segundosRestantes <= 0 ||
        segundosRestantes > 86400 ||
        (!isRetry && segundosRestantes < 1800)
    ) {
        throw new Error(
            "Vencimiento fuera del rango permitido"
        );
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
                            description:
                                `Consulta espiritual - ${snapshot.duracion}`
                        },

                        unit_amount: snapshot.amount
                    },

                    quantity: 1
                }
            ],

            success_url:
                `${process.env.CLIENT_URL}/payment-success`,

            cancel_url:
                `${process.env.CLIENT_URL}/payment-cancel`,

            metadata: {
                turnoId: turno._id.toString(),
                paymentAttemptId: turno.paymentAttemptId
            }
        },
        {
            idempotencyKey:
                `checkout-${turno.paymentAttemptId}`
        }
    );

    return session;
};

// Consultar una sesión existente
const getCheckoutSession = async (sessionId) => {

    if (!stripe) {
        throw new Error(
            "Stripe no está configurado"
        );
    }

    return stripe.checkout.sessions.retrieve(sessionId);
};

// Reintentar una operación anterior
const retryCheckoutSession = async (turno, service) => {

    return createCheckoutSession(
        turno,
        service,
        true
    );
};

module.exports = {
    createCheckoutSession,
    getCheckoutSession,
    retryCheckoutSession
};
