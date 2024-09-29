/***********************************************************
    src/routes/userRoutes.js
                This file defines routes related to user 
                actions such as viewing or updating profiles.
***********************************************************/

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