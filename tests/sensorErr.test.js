const request = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer
let token

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoURI = mongoServer.getUri()
  await mongoose.connect(mongoURI)

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Sensor User',
      email: 'sensor@example.com',
      password: 'password123',
    })
  
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'sensor@example.com',
      password: 'password123',
    })

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error('Login failed, no token received')
  }

  token = loginRes.body.token
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Sensor API Edge Cases', () => {
  it('should return 400 when creating a sensor with missing type', async () => {
    const res = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        value: 22.5,
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', '"type" is required')
  })

  it('should return 401 when trying to create a sensor without authentication', async () => {
    const res = await request(app)
      .post('/api/sensors')
      .send({
        type: 'temperature',
        value: 22.5,
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message', 'Not authorized, no token')
  })

  it('should return 404 when updating a non-existent sensor', async () => {
    const invalidSensorId = new mongoose.Types.ObjectId() // Correcting ObjectId usage
    const res = await request(app)
      .put(`/api/sensors/${invalidSensorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'temperature',
        value: 23.5,
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('message', 'Sensor not found')
  })

  it('should return 404 when deleting a non-existent sensor', async () => {
    const invalidSensorId = new mongoose.Types.ObjectId() // Correcting ObjectId usage
    const res = await request(app)
      .delete(`/api/sensors/${invalidSensorId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('message', 'Sensor not found')
  })
})