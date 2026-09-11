const db = require('../db');
const { assignNewTokenService } = require('../utils/token');

const usercollection = 'user';

const signupService = async (userData) => {
  const database = db.getDb();
  if (!database) {
    throw new Error('Database is not connected');
  }

  const { name, email, password, role } = userData;
  const normalizedEmail = String(email).toLowerCase().trim();

  // Check if user already exists
  const existingUser = await database.collection(usercollection).findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const newUser = {
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    role,
    createdAt: new Date(),
  };

  const result = await database.collection(usercollection).insertOne(newUser);

  // Return user details without password
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    _id: result.insertedId,
    ...userWithoutPassword,
  };
};

const loginService = async ({ email, password }) => {
  const database = db.getDb();
  if (!database) {
    throw new Error('Database is not connected');
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  // Find user by email
  const user = await database.collection(usercollection).findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Assign existing valid token or generate and save a new one
  const token = await assignNewTokenService(user);

  // Return user details without password and the assigned token
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token,
  };
};

module.exports = {
  signupService,
  loginService,
};
