const express = require('express');
const { getProfile } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

module.exports = router;
