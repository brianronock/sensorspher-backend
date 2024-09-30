/***********************************************************
    src/app.js
/********************************************************************************************************
Summary:
This file is the main entry point for the Express app. It sets up the middleware, connects routes, and integrates services like MQTT and WebSocket.
Key Components:
- Middleware: Includes `express.json()`, `cors()`, `loggerMiddleware`, and `errorHandler`.
- Routes: Sets up all the API routes (auth, sensors, feed, users).
- Swagger UI: Exposes API documentation.
- MQTT Service: Initializes the MQTT service, which starts listening to sensor data.
- Error Handling: Registers the global error handler.
Context:
- Backend: This is the core of the Express application, initializing all middleware, services, and routes.
- Whole Project: The central hub that connects every service and route, handling requests and managing real-time data flow.
********************************************************************************************************/

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const sensorRoutes = require('./routes/sensorRoutes')
const feedRoutes = require('./routes/feedRoutes')
const userRoutes = require('./routes/userRoutes')  // Import user routes
const { errorHandler } = require('./middleware/errorHandler')
const { loggerMiddleware } = require('./middleware/loggerMiddleware')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const yaml = require('js-yaml') // To read the YAML file
const path = require('path')

// Initialize the MQTT service here
require('./services/mqttService')  // Requiring this will start the MQTT service

// Initialize app
const app = express()
app.use(express.json())
app.use(cors())
app.use(loggerMiddleware)


// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api/users', userRoutes) 

// Load the YAML file
const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, 'docs/apiDocs.yaml'), 'utf8'))// Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Serve the API documentation YAML file
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/apiDocs.yaml')) // Adjusted path
})

// Global error handler. Registered after all route definitions
app.use(errorHandler)

module.exports = app