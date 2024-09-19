/***********************************************************
    tests/feed.test.js
    Tests for valid Feed routes (happy path).
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

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'feed@example.com',
      password: 'password123',
    });

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error('Login failed, no token received');
  }

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Feed API', () => {
  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/feed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a valid test post',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('content', 'This is a valid test post');
    expect(res.body).toHaveProperty('user');
  });

  it('should get all posts', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


  it('should update an existing post', async () => {
    // Create a post first
    const postRes = await request(app)
      .post('/api/feed')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Original post content' });


    const postId = postRes.body._id;
    console.log('Post ID to be updated:', postId);

    // Now update the post
    const res = await request(app)
      .put(`/api/feed/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Updated post content' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', postId);
    expect(res.body).toHaveProperty('content', 'Updated post content');
  });

  it('should delete a post', async () => {
    // Create a post to delete
    const postRes = await request(app)
      .post('/api/feed')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Post to be deleted' });
  
    const postId = postRes.body._id;
    console.log('Post ID to be deleted:', postId);
  
    // Now delete the post
    const res = await request(app)
      .delete(`/api/feed/${postId}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Post removed');
  
    // Check that the post is really gone
    const checkRes = await request(app)
      .get(`/api/feed/${postId}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(checkRes.statusCode).toEqual(404);
  });
  
});