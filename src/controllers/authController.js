/***********************************************************
    src/controllers/authController.js
                This file handles the logic for user
                registration and login, now using asyncHandler.
***********************************************************/

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { generateToken } = require('../utils/jwtHelper')

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400)
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  const token = generateToken(user._id)

  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token })
}

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(400)
    throw new Error('Invalid credentials')
  }

  const token = generateToken(user._id)
  res.json({ _id: user._id, name: user.name, email: user.email, token })
}

module.exports = { registerUser, loginUser }