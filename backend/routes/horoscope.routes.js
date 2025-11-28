const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Horoscope route funcionando correctamente' });
});

module.exports = router;