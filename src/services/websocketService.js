/***********************************************************
    src/services/webSocketService.js
/********************************************************************************************************
Summary:
This file creates a WebSocket server using `Socket.io` for real-time communication with frontend clients.
Key Components:
- `Server`: Initializes a WebSocket server on port `3000`, allowing connections from the frontend at `localhost:3001`.
- `on('connection')`: Listens for new WebSocket connections and logs when users connect or disconnect.
- `broadcastSensorData`: Broadcasts sensor data to all connected WebSocket clients, used to send real-time updates to the frontend.
Context:
- Backend: Essential for enabling real-time communication with the frontend.
- Whole Project: Keeps the frontend in sync with backend changes, particularly for sensor data and live feed posts.
********************************************************************************************************/

const { Server } = require('socket.io')

// Initialize WebSocket server with CORS allowed
const io = new Server(3000, {  // WebSocket server should run on the right port (the backend server port)
  cors: {
    origin: 'http://localhost:3001',  // Allow requests from the frontend's URL
    methods: ['GET', 'POST'],  // Allow these methods
  }
})

io.on('connection', (socket) => {
  console.log('WebSocket connection established:', socket.id)

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id)
  })
})

const broadcastSensorData = (data) => {
  io.emit('sensorData', data)  // Broadcast data to all connected WebSocket clients
}

module.exports = { broadcastSensorData }