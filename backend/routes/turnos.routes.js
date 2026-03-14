const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const {
    createTurno,
    getMyTurnos
} = require('../controllers/turnos.controller');

// Ver mis turnos
router.get('/mis-turnos', authMiddleware, getMyTurnos);

// Crear turno
router.post('/', authMiddleware, createTurno);

// Test
router.get('/test', (req, res) => {
    res.json({ message: 'Appointments route funcionando correctamente' });
});

module.exports = router;