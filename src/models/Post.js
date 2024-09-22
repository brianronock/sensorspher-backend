/***********************************************************
    src/models/Post.js
                This file defines the MongoDB model for
                feed posts.
***********************************************************/

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500, // Optionally limit the size of a post's content
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],  // Store an array of user IDs who liked the post
    ref: 'User',
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Optional: Add indexing to optimize queries
postSchema.index({ user: 1, timestamp: -1 })

const Post = mongoose.model('Post', postSchema)

module.exports = Post