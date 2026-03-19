const express = require('express');
const router = express.Router();

const {

    sendMessage

} = require('../controllers/contact.controller');


// Enviar mensaje contacto
router.post(

    '/',

    sendMessage

);


// Test
router.get('/test', (req, res) => {

    res.json({

        message: 'Contact route funcionando correctamente'

    });

});

module.exports = router;