import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { setupDatabase, teardownDatabase } from './setup.js';

describe('Order API validation', () => {
  let ownerToken;
  let nonOwnerToken;
  let adminToken;
  let ownerUser;

  const createOrderDoc = async (userId) => {
    return await Order.create({
      user: userId,
      orderItems: [
        {
          name: 'Test Product',
          qty: 1,
          image: '/img/test.png',
          price: 9.99,
          product: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address: '123 Street',
        city: 'Town',
        postalCode: '12345',
        country: 'Country',
      },
      paymentMethod: 'PayPal',
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 9.99,
    });
  };

  beforeAll(async () => {
    await setupDatabase();
    await User.deleteMany({});
    await Order.deleteMany({});

    ownerUser = await User.create({
      name: 'Order User',
      email: 'order-user@test.com',
      password: 'password123',
      isAdmin: false,
    });
    await User.create({
      name: 'Other User',
      email: 'other-user@test.com',
      password: 'password123',
      isAdmin: false,
    });
    await User.create({
      name: 'Order Admin',
      email: 'order-admin@test.com',
      password: 'password123',
      isAdmin: true,
    });

    const ownerLoginRes = await request(app).post('/api/users/login').send({
      email: 'order-user@test.com',
      password: 'password123',
    });
    const nonOwnerLoginRes = await request(app).post('/api/users/login').send({
      email: 'other-user@test.com',
      password: 'password123',
    });
    const adminLoginRes = await request(app).post('/api/users/login').send({
      email: 'order-admin@test.com',
      password: 'password123',
    });

    ownerToken = ownerLoginRes.body.token;
    nonOwnerToken = nonOwnerLoginRes.body.token;
    adminToken = adminLoginRes.body.token;
  });

  afterAll(teardownDatabase);

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  it('returns 400 for malformed order id', async () => {
    const res = await request(app)
      .get('/api/orders/not-an-object-id')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for malformed order create payload', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        orderItems: [],
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for malformed paid update payload', async () => {
    const res = await request(app)
      .put('/api/orders/507f1f77bcf86cd799439011/pay')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        id: 'bad-id',
        status: '',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('allows owner to access own order', async () => {
    const order = await createOrderDoc(ownerUser._id);
    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(order._id.toString());
  });

  it('denies non-owner from accessing another user order', async () => {
    const order = await createOrderDoc(ownerUser._id);
    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${nonOwnerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it('allows admin to access another user order', async () => {
    const order = await createOrderDoc(ownerUser._id);
    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(order._id.toString());
  });

  it('allows owner to mark own order as paid', async () => {
    const order = await createOrderDoc(ownerUser._id);
    const res = await request(app)
      .put(`/api/orders/${order._id}/pay`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        id: order._id.toString(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: 'payer@example.com',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.isPaid).toBe(true);
  });

  it('denies non-owner from marking another user order as paid', async () => {
    const order = await createOrderDoc(ownerUser._id);
    const res = await request(app)
      .put(`/api/orders/${order._id}/pay`)
      .set('Authorization', `Bearer ${nonOwnerToken}`)
      .send({
        id: order._id.toString(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: 'payer@example.com',
        },
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
