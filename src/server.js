const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io'); // Import Socket.io
const { initSocket } = require('./services/mqttService');  // Import initSocket from MQTT service

// Connect to MongoDB
connectDB();

// Create HTTP server for WebSocket and Express to share
const server = http.createServer(app);

// Initialize Socket.io with CORS allowed from frontend
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',  // Your frontend URL
    methods: ['GET', 'POST'],
  }
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`WebSocket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`WebSocket disconnected: ${socket.id}`);
  });
});

// Pass the io instance to the MQTT service
require('./services/mqttService').initSocket(io); // Pass the io instance

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});