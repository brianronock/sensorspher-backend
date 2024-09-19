/***********************************************************
    tests/authErr.test.js
                Edge cases and error handling for Authentication routes.
***********************************************************/

const request = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoURI = mongoServer.getUri()
  await mongoose.connect(mongoURI)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Authentication API Edge Cases', () => {
  it('should return 400 when registering without a name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', '"name" is required') // Joi's error message format
  })

  it('should return 400 when registering without an email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        password: 'password123',
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', '"email" is required')
  })

  it('should return 400 when logging in without a password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', '"password" is required')
  })

  it('should return 401 for invalid login credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'incorrectPassword',
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message', 'Invalid credentials')
  })
})