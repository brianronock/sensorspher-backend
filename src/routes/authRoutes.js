/***********************************************************
    src/routes/authRoutes.js
/********************************************************************************************************
Summary:
Defines the routes related to user authentication, such as registration and login.
Key Components:
- `/register`: Route to register a new user.
- `/login`: Route to login an existing user.
Context:
- Backend: Part of the user authentication module, which uses the `authController` to handle registration and login.
- Whole Project: Crucial for managing user accounts and allowing secure access to protected resources.

********************************************************************************************************/

const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')
const { asyncHandler } = require('../utils/asyncHandler')

const router = express.Router()

// Register a new user
router.post('/register', asyncHandler(registerUser))

// Login an existing user
router.post('/login', asyncHandler(loginUser))

module.exports = router