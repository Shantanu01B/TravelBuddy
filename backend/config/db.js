const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelbuddy';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Attempting fallback to 127.0.0.1...`);
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/travelbuddy', {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Local MongoDB Connected: ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`⚠️ MongoDB Connection Error: ${fallbackError.message}`);
      console.error('Will retry connection in 5 seconds without crashing the server...');
      setTimeout(connectDB, 5000);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection in 5s...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
