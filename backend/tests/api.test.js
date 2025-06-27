const request = require('supertest');
const app = require('../app'); // Your Express app
const { User, Post, Comment } = require('../models');

let authToken = '';
let testPostId = '';
let testCommentId = '';

beforeAll(async () => {
  // Clear test data
  await Comment.destroy({ where: {} });
  await Post.destroy({ where: {} });
  await User.destroy({ where: {} });
});

afterAll(async () => {
  // Cleanup
  await Comment.destroy({ where: {} });
  await Post.destroy({ where: {} });
  await User.destroy({ where: {} });
});

describe('Blog API Tests', () => {
  // Authentication Tests
  describe('Authentication', () => {
    test('POST /api/auth/register - should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('POST /api/auth/login - should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      authToken = res.headers['set-cookie'][0];
    });

    test('GET /api/auth/profile - should get user profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'testuser');
    });

    test('POST /api/auth/logout - should logout user', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });

  // Posts Tests
  describe('Posts', () => {
    beforeAll(async () => {
      // Re-login to get fresh token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      authToken = res.headers['set-cookie'][0];
    });

    test('POST /api/posts - should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Cookie', authToken)
        .send({
          title: 'Test Post',
          content: 'This is a test post content'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', 'Test Post');
      testPostId = res.body.id;
    });

    test('GET /api/posts - should get all posts', async () => {
      const res = await request(app)
        .get('/api/posts');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/posts/:id - should get single post', async () => {
      const res = await request(app)
        .get(`/api/posts/${testPostId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', testPostId);
    });

    test('PUT /api/posts/:id - should update post', async () => {
      const res = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Cookie', authToken)
        .send({
          title: 'Updated Test Post'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', 'Updated Test Post');
    });

    test('DELETE /api/posts/:id - should delete post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .set('Cookie', authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post removed');
    });
  });

  // Comments Tests
  describe('Comments', () => {
    beforeAll(async () => {
      // Create a test post
      const postRes = await request(app)
        .post('/api/posts')
        .set('Cookie', authToken)
        .send({
          title: 'Test Post for Comments',
          content: 'Content for comments'
        });
      testPostId = postRes.body.id;
    });

    test('POST /api/:postId/comments - should add comment to post', async () => {
      const res = await request(app)
        .post(`/api/${testPostId}/comments`)
        .set('Cookie', authToken)
        .send({
          content: 'This is a test comment'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('content', 'This is a test comment');
      testCommentId = res.body.id;
    });

    test('GET /api/:postId/comments - should get comments for post', async () => {
      const res = await request(app)
        .get(`/api/${testPostId}/comments`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});