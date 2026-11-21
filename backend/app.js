
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// =====================================
// ROUTES
// =====================================

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const serviciosRoutes = require("./routes/services.routes");
const turnosRoutes = require("./routes/turnos.routes");
const contactRoutes = require("./routes/contact.routes");
const horoscopeRoutes = require("./routes/horoscope.routes");
const adminRoutes = require("./routes/admin.routes");
const paymentRoutes = require("./routes/paymentRoutes");

// Webhook de Wompi
const wompiWebhookRoutes = require(
    "./routes/wompiWebhookRoutes"
);

// =====================================
// MIDDLEWARE
// =====================================

const errorMiddleware = require(
    "./middlewares/error.middleware"
);

const app = express();

// =====================================
// CONFIGURACIÓN GENERAL
// =====================================

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// =====================================
// JSON BODY PARSER
// =====================================

app.use(express.json({
    limit: "100kb"
}));

// =====================================
// WOMPI WEBHOOK
// =====================================

// Wompi no utiliza JWT de nuestros usuarios.
// La autenticidad de los eventos se verifica
// en wompiWebhookController.js.

app.use(
    "/api/webhook",
    wompiWebhookRoutes
);

// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", authRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/servicios", serviciosRoutes);

app.use("/api/turnos", turnosRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/horoscope", horoscopeRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/payments", paymentRoutes);

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
    return res.json({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

// =====================================
// ERROR HANDLING
// =====================================

app.use(errorMiddleware);

module.exports = app;
