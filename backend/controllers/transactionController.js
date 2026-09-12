const { getTransactions, createTransaction } = require('../services/transactionService');

const getTransactionsController = async (req, res) => {
  try {
    const transactions = await getTransactions(req.user.id);
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to load transactions' });
  }
};

const createTransactionController = async (req, res) => {
  try {
    const transaction = await createTransaction(req.user.id, req.body);
    return res.status(201).json({ success: true, transaction });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unable to save transaction' });
  }
};

module.exports = { getTransactionsController, createTransactionController };
