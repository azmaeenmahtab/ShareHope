const express = require('express');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');
const {
  getTransactionsController,
  createTransactionController,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(verifyTokenMiddleware);
router.get('/', getTransactionsController);
router.post('/', createTransactionController);

module.exports = router;
