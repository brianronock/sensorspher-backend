/***********************************************************
    src/middleware/authMiddleware.js
                This file checks if the user is authenticated
                by verifying the JWT token.
***********************************************************/

const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/config')
const User = require('../models/User')
const { asyncHandler } = require('../utils/asyncHandler')

const protect = asyncHandler(async (req, res, next) => {
  // console.log('Authorization Header:', req.headers.authorization); // Log the header

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
      // console.log('No token found');
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      // console.log('Decoded JWT:', decoded); // Log the decoded JWT
      req.user = await User.findById(decoded.id).select('-password');
      // console.log('Found User:', req.user); // Log the found user
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // console.log('No Authorization header or Bearer token');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect }