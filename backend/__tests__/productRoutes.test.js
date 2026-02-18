import request from 'supertest';
import app from '../app.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { setupDatabase, teardownDatabase } from './setup.js';

describe('Product API', () => {
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    await setupDatabase();
    adminUser = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      isAdmin: true,
    });
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = loginRes.body.token;
  });

  afterAll(teardownDatabase);

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('returns empty list when no products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.products).toHaveLength(0);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pages');
    });

    it('returns products and pagination', async () => {
      await Product.create([
        {
          name: 'Product 1',
          price: 10,
          image: '/img1.jpg',
          brand: 'Brand',
          category: 'Category',
          description: 'Desc',
          user: adminUser._id,
        },
        {
          name: 'Product 2',
          price: 20,
          image: '/img2.jpg',
          brand: 'Brand',
          category: 'Category',
          description: 'Desc',
          user: adminUser._id,
        },
      ]);

      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.products[0]).toMatchObject({ name: 'Product 1', price: 10 });
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns 404 for invalid id', async () => {
      const res = await request(app).get(
        '/api/products/507f1f77bcf86cd799439011'
      );
      expect(res.status).toBe(404);
    });

    it('returns product when id is valid', async () => {
      const product = await Product.create({
        name: 'Single Product',
        price: 99,
        image: '/img.jpg',
        brand: 'Brand',
        category: 'Category',
        description: 'Desc',
        user: adminUser._id,
      });

      const res = await request(app).get(`/api/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: 'Single Product',
        price: 99,
      });
    });
  });

  describe('GET /api/products/top', () => {
    it('returns top products', async () => {
      await Product.create({
        name: 'Top Product',
        price: 1,
        image: '/x.jpg',
        brand: 'B',
        category: 'C',
        description: 'D',
        rating: 5,
        user: adminUser._id,
      });

      const res = await request(app).get('/api/products/top');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/products', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).post('/api/products').send({});
      expect(res.status).toBe(401);
    });

    it('creates product when admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: 'Sample name',
        price: 0,
        brand: 'Sample brand',
      });
    });
  });
});
