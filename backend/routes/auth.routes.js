const express = require('express');
const { registerUser, loginUser } = require('../controllers/users.controller');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Rutas de autenticación
router.post('/register', validate('register'), registerUser);
router.post('/login', validate('login'), loginUser);

module.exports = router;