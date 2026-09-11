const db = require('../db');

const database = db.getDb();
const usercollection = "user"


const signupService = async (userData) => {
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
  const collection = getUserCollection();
  const normalizedEmail = String(email).toLowerCase().trim();

  // Find user by email
  const user = await collection.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Return user details without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  getUserCollection,
  signupService,
  loginService,
};
