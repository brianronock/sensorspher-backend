const mqtt = require('mqtt');
const Sensor = require('../models/Sensor');  // Assuming you're using this model for database

let io;  // Socket.io instance placeholder

// MQTT client connection
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to relevant topics
  client.subscribe('sensors/temperature');
  client.subscribe('sensors/humidity');
});

client.on('message', async (topic, message) => {
  // console.log(message.toString())
  let type = '';
  if (topic === 'sensors/temperature') {
    type = 'temperature';
  } else if (topic === 'sensors/humidity') {
    type = 'humidity';
  }

  if (type) {
    const sensorData = {
      type,
      value: parseFloat(message.toString()),
    };

    try {
      // Store the data in MongoDB
      const sensor = new Sensor(sensorData);
      await sensor.save();

      // Emit the sensor data via WebSocket
      if (io) {
        io.emit('sensorData', sensorData);  // Broadcast to all WebSocket clients
      }

    } catch (error) {
      console.error(`Failed to save sensor data:`, error);
    }
  }
});

// Initialize Socket.io in the service
const initSocket = (socketIo) => {
  io = socketIo;  // Assign the passed Socket.io instance to io
};

module.exports = { initSocket };