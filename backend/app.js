require('dotenv').config();

const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');


/* ROUTES */

const authRoutes = require('./routes/auth.routes');

const usersRoutes = require('./routes/users.routes');

const serviciosRoutes = require('./routes/services.routes');

const turnosRoutes = require('./routes/turnos.routes');

const contactRoutes = require('./routes/contact.routes');

const horoscopeRoutes = require('./routes/horoscope.routes');

const adminRoutes = require('./routes/admin.routes');

const stripeWebhookRoutes = require("./routes/stripeWebhookRoutes");


/* MIDDLEWARE */

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();


/* STRIPE WEBHOOK FIRST */

app.use("/api/webhook", stripeWebhookRoutes);


/* NORMAL MIDDLEWARE */

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use(helmet());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(limiter);


/* API ROUTES */

app.use('/api/auth', authRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/servicios', serviciosRoutes);

app.use('/api/turnos', turnosRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/horoscope', horoscopeRoutes);

app.use('/api/admin', adminRoutes);


/* HEALTH */

app.get('/api/health', (req, res) => {

    res.json({ status: 'ok', message: 'API funcionando correctamente' });

});


/* ERRORS */

app.use(errorMiddleware);


module.exports = app;