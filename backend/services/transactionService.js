const db = require('../db');

const transactionCollection = 'transactions';

const toAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Please provide a valid transaction amount');
  }
  return amount;
};

const serializeTransaction = (transaction) => ({
  ...transaction,
  _id: transaction._id?.toString(),
  userId: transaction.userId?.toString(),
});

async function getTransactions(userId) {
  const database = db.getDb();
  if (!database) throw new Error('Database is not connected');

  const records = await database
    .collection(transactionCollection)
    .find({ userId: String(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return records.map(serializeTransaction);
}

async function createTransaction(userId, payload = {}) {
  const database = db.getDb();
  if (!database) throw new Error('Database is not connected');

  const direction = payload.direction === 'taken' ? 'taken' : 'given';
  const amount = toAmount(payload.amount);
  const paymentMethod = String(payload.paymentMethod || '').trim();
  const purpose = payload.purpose === 'zakat' ? 'zakat' : 'donation';

  if (!paymentMethod) throw new Error('Please provide a payment method');

  const transaction = {
    userId: String(userId),
    direction,
    amount,
    purpose,
    paymentMethod,
    status: String(payload.status || 'pending'),
    requestId: String(payload.requestId || '').trim(),
    counterpartyId: String(payload.counterpartyId || '').trim(),
    counterpartyName: String(payload.counterpartyName || 'ShareHope user').trim(),
    transactionId: String(payload.transactionId || '').trim(),
    createdAt: new Date(),
  };

  const result = await database.collection(transactionCollection).insertOne(transaction);
  return serializeTransaction({ ...transaction, _id: result.insertedId });
}

module.exports = { getTransactions, createTransaction };
