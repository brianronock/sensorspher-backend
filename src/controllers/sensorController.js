/***********************************************************
    src/controllers/sensorController.js
                This file handles the logic for sensors.
***********************************************************/

const Sensor = require('../models/Sensor')
const { asyncHandler } = require('../utils/asyncHandler')
const Joi = require('joi')

// Validation schema for sensors
const sensorSchema = Joi.object({
  type: Joi.string().required(),
  value: Joi.number().required(),
})

// Get all sensors
const getSensors = asyncHandler(async (req, res) => {
  const sensors = await Sensor.find()
  res.json(sensors)
})

// Create a new sensor
const createSensor = asyncHandler(async (req, res) => {
  const { error } = sensorSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const sensor = await Sensor.create(req.body)
  res.status(201).json(sensor)
})

// Delete a sensor
const deleteSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findById(req.params.id)
  if (!sensor) {
    return res.status(404).json({ message: 'Sensor not found' })  // Directly return 404 response
  }
  await sensor.remove()
  res.json({ message: 'Sensor removed' })
})

// Update a sensor
const updateSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findById(req.params.id)
  if (!sensor) {
    return res.status(404).json({ message: 'Sensor not found' })  // Directly return 404 response
  }
  const updatedSensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedSensor)
})

module.exports = { getSensors, createSensor, updateSensor, deleteSensor }