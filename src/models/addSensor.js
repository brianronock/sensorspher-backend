/***********************************************************
    src/models/addSensor.js
/********************************************************************************************************
- Purpose: Defines the MongoDB schema and model for sensor data.
Variables
- `mongoose`: The MongoDB ODM used to define the schema and model for the sensors.
Functions:
- `sensorSchema`: The schema defines the structure of a sensor document:
  - `type`: A string representing the type of sensor (e.g., temperature, humidity), required and limited to predefined values using an enum.
  - `value`: A number representing the sensor's reading, required and with an optional minimum value.
  - `timestamp`: The date when the sensor data was created, set to the current date by default.
- `Sensor`: The Mongoose model for sensors, based on the `sensorSchema`.
Description:
- This file defines how sensor data is stored in MongoDB. Each sensor has a type, a value, and a timestamp to record when the reading was taken.

********************************************************************************************************/

const { required } = require('joi')
const mongoose = require('mongoose')

const addSensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'humidity', 'pressure', 'other'],
    },
    value: {
        type: Number,
        // required: true,
        // min: 0, // minimum value of sensor reading
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the user who owns this sensor
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const AddSensor = mongoose.model('AddSensor', addSensorSchema)

module.exports = AddSensor