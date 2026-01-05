const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// Rutas de autenticación
// router.post('/register', validate('register'), registerUser);
router.post('/register', (req, res) => res.json({message: "Hola mundo!"}));
router.post('/login', (req, res) => res.json({message: "Hola mundo!"}));

module.exports = router;