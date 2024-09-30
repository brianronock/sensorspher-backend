/***********************************************************
    src/routes/userRoutes.js
/********************************************************************************************************
Summary:
Defines routes for user actions, such as retrieving and updating user profiles.
Key Components:
- `/profile`: Route to get (GET) and update (PUT) the current user’s profile.
Context:
- Backend: Facilitates the retrieval and modification of user information.
- Whole Project: Allows users to update their profiles and manage their accounts.

********************************************************************************************************/

const express = require('express')
const { getUserProfile, updateUserProfile } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = express.Router()

// Get user profile (protected route)
router.get('/profile', protect, asyncHandler(getUserProfile))

// Update user profile (protected route)
router.put('/profile', protect, asyncHandler(updateUserProfile))

router.get('/test', (req, res) => {
    res.json({ message: 'Test route working' })
  })

module.exports = router