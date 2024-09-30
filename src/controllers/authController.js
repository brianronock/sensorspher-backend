/***********************************************************
    src/controllers/authController.js
/********************************************************************************************************
- Purpose: This file handles the logic for user authentication, including registration and login.
Variables
- `asyncHandler`: A utility that wraps asynchronous functions to handle errors.
- `Joi`: A validation library used to validate user input, such as registration and login forms.
- `User`: The Mongoose model for user data.
- `generateToken`: A utility function used to create JWT tokens for authenticated users.
Functions: 
- `registerUser()`: This function is responsible for registering a new user.
                    It validates the input data using `Joi`,checks if the user already exists, 
                    creates a new user if they don’t exist, and returns the user details and a JWT token.
- `loginUser()`: This function handles user login. It validates the login data, 
                  checks if the user exists and the password matches, and then 
                  returns a JWT token if the credentials are valid.
Description: - This file manages user authentication, including validating inputs using `Joi`, 
                handling errors, and interacting with the `User` model to register and log in users. 
                JWT tokens are generated for authentication upon successful registration or login.
********************************************************************************************************/

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
    // console.log('Generated token:', token) // for  debugging
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