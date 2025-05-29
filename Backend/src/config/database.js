const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.DATABASE_URL) {
      const conn = await mongoose.connect(process.env.DATABASE_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('Database URL not provided, using in-memory storage');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 