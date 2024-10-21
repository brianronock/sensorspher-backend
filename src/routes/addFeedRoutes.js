/***********************************************************
    src/routes/addFeedRoutes.js
/********************************************************************************************************
Summary:
Defines routes for managing feed posts, such as retrieving, creating, updating, deleting, and liking posts.
Key Components:
- `/`: Route to get all posts (GET) and create new posts (POST).
- `/:id`: Route to update (PUT) or delete (DELETE) posts by their ID.
- `/:id/like`: Route to like a post.
Context:
- Backend: Handles all feed post operations, linking the frontend feed feature with the backend database.
- Whole Project: Core feature for the feed system, providing endpoints for posting and interacting with user content.
********************************************************************************************************/

const express = require('express')
const { getPosts, createPost, deletePost, updatePost, likePost } = require('../controllers/addFeedController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = express.Router()

// Get all posts
router.get('/', protect, asyncHandler(getPosts))

// Create a new post
router.post('/', protect, asyncHandler(createPost))

// Update a post by ID
router.put('/:id', protect, asyncHandler(updatePost))

// Delete a post by ID
router.delete('/:id', protect, asyncHandler(deletePost))

// Route to like a post
router.post('/:id/like', protect, asyncHandler(likePost))

module.exports = router