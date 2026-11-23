
const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const {
    createPaymentSession,
    reconcilePayment
} = require("../controllers/paymentController");

const {
    recoverPayment
} = require("../controllers/wompiRecoveryController");

// =====================================
// WOMPI - PREPARAR CHECKOUT
// =====================================

// Prepara los datos del pago de una reserva.
// Requiere autenticación JWT.

router.post(
    "/create-session/:turnoId",
    auth,
    createPaymentSession
);

// =====================================
// WOMPI - CONCILIAR TRANSACCIÓN
// =====================================

// Consulta una transacción previamente
// identificada y verifica su estado.

router.get(
    "/reconcile/:turnoId",
    auth,
    reconcilePayment
);

// =====================================
// WOMPI - RECUPERAR PAGO
// =====================================

// Recibe el ID de transacción devuelto
// por Wompi después del Checkout.
//
// El backend consulta directamente a
// Wompi y valida el resultado.
//
// Requiere autenticación JWT.

router.post(
    "/recover/:turnoId",
    auth,
    recoverPayment
);

module.exports = router;
