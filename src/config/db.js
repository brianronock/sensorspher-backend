/********************************************************************************************************
    src/config/db.js
            Handles the connection to MongoDB using Mongoose, establishing the database connection at runtime.
** Variables:
  - `mongoose`: The library used for MongoDB interaction.
  - `mongoURI`: The MongoDB URI pulled from the configuration file (`config.js`).
** Functions: 
- `connectDB()`: This is an asynchronous function that tries to connect to the MongoDB database
                 using the provided URI (`mongoURI`).
Description: - This file connects the backend application to MongoDB. It uses Mongoose to handle database 
                connections and log any errors that might occur during the process.                
********************************************************************************************************/

const mongoose = require('mongoose')
const { mongoURI } = require('./config')


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI)
    console.log(`MongoDB Connected Sucesfully: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1) // Exit process with failure
  }
}

module.exports = connectDB