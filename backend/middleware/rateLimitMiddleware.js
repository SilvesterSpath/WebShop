import rateLimit from 'express-rate-limit';

const jsonHandler = (req, res) => {
  res.status(429).json({ message: 'Too many requests, please try again later.' });
};

const skipInTest = () => process.env.NODE_ENV === 'test';

const sharedOptions = {
  handler: jsonHandler,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
};

export const authLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  max: 10,
});

export const apiLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export const adminLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  max: 30,
});
