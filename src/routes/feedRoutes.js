/***********************************************************
    src/routes/feedRoutes.js
                This file defines routes related to
                managing feed posts and interactions.
***********************************************************/

const express = require('express')
const { getPosts, createPost, deletePost, updatePost } = require('../controllers/feedController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = express.Router()

// Get all posts
router.get('/', protect, asyncHandler(getPosts))

// Create a new post
router.post('/', protect, asyncHandler(createPost))

// Update a post by ID
router.put('/:id', protect, asyncHandler(updatePost));

// Delete a post by ID
router.delete('/:id', protect, asyncHandler(deletePost))

module.exports = router