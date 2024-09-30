/***********************************************************
    src/middleware/authMiddleware.js
/********************************************************************************************************
- Purpose: This middleware verifies if the user is authenticated by checking and validating the JWT token provided in the authorization header of the request.
Variables
- `jwt`: A package used to handle JSON Web Tokens (JWT), responsible for verifying the token.
- `jwtSecret`: The secret key used for signing the JWT, imported from the config file.
- `User`: The Mongoose model for the user, used to fetch user information from the database.
- `asyncHandler`: A utility function to handle errors in asynchronous functions.
Functions:
- `protect()`: This function is the main middleware that protects routes. It checks the authorization header for a valid JWT token, verifies it using the `jwtSecret`, and retrieves the corresponding user from the database (excluding the password). If the token is missing or invalid, the user is not authorized to access the route.
Description:
- This file ensures that only authenticated users can access certain routes. It checks for a valid JWT token in the request header and decodes it to authenticate the user, attaching the user’s data to `req.user` for use in the route handler.
********************************************************************************************************/

const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/config')
const User = require('../models/User')
const { asyncHandler } = require('../utils/asyncHandler')

const protect = asyncHandler(async (req, res, next) => {
  // console.log('Authorization Header:', req.headers.authorization) // Log the header

  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    // console.log('Extracted Token:', token) // Log the extracted token

    if (!token) {
      // console.log('No token found')
      res.status(401)
      throw new Error('Not authorized, no token')
    }

    try {
      const decoded = jwt.verify(token, jwtSecret)
      // console.log('Decoded JWT:', decoded) // Log the decoded JWT
      req.user = await User.findById(decoded.id).select('-password')
      // console.log('Found User:', req.user) // Log the found user
      next()
    } catch (error) {
      console.error('JWT verification error:', error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    // console.log('No Authorization header or Bearer token')
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }