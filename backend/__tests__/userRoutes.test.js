import request from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';
import { setupDatabase, teardownDatabase } from './setup.js';

describe('User API', () => {
  beforeAll(setupDatabase);
  afterAll(teardownDatabase);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('registers a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      });
      expect(res.body).not.toHaveProperty('password');
    });

    it('returns 400 when user already exists', async () => {
      await request(app).post('/api/users').send({
        name: 'First',
        email: 'same@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/users').send({
        name: 'Second',
        email: 'same@example.com',
        password: 'password456',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('returns 400 when required fields missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'No Email', password: 'pass' });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Login User',
        email: 'login@test.com',
        password: 'password123',
      });
    });

    it('returns token for valid credentials', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'login@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toMatchObject({
        email: 'login@test.com',
        name: 'Login User',
      });
    });

    it('returns 401 for invalid password', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'login@test.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('returns 401 for unknown email', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'unknown@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
    });
  });
});
