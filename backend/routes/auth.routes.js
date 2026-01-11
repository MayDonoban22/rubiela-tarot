const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Rutas de autenticación
router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);
// router.post('/register', register);
// router.post('/login', login);

module.exports = router;