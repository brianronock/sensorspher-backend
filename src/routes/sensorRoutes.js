/***********************************************************
    src/routes/sensorRoutes.js
                This file defines the routes related to
                managing sensor data.
***********************************************************/

const express = require('express')
const { getSensors, createSensor, updateSensor, deleteSensor } = require('../controllers/sensorController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/asyncHandler')

const router = express.Router()

// Get all sensors (protected route)
router.get('/', protect, asyncHandler(getSensors))

// Create a new sensor (protected route)
router.post('/', protect, asyncHandler(createSensor))

// Update a sensor by ID (protected route)
router.put('/:id', protect, asyncHandler(updateSensor))

// Delete a sensor by ID (protected route)
router.delete('/:id', protect, asyncHandler(deleteSensor))

module.exports = router