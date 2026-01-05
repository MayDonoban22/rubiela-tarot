const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
    crearServicio,
    listarServicios
} = require('../controllers/services.controller');

// Público (usuarios pueden ver servicios)
router.get('/', listarServicios);

// Solo admin puede crear servicios
router.post(
    '/crear-servicio',
    authMiddleware,
    roleMiddleware('admin'),
    validate('service'),
    crearServicio
);

module.exports = router;
