/***********************************************************
    src/utils/jwtHelper.js
                This helper generates JWT tokens for
                authenticated users.
***********************************************************/

const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/config')


// console.log('JWT Secret:', jwtSecret) // Added for debugging

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  })
}

module.exports = { generateToken }