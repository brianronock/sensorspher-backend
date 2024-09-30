/***********************************************************
    src/utils/jwtHelper.js
/********************************************************************************************************
Summary:
Handles JSON Web Token (JWT) generation for user authentication.
Key Components:
- `generateToken`: Generates a JWT with the user’s ID and signs it using the secret key from the environment variables. Tokens are valid for 30 days.
Context:
- Backend: Part of the authentication flow, used in login and protected routes.
- Whole Project: Ensures secure communication between the frontend and backend, verifying users via tokens.
********************************************************************************************************/

const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/config')


// console.log('JWT Secret:', jwtSecret) // Added for debugging

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  })
}

module.exports = { generateToken }