/***********************************************************
    src/controllers/userController.js
                This file handles user-specific operations
                such as retrieving or updating user data,
                now using asyncHandler.
***********************************************************/

const User = require('../models/User')

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  res.json(user)
}

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.name = req.body.name || user.name
  user.email = req.body.email || user.email

  const updatedUser = await user.save()
  res.json(updatedUser)
}

module.exports = { getUserProfile, updateUserProfile }