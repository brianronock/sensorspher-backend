/***********************************************************
    tests/feed.test.js
                Edge cases and error handling for Feed routes.
***********************************************************/

const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let token;

beforeAll(async () => {
  // Setup in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoURI = mongoServer.getUri();

  await mongoose.connect(mongoURI);

  // Register and login to get a JWT token for protected routes
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Feed User',
      email: 'feed@example.com',
      password: 'password123',
    });

    console.log('Register response:', registerRes.body) // Debug registration response


  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'feed@example.com',
      password: 'password123',
    });

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error('Login failed, no token received'); // Ensure login was successful
  }

  token = loginRes.body.token; // Store the valid token for future requests
  console.log('Generated JWT token for sensors:', token) // Debugging log

});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Feed API Edge Cases', () => {
  it('should return 400 when creating a post with missing content', async () => {
    const res = await request(app)
      .post('/api/feed')
      .set('Authorization', `Bearer ${token}`)
      .send({});
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', '"content" is required');
  });

  it('should return 401 when trying to create a post without authentication', async () => {
    const res = await request(app)
      .post('/api/feed')
      .send({ content: 'This is a test post' }); // No token sent
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token');
  });

  it('should return 404 when deleting a non-existent post', async () => {
    const res = await request(app)
      .delete('/api/feed/invalidPostId')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Post not found');
  });
});