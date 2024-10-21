/***********************************************************
    src/controllers/addSensorController.js
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
- The `addSensorController` is responsible for managing sensor-related functionalities. It validates the sensor data before saving or updating it in the database and handles the retrieval and deletion of sensor data.
********************************************************************************************************/

const AddSensor = require('../models/addSensor')
const { asyncHandler } = require('../utils/asyncHandler')
const Joi = require('joi')

// Validation schema for sensors
const addSensorSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  value: Joi.number().optional(),
  ownerId: Joi.string().required(),
})

// Get all sensors for the currently logAed in user
const getSensors = asyncHandler(async (req, res) => {
  const sensors = await AddSensor.find( { ownerId: req.user._id }) // Find only the sensors owned by the logged in user
  res.json(sensors)
})

// Create a new sensor for the loggen in user
const createSensor = asyncHandler(async (req, res) => {
  const { error } = addSensorSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const { name, type } = req.body

  const newSensor = new AddSensor({
    name,
    type, 
    ownerId: req.user ? req.user._id : 'fakeOwnerIdForDebugging', // automatically associate the new sensor with the logged in user
  })

  const sensor = await newSensor.save()
  res.status(201).json(sensor)
})

// Fetch sensor by ID and ensure it belongs to the logged-in user
const fetchSensorById = asyncHandler(async (req, res) => {
  const sensor = await AddSensor.findById(req.params.id)
  if(!sensor || (sensor.ownerId.toString() !== req.user._id.toString()) ) {
    return res.status(404).json({ message: 'Sensor not found or not authorized '})
  }
  res.json(sensor)
})

// Delete a sensor (owned by the logged in user)
const deleteSensor = asyncHandler(async (req, res) => {
  const sensor = await AddSensor.findById(req.params.id)
  if(!sensor || (sensor.ownerId.toString() !== req.user._id.toString()) ) {
    return res.status(404).json({ message: 'Sensor not found or not authorized '})
  }
  await sensor.remove()
  res.json({ message: 'Sensor removed' })
})

// Update a sensor
const updateSensor = asyncHandler(async (req, res) => {
  const sensor = await AddSensor.findById(req.params.id)
  if(!sensor || (sensor.ownerId.toString() !== req.user._id.toString()) ) {
    return res.status(404).json({ message: 'Sensor not found or not authorized '})
  }
  const updatedSensor = await AddSensor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedSensor)
})

module.exports = { getSensors, createSensor, updateSensor, deleteSensor, fetchSensorById }