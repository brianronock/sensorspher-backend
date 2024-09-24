/***********************************************************
    src/controllers/feedController.js
                This file handles the logic for feed posts.
***********************************************************/

const mongoose = require('mongoose');
const Post = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const Joi = require('joi');

// Validation schema for creating posts
const postSchema = Joi.object({
  content: Joi.string().required(),
});

// Get all posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('user', 'name');
  res.json(posts);
});

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const post = new Post({
    content: req.body.content,
    user: req.user._id, // Attach authenticated user
  });

  const savedPost = await post.save();
  res.status(201).json(savedPost);
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // console.log('Deleting post with ID:', id);

  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // console.log('Invalid ObjectId:', id);
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = await Post.findById(id);
  if (!post) {
    // console.log('Post not found:', id);
    return res.status(404).json({ message: 'Post not found' });
  }

  // Use deleteOne or findByIdAndDelete instead of remove
  await Post.deleteOne({ _id: id });
  // console.log('Post removed successfully:', id);
  res.json({ message: 'Post removed' });
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if the user is the owner of the post
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  post.content = req.body.content || post.content;
  const updatedPost = await post.save();
  res.json(updatedPost);
});

const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the ObjectId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if the user has already liked the post
  if (!post.likes.includes(req.user._id)) {
    // Add the user's ID to the likes array only if not already liked
    post.likes.push(req.user._id);
    await post.save();
  }

  res.json({ message: 'Post liked', post });

});

module.exports = { getPosts, createPost, deletePost, updatePost, likePost };