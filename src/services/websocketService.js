const { Server } = require('socket.io');

// Initialize WebSocket server with CORS allowed
const io = new Server(3000, {  // Make sure the WebSocket server runs on the right port (your backend server port)
  cors: {
    origin: 'http://localhost:3001',  // Allow requests from your frontend's URL
    methods: ['GET', 'POST'],  // Allow these methods
  }
});

io.on('connection', (socket) => {
  console.log('WebSocket connection established:', socket.id);

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id);
  });
});

const broadcastSensorData = (data) => {
  io.emit('sensorData', data);  // Broadcast data to all connected WebSocket clients
};

module.exports = { broadcastSensorData };