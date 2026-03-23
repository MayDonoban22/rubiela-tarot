const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {

    createTurno,
    getMyTurnos,
    cancelTurno,
    rescheduleTurno,
    getAllTurnos,
    updateTurnoStatus

} = require('../controllers/turnos.controller');


// USER — ver mis turnos
router.get(

    '/mis-turnos',

    authMiddleware,

    getMyTurnos

);


// USER — crear turno
router.post(

    '/',

    authMiddleware,

    createTurno

);


// USER — cancelar
router.patch(

    '/cancel/:id',

    authMiddleware,

    cancelTurno

);


// USER — reagendar
router.patch(

    '/reschedule/:id',

    authMiddleware,

    rescheduleTurno

);


// ADMIN — ver todos
router.get(

    '/admin',

    authMiddleware,

    roleMiddleware('admin'),

    getAllTurnos

);


// ADMIN — cambiar estado
router.patch(

    '/admin/:id',

    authMiddleware,

    roleMiddleware('admin'),

    updateTurnoStatus

);


// TEST
router.get('/test', (req, res) => {

    res.json({

        message: 'Appointments route funcionando correctamente'

    });

});

module.exports = router;