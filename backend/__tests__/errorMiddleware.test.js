import { jest } from '@jest/globals';
import { errorHandler } from '../middleware/errorMiddleware.js';

const createMockRes = (statusCode = 200) => {
  const res = {
    statusCode,
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
};

describe('errorHandler leakage controls', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('hides stack and message details for production 500 responses', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('Database connection failed: internal-host');
    const res = createMockRes(500);

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });

  it('includes debug stack in non-production responses', () => {
    process.env.NODE_ENV = 'test';
    const err = new Error('Debug-visible failure');
    const res = createMockRes(500);

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Debug-visible failure',
      stack: err.stack,
    });
  });
});
