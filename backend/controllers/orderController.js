import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

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
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
    console.log(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getOrderById };
