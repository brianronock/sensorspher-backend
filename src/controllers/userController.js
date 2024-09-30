/***********************************************************
    src/controllers/userController.js
/********************************************************************************************************
- Purpose: This file handles logic related to user profiles, such as retrieving and updating user information.
Variables
- `User`: The Mongoose model for user data.
- `asyncHandler`: A utility to handle errors in asynchronous functions.
Functions:
- `getUserProfile()`: Fetches the profile of the currently authenticated user using their `user._id` and returns the user’s profile details.
- `updateUserProfile()`: Updates the profile of the authenticated user. It updates the name, email, and password (if provided), and then saves the updated user to the database.
Description:
- The `userController` is responsible for user-related tasks, such as retrieving and updating the user's profile. It ensures that only the authenticated user can access and update their own data.
********************************************************************************************************/

const User = require('../models/User')
const { asyncHandler } = require('../utils/asyncHandler')

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
 // console.log('User profile requested:', req.user)  // Debug log
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports = { getUserProfile, updateUserProfile }