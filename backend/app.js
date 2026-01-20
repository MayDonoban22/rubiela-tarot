require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importación de rutas con la nueva estructura
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const serviciosRoutes = require('./routes/services.routes');
const turnosRoutes = require('./routes/turnos.routes');
const contactRoutes = require('./routes/contact.routes');
const horoscopeRoutes = require('./routes/horoscope.routes');

// Middlewares
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/horoscope', horoscopeRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ ok: true }));

// Manejo global de errores
app.use(errorMiddleware);

module.exports = app;
