/***********************************************************
    src/controllers/feedController.js
                This file handles the logic for feed posts
                and interactions, now using asyncHandler.
***********************************************************/

const Post = require('../models/Post')

// Get all posts
const getPosts = async (req, res) => {
  const posts = await Post.find()
  res.json(posts)
}

// Create a new post
const createPost = async (req, res) => {
  const post = await Post.create(req.body)
  res.status(201).json(post)
}

// Delete a post
const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id)
  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }
  res.json({ message: 'Post removed' })
}

module.exports = { getPosts, createPost, deletePost }