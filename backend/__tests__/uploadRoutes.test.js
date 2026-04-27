import fs from 'fs/promises';
import path from 'path';
import request from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';
import { setupDatabase, teardownDatabase } from './setup.js';

const cleanupUploadedFile = async (relativePath) => {
  if (!relativePath) return;

  const normalized = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath;
  const absolutePath = path.join(process.cwd(), normalized);

  try {
    await fs.unlink(absolutePath);
  } catch {
    // Best-effort cleanup for test artifacts.
  }
};

describe('Upload API', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await setupDatabase();
    await User.deleteMany({});

    await User.create({
      name: 'Upload Admin',
      email: 'upload-admin@test.com',
      password: 'password123',
      isAdmin: true,
    });

    await User.create({
      name: 'Upload User',
      email: 'upload-user@test.com',
      password: 'password123',
      isAdmin: false,
    });

    const adminLogin = await request(app).post('/api/users/login').send({
      email: 'upload-admin@test.com',
      password: 'password123',
    });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app).post('/api/users/login').send({
      email: 'upload-user@test.com',
      password: 'password123',
    });
    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it('denies unauthenticated upload requests', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('image', Buffer.from('fake-image-content'), {
        filename: 'image.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(401);
  });

  it('denies authenticated non-admin upload requests', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('image', Buffer.from('fake-image-content'), {
        filename: 'image.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(401);
  });

  it('allows authenticated admin upload requests', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', Buffer.from('fake-image-content'), {
        filename: 'image.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/^\/uploads[\\/]/);
    await cleanupUploadedFile(res.text);
  });

  it('rejects files with invalid mime type', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', Buffer.from('not-an-image'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/images only/i);
  });

  it('rejects oversized files', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', Buffer.alloc(2 * 1024 * 1024 + 1, 1), {
        filename: 'big.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/file too large/i);
  });
});
