const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MONGODB_URI connection failed (${error.message}). Attempting fallback to local MongoDB...`);
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/travelbuddy');
      console.log(`Local MongoDB Connected: ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Connection Error: ${fallbackError.message}`);
      console.error('Please check your MongoDB Atlas credentials or start local MongoDB service.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
