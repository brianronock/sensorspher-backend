/***********************************************************
    src/controllers/sensorController.js
/********************************************************************************************************
- Purpose: This file handles the logic for managing sensor data, including adding, updating, deleting, and retrieving sensors.
Variables
- `Sensor`: The Mongoose model for sensor data.
- `asyncHandler`: A utility to handle errors in asynchronous functions.
- `Joi`: Used to validate sensor data input.
- `sensorSchema`: A schema created using `Joi` to validate the type and value of a sensor.
Functions:
- `getSensors()`: Fetches all sensor data from the database and returns it in the response.
- `createSensor()`: Validates the sensor data using `Joi`, creates a new sensor, and saves it to the database.
- `deleteSensor()`: Deletes a sensor by its ID after checking if it exists in the database.
- `updateSensor()`: Updates a sensor's data by its ID, ensuring the sensor exists before making updates.

Description:
- The `sensorController` is responsible for managing sensor-related functionalities. It validates the sensor data before saving or updating it in the database and handles the retrieval and deletion of sensor data.
********************************************************************************************************/

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