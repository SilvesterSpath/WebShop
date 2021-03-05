import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//router.get('/', getProducts);
router.route('/').get(getProducts);

//router.get('/:id', getProductById);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct);

export default router;
