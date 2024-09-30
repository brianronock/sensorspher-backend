/***********************************************************
    src/services/mqttService.js
/********************************************************************************************************
Summary:
This file handles MQTT messaging and integrates WebSocket broadcasting for sensor data. MQTT is a lightweight messaging protocol, often used for IoT, which listens to sensor data topics and stores that data in a MongoDB database. It also broadcasts the data via WebSocket to any connected frontend clients.
Key Components:
- `client`: MQTT client that connects to an MQTT broker.
- `on('connect')`: Event listener for when the client connects to the MQTT broker. Subscribes to two topics: `sensors/temperature` and `sensors/humidity`.
- `on('message')`: Event listener that triggers when a message is received from the subscribed MQTT topics. Based on the topic, it creates a sensor object (either temperature or humidity), stores it in MongoDB, and broadcasts the data to WebSocket clients.
- `initSocket`: Initializes a `Socket.io` WebSocket instance, enabling real-time communication between the server and frontend.
Context:
- In the backend, it acts as the bridge between sensor devices (through MQTT) and real-time communication (via WebSocket).
- In the whole project, it allows sensor data to be captured and immediately displayed in real-time on a frontend interface via WebSocket.
********************************************************************************************************/

const mqtt = require('mqtt')
const Sensor = require('../models/Sensor')  // Sensor model from database

let io  // Socket.io instance placeholder

// MQTT client connection
const client = mqtt.connect(process.env.MQTT_BROKER_URL)

client.on('connect', () => {
  console.log('Connected to MQTT broker')

  // Subscribe to relevant topics
  client.subscribe('sensors/temperature')
  client.subscribe('sensors/humidity')
})

client.on('message', async (topic, message) => {
  // console.log(message.toString())
  let type = ''
  if (topic === 'sensors/temperature') {
    type = 'temperature'
  } else if (topic === 'sensors/humidity') {
    type = 'humidity'
  }

  if (type) {
    const sensorData = {
      type,
      value: parseFloat(message.toString()),
    }

    try {
      // Store the data in MongoDB
      const sensor = new Sensor(sensorData)
      await sensor.save()

      // Emit the sensor data via WebSocket
      if (io) {
        io.emit('sensorData', sensorData)  // Broadcast to all WebSocket clients
      }

    } catch (error) {
      console.error(`Failed to save sensor data:`, error)
    }
  }
})

// Initialize Socket.io in the service
const initSocket = (socketIo) => {
  io = socketIo  // Assign the passed Socket.io instance to io
}

module.exports = { initSocket }