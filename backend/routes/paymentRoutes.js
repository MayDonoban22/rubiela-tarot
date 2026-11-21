
const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const {
    createPaymentSession,
    reconcilePayment
} = require("../controllers/paymentController");

// =====================================
// WOMPI - PREPARAR CHECKOUT
// =====================================

// Genera los datos del Checkout de Wompi
// para una reserva que pertenece al usuario.
//
// Requiere autenticación JWT.

router.post(
    "/create-session/:turnoId",
    auth,
    createPaymentSession
);

// =====================================
// WOMPI - CONCILIAR TRANSACCIÓN
// =====================================

// Consulta directamente a Wompi el estado
// de una transacción identificada.
//
// El usuario solamente puede consultar
// sus propias reservas.
//
// Requiere autenticación JWT.

router.get(
    "/reconcile/:turnoId",
    auth,
    reconcilePayment
);

module.exports = router;
