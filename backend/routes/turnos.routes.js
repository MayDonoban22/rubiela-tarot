const express = require('express');
const router = express.Router();

// Endpoint temporal
router.get('/test', (req, res) => {
    res.json({ message: 'Appointments route funcionando correctamente' });
});

module.exports = router;