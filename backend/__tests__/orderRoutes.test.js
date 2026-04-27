import request from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';
import { setupDatabase, teardownDatabase } from './setup.js';

describe('Order API validation', () => {
  let userToken;

  beforeAll(async () => {
    await setupDatabase();
    await User.deleteMany({});

    await User.create({
      name: 'Order User',
      email: 'order-user@test.com',
      password: 'password123',
      isAdmin: false,
    });

    const loginRes = await request(app).post('/api/users/login').send({
      email: 'order-user@test.com',
      password: 'password123',
    });

    userToken = loginRes.body.token;
  });

  afterAll(teardownDatabase);

  it('returns 400 for malformed order id', async () => {
    const res = await request(app)
      .get('/api/orders/not-an-object-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for malformed order create payload', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        orderItems: [],
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for malformed paid update payload', async () => {
    const res = await request(app)
      .put('/api/orders/507f1f77bcf86cd799439011/pay')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        id: 'bad-id',
        status: '',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
