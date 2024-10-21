/***********************************************************
    src/routes/addSensorRoutes.js
/********************************************************************************************************
Summary:
Defines the routes related to managing sensor data, such as retrieving, creating, updating, and deleting sensors.
Key Components:
- `/`: Route to get all sensors (GET) and create a new sensor (POST).
- `/:id`: Route to update (PUT) or delete (DELETE) a sensor by ID.
Context:
- Backend: Handles sensor data operations, connecting sensor inputs to the MongoDB database.
- Whole Project: Essential for tracking sensor data, creating a connection between the IoT devices and your app.

********************************************************************************************************/

const express = require('express')
const { getSensors, createSensor, updateSensor, deleteSensor, fetchSensorById } = require('../controllers/addSensorController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = express.Router()

// Get all sensors for the logged in user (protected route)
router.get('/user', protect, asyncHandler(getSensors))

// Create a new sensor  for the logged in user (protected route)
router.post('/create', protect, asyncHandler(createSensor))

// Get a specific sensor by ID (protected route)
router.get('/:id', protect, asyncHandler(fetchSensorById))

// Update a sensor by ID (protected route)
router.put('/:id', protect, asyncHandler(updateSensor))

// Delete a sensor by ID (protected route)
router.delete('/:id', protect, asyncHandler(deleteSensor))

module.exports = router