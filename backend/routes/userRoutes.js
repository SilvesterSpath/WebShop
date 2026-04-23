import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';
import {
  registerUserSchema,
  loginUserSchema,
  updateProfileSchema,
} from '../validation/userSchemas.js';

const router = express.Router();

router
  .route('/')
  .post(authLimiter, validateBody(registerUserSchema), registerUser)
  .get(protect, admin, getUsers);
router.post('/login', authLimiter, validateBody(loginUserSchema), authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateBody(updateProfileSchema), updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
