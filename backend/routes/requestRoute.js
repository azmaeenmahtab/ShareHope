const express = require('express');
const router = express.Router();
const { createRequestController, getAllRequestsController } = require('../controllers/requestController');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');

router.use((req, res, next) => {
    console.log(`[Request Route] Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

router.get('/', getAllRequestsController);
router.get('/all', getAllRequestsController);

router.get('/create', (req, res) => {
    res.json({ message: "Donation request create route" });
});

router.post('/submit', verifyTokenMiddleware, createRequestController);
router.post('/create', verifyTokenMiddleware, createRequestController);

module.exports = router;



