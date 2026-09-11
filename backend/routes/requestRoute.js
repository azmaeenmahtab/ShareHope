const express = require('express');
const router = express.Router();
const { createRequestController } = require('../controllers/requestController');

router.get('/health', (req, res) => {
  res.json({ message: 'Donation request route is active' });
});

router.post('/create', createRequestController);

module.exports = router;
