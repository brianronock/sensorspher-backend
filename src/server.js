/***********************************************************
    src/server.js
/********************************************************************************************************
Summary:
This file creates the HTTP server and WebSocket server, and connects to the MongoDB database.
Key Components:
- HTTP Server: Uses Express app and WebSocket (Socket.io) for real-time communication.
- MongoDB Connection: Connects to the MongoDB database using the `connectDB` function from `db.js`.
- WebSocket: Initializes WebSocket server and integrates it with the MQTT service.
Context:
- Backend: Bootstraps the entire backend, bringing together the database, server, and real-time communication.
- Whole Project: It powers the entire project by handling incoming requests and managing WebSocket connections for real-time features.
********************************************************************************************************/

const http = require('http')
const app = require('./app')
const connectDB = require('./config/db')
const { Server } = require('socket.io') // Import Socket.io
const { initSocket } = require('./services/mqttService')  // Import initSocket from MQTT service

// Connect to MongoDB
connectDB()

// Create HTTP server for WebSocket and Express to share
const server = http.createServer(app)

// Initialize Socket.io with CORS allowed from frontend
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',  // frontend URL
    methods: ['GET', 'POST'],
  }
})


// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`WebSocket connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`WebSocket disconnected: ${socket.id}`)
  })
})

// Middleware for using `io` in the controllers
app.use((req, res, next) => {
  req.io = io  // Attach the `io` instance to the `req` object
  next()
})

// Pass the io instance to the MQTT service
require('./services/mqttService').initSocket(io) // Pass the io instance

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

