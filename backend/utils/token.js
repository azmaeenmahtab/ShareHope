const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'sharehope_jwt_secret_key_2026_secure';
const TOKEN_COLLECTION = 'authorizedToken';

/**
 * Checks if user has a valid token in authorizedToken collection.
 * If valid till now, returns it; otherwise generates, saves, and returns a new token.
 *
 * @param {Object} user User document containing _id, email, role, etc.
 * @returns {Promise<string>} Valid JWT token
 */
const assignNewTokenService = async (user) => {
  if (!user || !user._id) {
    throw new Error('User information with _id is required to assign token');
  }

  const database = db.getDb();
  if (!database) {
    throw new Error('Database is not connected');
  }

  const tokenCollection = database.collection(TOKEN_COLLECTION);
  const userId = user._id;

  // 1. Check if token document exists for this user
  const existingRecord = await tokenCollection.findOne({
    $or: [{ userId }, { userId: String(userId) }],
  });

  if (existingRecord && existingRecord.token) {
    try {
      // 2. Check if the token is valid till now
      jwt.verify(existingRecord.token, JWT_SECRET);
      return existingRecord.token;
    } catch (error) {
      // Token is expired or invalid - proceed to generate a new one
    }
  }

  // 3. Generate new token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 4. Save/update the new token in authorizedToken collection
  await tokenCollection.updateOne(
    { $or: [{ userId }, { userId: String(userId) }] },
    {
      $set: {
        userId,
        token,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return token;
};

module.exports = {
  assignNewTokenService,
  JWT_SECRET,
};
