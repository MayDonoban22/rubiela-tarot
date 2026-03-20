const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const { getMessages, sendMessage } = require('../controllers/contact.controller');


// User - Enviar mensaje contacto
router.post('/', sendMessage);

// ADMIN — ver mensajes
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    getMessages
);

// Test
router.get('/test', (req, res) => {

    res.json({

        message: 'Contact route funcionando correctamente'

    });

});

module.exports = router;