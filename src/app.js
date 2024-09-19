/***********************************************************
    src/app.js
                This file sets up the Express app, 
                applies middleware, and connects routes

***********************************************************/

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const sensorRoutes = require('./routes/sensorRoutes')
const feedRoutes = require('./routes/feedRoutes')
const { errorHandler } = require('./middleware/errorHandler')
const { loggerMiddleware } = require('./middleware/loggerMiddleware')


// Initialize app
const app = express()
app.use(express.json())
app.use(cors())
app.use(loggerMiddleware)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/feed', feedRoutes)

// Global error handler. Registered after all route definitions to catch any errors throuwn by the routes
app.use(errorHandler)

module.exports = app