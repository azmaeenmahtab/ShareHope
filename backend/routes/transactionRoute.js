const express = require('express');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');
const {
  getTransactionsController,
  createTransactionController,
  confirmTransactionController,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(verifyTokenMiddleware);
router.get('/', getTransactionsController);
router.post('/', createTransactionController);
router.patch('/:id/confirm', confirmTransactionController);

module.exports = router;
