/***********************************************************
    src/models/Sensor.js
                This file defines the MongoDB model for
                sensors.
***********************************************************/

const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Sensor = mongoose.model('Sensor', sensorSchema)

module.exports = Sensor