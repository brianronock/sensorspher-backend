
const mongoose = require('mongoose');
const { mongoURI } = require('./config')


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI)
    console.log(`MongoDB Connected Sucesfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;