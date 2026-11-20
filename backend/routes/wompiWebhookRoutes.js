
const express = require("express");

const router = express.Router();

const wompiWebhook = require(
    "../controllers/wompiWebhookController"
);

// =====================================
// WOMPI - WEBHOOK DE TRANSACCIONES
// =====================================

// Recibir notificaciones de Wompi.
// La autenticidad del evento se verifica
// mediante la firma de seguridad.

router.post(
    "/wompi",
    wompiWebhook
);

module.exports = router;
