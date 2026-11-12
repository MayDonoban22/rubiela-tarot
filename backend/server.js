
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const {
    expireUnpaidReservations
} = require("./services/reservationExpiration.service");

const PORT = process.env.PORT || 4000;

// Revisar reservas vencidas cada 60 segundos
const EXPIRATION_INTERVAL_MS = 60 * 1000;

// Evitar revisiones simultáneas
let expirationRunning = false;

const checkExpiredReservations = async () => {
    if (expirationRunning) {
        return;
    }

    expirationRunning = true;

    try {
        const result = await expireUnpaidReservations();

        if (result.expiredCount > 0) {
            console.log(
                `⏳ Reservas vencidas liberadas: ${result.expiredCount}`
            );
        }
    } catch (error) {
        console.error(
            "❌ Error revisando reservas vencidas:",
            error.message
        );
    } finally {
        expirationRunning = false;
    }
};

const startServer = async () => {
    try {
        // 1. Conectar MongoDB
        await connectDB(process.env.MONGO_URI);

        // 2. Iniciar Express
        app.listen(PORT, () => {
            console.log(
                `🚀 Server running on port ${PORT}`
            );

            // 3. Revisar reservas vencidas al iniciar
            // La primera comprobación puede ejecutarse
            // después de establecer la conexión.
            checkExpiredReservations();

            // 4. Repetir la revisión cada 60 segundos
            setInterval(
                checkExpiredReservations,
                EXPIRATION_INTERVAL_MS
            );

            console.log(
                "⏳ Verificación de reservas activa: cada 60 segundos"
            );
        });

    } catch (error) {
        console.error(
            "❌ Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
