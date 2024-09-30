/***********************************************************
    src/models/User.js
/********************************************************************************************************
- Purpose: Defines the MongoDB schema and model for users, including password hashing and verification.
Variables
- `mongoose`: The MongoDB ODM library for defining the schema and model.
- `bcrypt`: A library used to hash and compare passwords for security purposes.
Functions:
- `userSchema`: The schema defines the structure of a user document:
  - `name`: A string representing the user's name, required.
  - `email`: A string representing the user's email, required and unique.
  - `password`: A string representing the user's password, required.
- `pre('save')`: A pre-save middleware function that hashes the user's password before saving it to the database. This ensures that passwords are securely stored.
- `matchPassword()`: A method that compares the entered password with the hashed password stored in the database. This is used during login to verify the user's credentials.
- `User`: The Mongoose model for users, based on the `userSchema`.
Description:
- The `User` model is central to user management. It handles password hashing during user registration and includes methods to compare passwords during login. The schema ensures that each user has a unique email and stores hashed passwords for security.
********************************************************************************************************/

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare the entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User