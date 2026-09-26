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
  const requestId = String(payload.requestId || '').trim();

  if (!paymentMethod) throw new Error('Please provide a payment method');
  if (direction !== 'given') throw new Error('Donation records must be created by the giver');
  if (!requestId) throw new Error('Please select a saved donation request');

  const requestLookup = [{ id: requestId }];
  if (ObjectId.isValid(requestId)) requestLookup.push({ _id: new ObjectId(requestId) });
  const request = await database.collection('requests').findOne({ $or: requestLookup });
  if (!request) throw new Error('Donation request not found');

  let receiverId = String(request.submitterId || request.ownerId || request.userId || '');
  if (!receiverId && request.submitterEmail) {
    const recipient = await database.collection('user').findOne({
      email: String(request.submitterEmail).trim().toLowerCase(),
    });
    receiverId = recipient?._id?.toString() || '';
  }
  if (!receiverId) throw new Error('The donation request owner could not be identified');
  if (receiverId === String(userId)) throw new Error('You cannot donate to your own request');

  const giverObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
  const giver = await database.collection('user').findOne(
    { _id: giverObjectId },
    { projection: { name: 1 } }
  );

  const transaction = {
    userId: String(userId),
    direction,
    amount,
    purpose,
    paymentMethod,
    status: 'pending',
    giverId: direction === 'given' ? String(userId) : String(payload.giverId || ''),
    receiverId,
    requestId,
    requestName: String(request.name || payload.counterpartyName || 'Donation request'),
    requestedAmount: Number(request.goal) || 0,
    giverName: String(giver?.name || 'ShareHope user'),
    counterpartyId: requestId,
    counterpartyName: String(request.name || payload.counterpartyName || 'ShareHope user'),
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
