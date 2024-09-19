/***********************************************************
    src/controllers/authController.js
                This file handles the logic for authentication.
***********************************************************/

const { asyncHandler } = require('../utils/asyncHandler')
const Joi = require('joi')
const User = require('../models/User')
const { generateToken } = require('../utils/jwtHelper')

// Validation schema for registering users
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    console.log('Generated token:', token) // Add this line for debugging
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

module.exports = { registerUser, loginUser }