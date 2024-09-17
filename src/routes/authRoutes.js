/***********************************************************
    src/routes/authRoutes.js
                This file defines the routes related to 
                user authentication.

***********************************************************/

const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

// Register a new user
router.post('/register', asyncHandler(registerUser))

// Login an existing user
router.post('/login', asyncHandler(loginUser))

module.exports = router