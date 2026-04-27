import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { logSecurityEvent } from '../utils/securityLogger.js';

const canAccessOrder = (order, user) => {
  if (!order || !user) return false;
  if (user.isAdmin) return true;

  const orderOwnerId =
    order.user && order.user._id ? order.user._id.toString() : order.user.toString();
  const requesterId = user._id.toString();

  return orderOwnerId === requesterId;
};

// @desc    Create new Order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save(); //these lines save the data to the database
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   POST /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    //here we gat the id from the url
    'user',
    'name email'
  );
  if (order) {
    if (!canAccessOrder(order, req.user)) {
      logSecurityEvent('warn', 'order.access_forbidden', {
        route: req.originalUrl,
        method: req.method,
        orderId: req.params.id,
        userId: req.user?._id?.toString(),
        reason: 'owner_or_admin_required',
      });
      res.status(403);
      throw new Error('Not authorized to access this order');
    }
    res.json(order);
    //console.log(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (!canAccessOrder(order, req.user)) {
      logSecurityEvent('warn', 'order.pay_forbidden', {
        route: req.originalUrl,
        method: req.method,
        orderId: req.params.id,
        userId: req.user?._id?.toString(),
        reason: 'owner_or_admin_required',
      });
      res.status(403);
      throw new Error('Not authorized to update this order');
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    logSecurityEvent('info', 'order.paid_updated', {
      route: req.originalUrl,
      method: req.method,
      orderId: updatedOrder._id.toString(),
      userId: req.user?._id?.toString(),
      isAdmin: Boolean(req.user?.isAdmin),
      isPaid: updatedOrder.isPaid,
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Fetch all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
