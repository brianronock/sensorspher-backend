/***********************************************************
    src/controllers/feedController.js
/********************************************************************************************************
- Purpose: This file handles the logic for managing feed posts, including creating, updating, deleting, and liking posts.
Variables
- `mongoose`: Used for interacting with MongoDB.
- `Post`: The Mongoose model for posts.
- `asyncHandler`: A utility to handle errors in asynchronous functions.
- `Joi`: Used to validate the content of the post using a schema.
- `postSchema`: A schema defined using `Joi` to validate the structure of a post.
Functions:
- `getPosts()`: Retrieves all posts from the database and returns them in the response. It populates the `user` field with the `name` of the user who created the post.
- `createPost()`: Validates the input using `Joi`, creates a new post with the provided content, and associates the post with the authenticated user. The new post is saved to the database and returned in the response.
- `deletePost()`: Deletes a post by its ID. It checks if the post exists and if the user is authorized to delete the post.
- `updatePost()`: Updates an existing post by its ID. It checks if the post exists and if the user is the owner of the post, then updates the post content.
- `likePost()`: Handles the liking of a post. It checks if the post exists and if the user has already liked the post. If not, it adds the user's ID to the likes array and updates the post.
Description:- The `feedController` is responsible for managing feed-related functionalities. It handles creating, updating, deleting, and liking posts while ensuring proper user validation and permissions.
********************************************************************************************************/

const mongoose = require('mongoose')
const addPost = require('../models/AddPost')
const { asyncHandler } = require('../utils/asyncHandler')
const Joi = require('joi')

// Validation schema for creating posts
const addPostSchema = Joi.object({
  content: Joi.string().allow(''),
  chartType: Joi.string().valid('temperature', 'humidity').optional(), // Optional chartType
})

// Get all posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await addPost.find().populate('user', 'name')
  res.json(posts)
})

// 1. Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { error } = addPostSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const { content, chartType } = req.body
  const post = new addPost({
    content: content || '',
    user: req.user._id, // Attach authenticated user
    chartType,
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
  const post = await addPost.findById(id)
  if (!post) {
     console.log('Post not found:', id)
    return res.status(404).json({ message: 'Post not found' })
  }
  if (post.user.toString() !== req.user._id.toString()) {
    console.log('User not authorized to delete post:', id);
    //return res.json(post)
    return res.status(403).json({ message: 'Not authorized to delete this post' })
  }
  // Using deleteOne or findByIdAndDelete instead of remove
  await addPost.deleteOne({ _id: id })
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
  const post = await addPost.findById(id)
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
  const post = await addPost.findById(id)
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