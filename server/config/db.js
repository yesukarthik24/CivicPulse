const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicpulse';
  
  try {
    // Attempt connecting to specified URI or local mongodb instance
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[DB] Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`[DB] Local MongoDB connection skipped (${error.message}). Initializing embedded MongoMemoryServer...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connected to MongoMemoryServer at ${memoryUri}`);
    } catch (memErr) {
      console.error('[DB] MongoMemoryServer initialization failed:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
