const mongoose = require('mongoose')

const addPostSchema = new mongoose.Schema({
  content: {
    type: String,
    maxlength: 500, // limit the size of a post's content
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
  chartType: { // Specify whether the post contains a chart (temperature, humidity, etc.)
    type: String,
    enum: ['temperature', 'humidity', null],
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

const addPost = mongoose.model('addPost', addPostSchema)
module.exports = addPost