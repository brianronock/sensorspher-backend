/***********************************************************
    tests/auth.test.js
                Tests for the Authentication routes 
                using mongodb-memory-server.
***********************************************************/

const request = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer
let token // Make sure token is declared outside

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

describe('Authentication API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('token')
  })

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')
  })
})