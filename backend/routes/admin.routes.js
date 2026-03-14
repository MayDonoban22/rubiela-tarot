const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const usersController = require('../controllers/users.controller');
const turnosController = require('../controllers/turnos.controller');
const contactController = require('../controllers/contact.controller');


// usuarios
router.get(
    '/users',
    authMiddleware,
    roleMiddleware('admin'),
    usersController.getUsers
);


// ver todos los turnos
router.get(
    '/turnos',
    authMiddleware,
    roleMiddleware('admin'),
    turnosController.getAllTurnos
);


// actualizar estado del turno
router.patch(
    '/turnos/:id',
    authMiddleware,
    roleMiddleware('admin'),
    turnosController.updateTurnoStatus
);


// mensajes
router.get(
    '/messages',
    authMiddleware,
    roleMiddleware('admin'),
    contactController.getMessages
);


module.exports = router;