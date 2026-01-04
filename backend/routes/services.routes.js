router.post(
    '/crear-servicio',
    authMiddleware,
    roleMiddleware('admin'),
    crearServicio
);

module.exports = router; const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const {
    crearServicio,
    listarServicios
} = require('../controllers/services.controller');

// Público (usuarios pueden ver servicios)
router.get('/', listarServicios);

// Solo admin puede crear
router.post(
    '/crear-servicio',
    authMiddleware,
    roleMiddleware('admin'),
    crearServicio
);

module.exports = router;
