import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validateRequest.js';
import {
  productIdParamSchema,
  productListQuerySchema,
  productReviewSchema,
  updateProductSchema,
} from '../validation/productSchemas.js';

const router = express.Router();

//router.get('/', getProducts);
router
  .route('/')
  .get(validateQuery(productListQuerySchema), getProducts)
  .post(protect, admin, createProduct);
router
  .route('/:id/reviews')
  .post(
    protect,
    validateParams(productIdParamSchema),
    validateBody(productReviewSchema),
    createProductReview
  );
router.get('/top', getTopProducts);

//router.get('/:id', getProductById);
router
  .route('/:id')
  .get(validateParams(productIdParamSchema), getProductById)
  .delete(protect, admin, validateParams(productIdParamSchema), deleteProduct)
  .put(
    protect,
    admin,
    validateParams(productIdParamSchema),
    validateBody(updateProductSchema),
    updateProduct
  );

export default router;
