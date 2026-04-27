import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      logSecurityEvent('warn', 'auth.token_verification_failed', {
        route: req.originalUrl,
        method: req.method,
        reason: 'token_failed',
        hasAuthHeader: Boolean(req.headers.authorization),
      });
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    logSecurityEvent('warn', 'auth.missing_token', {
      route: req.originalUrl,
      method: req.method,
      reason: 'no_token',
      hasAuthHeader: Boolean(req.headers.authorization),
    });
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    logSecurityEvent('warn', 'auth.admin_check_failed', {
      route: req.originalUrl,
      method: req.method,
      userId: req.user?._id?.toString(),
      reason: 'not_admin',
    });
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
