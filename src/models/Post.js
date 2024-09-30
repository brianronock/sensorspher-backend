/***********************************************************
    src/models/Post.js
/********************************************************************************************************
- Purpose: Defines the MongoDB schema and model for feed posts.
Variables
- `mongoose`: The MongoDB ODM (Object-Document Mapping) library used to define schemas and models.
Functions:
- `postSchema`: The schema defines the structure of a post in the database:
  - `content`: A string representing the text of the post, required and limited to a maximum of 500 characters.
  - `user`: A reference to the `User` model, storing the ID of the user who created the post.
  - `likes`: An array of `ObjectId` values referencing users who have liked the post.
  - `timestamp`: The date the post was created or updated (set to the current date by default).
- `Post`: The Mongoose model for posts, based on the `postSchema`.
Description:
- This file defines the schema for posts in the feed, ensuring that each post is associated with a user and can store a list of likes. The schema includes automatic timestamps and limits the size of the post content.
********************************************************************************************************/

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
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
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Add indexing to optimize queries
postSchema.index({ user: 1, timestamp: -1 })

const Post = mongoose.model('Post', postSchema)

module.exports = Post