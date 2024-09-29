/***********************************************************
    src/controllers/feedController.js
                This file handles the logic for feed posts.
***********************************************************/

const mongoose = require('mongoose')
const Post = require('../models/Post')
const { asyncHandler } = require('../utils/asyncHandler')
const Joi = require('joi')

// Validation schema for creating posts
const postSchema = Joi.object({
  content: Joi.string().required(),
})

// Get all posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('user', 'name')
  res.json(posts)
})

// 1. Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { error } = postSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const post = new Post({
    content: req.body.content,
    user: req.user._id, // Attach authenticated user
    likes: [],           // Initialize likes with an empty array
  })
  await post.save()
  if (req.io) {
    req.io.emit('newPost', post)
    
  }
  res.status(201).json(post)
})


// 2. Delete a post
const deletePost = asyncHandler(async (req, res) => {
  console.log('Starting delete post process');
  const { id } = req.params
  
  // console.log('Deleting post with ID:', id)

  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
     console.log('Invalid ObjectId:', id)
    return res.status(404).json({ message: 'Post not found' })
  }
  const post = await Post.findById(id)
  if (!post) {
     console.log('Post not found:', id)
    return res.status(404).json({ message: 'Post not found' })
  }
  if (post.user.toString() !== req.user._id.toString()) {
    console.log('User not authorized to delete post:', id);
    //return res.json(post)
    return res.status(403).json({ message: 'Not authorized to delete this post' })
  }
  // Use deleteOne or findByIdAndDelete instead of remove
  await Post.deleteOne({ _id: id })
  console.log('Post deleted successfully:', id);

  // Emit post deletion via websocket
  // if (req.io) {
  //   console.log('Emitting deletePost event:', { postId: id });
  //   req.io.emit('deletePost', { postId: id})
  // }
  if (req.io) {
    console.log('req.io exists, emitting deletePost event:', { postId: id });
    req.io.emit('deletePost', { postId: id });
  } else {
    console.log('req.io is undefined during delete');
  }
  // console.log('Post removed successfully:', id)
  res.json({ message: 'Post removed' })
})


// 3. Update/Edit a post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Post not found' })
  }
  const post = await Post.findById(id)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }
  // Check if the user is the owner of the post
  if (post.user.toString() !== req.user._id.toString()) {
    return res.json(post)
    //return res.status(403).json({ message: 'Not authorized to update this post' })
  }
  post.content = req.body.content || post.content
  await post.save()
  res.json(post)
})


// 4. Like a post
const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Post not found' })
  }
  const post = await Post.findById(id)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }
  // Check if the user has already liked the post
  if (post.likes.includes(req.user._id)) {
    // Unlike: Remove the user's ID from the likes array
    post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString())
  } else {
    // Like: Add the user's ID to the likes array
    post.likes.push(req.user._id)
    console.log('Emitting likePost event for post:', post._id);
    console.log('Emitting likePost event:', { postId: id });

  }
  await post.save()
  // Broadcast the like update via WebSocket
  if (req.io) {
    req.io.emit('likePost', post)  // Broadcast the updated post with new like count
  }
  res.json(post)
})

module.exports = { getPosts, createPost, deletePost, updatePost, likePost }