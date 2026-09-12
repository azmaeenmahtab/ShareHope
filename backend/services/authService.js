const db = require('../db');
const { assignNewTokenService } = require('../utils/token');
const { ObjectId } = require('mongodb');

const usercollection = 'user';
const tokenCollection = 'authorizedToken'

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

const authMeService = async (email) => {
  const database = db.getDb();
  if (!database) {
    throw new Error('Database is not connected');
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await database.collection(usercollection).findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error('User not found');
  }

  const tokenRecord = await database.collection(tokenCollection).findOne({ userId: user._id });

  if(!tokenRecord){
    throw new Error('Token not found');
  }

  // Return user details without password
  const {_id, password:_, ...userWithoutPassword} = user;
  return userWithoutPassword;
};


const logoutService = async (email) => {
  try {
    const database = db.getDb();
    if (!database) {
      throw new Error('Database is not connected');
    }
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await database.collection(usercollection).findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('User not found');
    }

    const objectId = new ObjectId(user._id);

    const result = await database.collection("authorizedToken").deleteMany(
      { userId: objectId }
    );

    console.log("result from logout service : ", result);
    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signupService,
  loginService,
  authMeService,
  logoutService
};
