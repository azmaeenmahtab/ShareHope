const db = require('../db');
const { ObjectId } = require('mongodb');

const transactionCollection = 'transactions';
const WALLET_METHODS = new Set(['bkash', 'nagad', 'rocket']);

const normalizeMethod = (value) => String(value || '').trim().toLowerCase();

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
    .find({
      $or: [
        { userId: String(userId) },
        { giverId: String(userId) },
        { receiverId: String(userId) },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  return records.map((record) => ({
    ...serializeTransaction(record),
    direction: String(record.receiverId) === String(userId) ? 'taken' : 'given',
  }));
}

async function createTransaction(userId, payload = {}) {
  const database = db.getDb();
  if (!database) throw new Error('Database is not connected');

  const direction = payload.direction === 'taken' ? 'taken' : 'given';
  const amount = toAmount(payload.amount);
  const paymentMethod = String(payload.paymentMethod || '').trim();
  const normalizedMethod = normalizeMethod(paymentMethod);
  const purpose = payload.purpose === 'zakat' ? 'zakat' : 'donation';

  if (!paymentMethod) throw new Error('Please provide a payment method');

  const transaction = {
    userId: String(userId),
    direction,
    amount,
    purpose,
    paymentMethod,
    status: String(payload.status || 'pending'),
    giverId: direction === 'given' ? String(userId) : String(payload.giverId || ''),
    receiverId: direction === 'taken' ? String(userId) : String(payload.receiverId || ''),
    requestId: String(payload.requestId || '').trim(),
    counterpartyId: String(payload.counterpartyId || '').trim(),
    counterpartyName: String(payload.counterpartyName || 'ShareHope user').trim(),
    transactionId: WALLET_METHODS.has(normalizedMethod) ? String(payload.transactionId || '').trim() : '',
    createdAt: new Date(),
  };

  const result = await database.collection(transactionCollection).insertOne(transaction);
  return serializeTransaction({ ...transaction, _id: result.insertedId });
}

async function confirmTransaction(userId, transactionId) {
  const database = db.getDb();
  if (!database) throw new Error('Database is not connected');

  const result = await database.collection(transactionCollection).findOneAndUpdate(
    {
      _id: new ObjectId(transactionId),
      receiverId: String(userId),
    },
    { $set: { status: 'confirmed', confirmedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!result.value) throw new Error('Transaction not found or you cannot confirm it');
  return serializeTransaction(result.value);
}

module.exports = { getTransactions, createTransaction, confirmTransaction, WALLET_METHODS, normalizeMethod };
