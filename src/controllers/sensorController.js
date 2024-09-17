/***********************************************************
    src/controllers/sensorController.js
                This file handles logic for sensor-related
                operations, now using asyncHandler.
***********************************************************/

const Sensor = require('../models/Sensor')

// Get all sensors
const getSensors = async (req, res) => {
  const sensors = await Sensor.find()
  res.json(sensors)
}

// Create a new sensor
const createSensor = async (req, res) => {
  const sensor = await Sensor.create(req.body)
  res.status(201).json(sensor)
}

// Update a sensor
const updateSensor = async (req, res) => {
  const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!sensor) {
    res.status(404)
    throw new Error('Sensor not found')
  }
  res.json(sensor)
}

// Delete a sensor
const deleteSensor = async (req, res) => {
  const sensor = await Sensor.findByIdAndDelete(req.params.id)
  if (!sensor) {
    res.status(404)
    throw new Error('Sensor not found')
  }
  res.json({ message: 'Sensor removed' })
}

module.exports = { getSensors, createSensor, updateSensor, deleteSensor }