/***********************************************************
    tests/sensor.test.js
                Tests for the Sensor routes using 
                mongodb-memory-server.
***********************************************************/

const request = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer
let token // Declare token outside the beforeAll block

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoURI = mongoServer.getUri()

  await mongoose.connect(mongoURI)

  // Register and login to get a JWT token for protected routes
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Sensor User',
      email: 'sensor@example.com',
      password: 'password123',
    })

  console.log('Register response:', registerRes.body) // Debug registration response

  if (registerRes.statusCode !== 201) {
    throw new Error('User registration failed') // Ensure registration was successful
  }

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'sensor@example.com',
      password: 'password123',
    })

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error('Login failed, no token received') // Ensure login was successful
  }

  token = loginRes.body.token // Store the valid token
  console.log('Generated JWT token for sensors:', token) // Debugging log
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Sensor API', () => {
  it('should create a new sensor', async () => {
    const res = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`) // Ensure correct token format
      .send({
        type: 'temperature',
        value: 22.5,
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('type', 'temperature')
  })

  it('should get all sensors', async () => {
    const res = await request(app)
      .get('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})