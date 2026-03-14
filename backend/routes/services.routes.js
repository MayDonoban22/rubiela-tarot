const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
    crearServicio,
    listarServicios,
    listarServiciosAdmin,
    toggleServicio
} = require('../controllers/services.controller');


// PUBLICO — usuarios ven servicios activos
router.get('/', listarServicios);


// ADMIN — crear servicio
router.post(
    '/crear-servicio',
    authMiddleware,
    roleMiddleware('admin'),
    validate('service'),
    crearServicio
);


// ADMIN — ver todos los servicios
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    listarServiciosAdmin
);


// ADMIN — activar / desactivar servicio
router.patch(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    toggleServicio
);


module.exports = router;