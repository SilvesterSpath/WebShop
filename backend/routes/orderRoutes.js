import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateBody, validateParams } from '../middleware/validateRequest.js';
import {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderToPaidSchema,
} from '../validation/orderSchemas.js';

const router = express.Router();

router
  .route('/')
  .post(protect, validateBody(createOrderSchema), addOrderItems)
  .get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, validateParams(orderIdParamSchema), getOrderById);
router
  .route('/:id/pay')
  .put(
    protect,
    validateParams(orderIdParamSchema),
    validateBody(updateOrderToPaidSchema),
    updateOrderToPaid
  );
router
  .route('/:id/deliver')
  .put(protect, admin, validateParams(orderIdParamSchema), updateOrderToDelivered);

export default router;
