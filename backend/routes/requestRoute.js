const express = require('express');
const router = express.Router();
const { createRequestController } = require('../controllers/requestController');

router.get('/create', (req, res) => {
    res.json({ message: "Donation request create route" });
});


module.exports = router;
