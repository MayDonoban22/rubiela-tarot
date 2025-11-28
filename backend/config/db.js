const mongoose = require('mongoose');
const winston = require('winston');

// Configuración del logger (usando winston)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
});

// Función de conexión
const connectDB = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri);
        logger.info('✅ Conectado a MongoDB correctamente');
    } catch (error) {
        logger.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
