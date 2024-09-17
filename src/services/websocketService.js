/***********************************************************
    src/services/websocketService.js
                This service handles WebSocket connections
                for real-time data transmission.
***********************************************************/

const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 8080 })

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established')

  ws.on('message', (message) => {
    console.log('Received:', message)
  })

  ws.on('close', () => {
    console.log('WebSocket connection closed')
  })
})

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

module.exports = { broadcastMessage }