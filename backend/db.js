const { MongoClient } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

let client;
let db;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set in backend/.env.');
  }

  try {
     
      client = new MongoClient(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
      });
     
      await client.connect();
    

    db = client.db(process.env.DB_NAME || 'sharehope');
    console.log(`MongoDB Connected: ${db.databaseName}`);
    return db;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    return null;
  }
  return db;
};


module.exports = {
  connectDB,
  getDb,
};
