/***********************************************************
    src/models/Sensor.js
                This file defines the MongoDB model for
                sensors.
***********************************************************/

const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'humidity', 'pressure', 'other'], // Predefine valid sensor types
  },
  value: {
    type: Number,
    required: true,
    min: 0, // You can set a minimum value if relevant
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Sensor = mongoose.model('Sensor', sensorSchema)

module.exports = Sensor