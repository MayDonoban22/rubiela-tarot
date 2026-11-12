
const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

// Ruta temporalmente deshabilitada durante la migración
// del sistema de pagos de Stripe a Wompi.
//
// Se conserva la URL para evitar solicitudes hacia
// un sistema de pago que ya no utilizaremos.

router.post(
    "/create-session/:turnoId",
    auth,
    (req, res) => {
        return res.status(503).json({
            message:
                "El sistema de pagos está temporalmente deshabilitado. Próximamente estará disponible mediante Wompi."
        });
    }
);

module.exports = router;
