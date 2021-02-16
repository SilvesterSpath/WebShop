import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new Order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMehtod,
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
      paymentMehtod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
  }

  const createdOrder = await order.save(); //these lines save the data to the database
  res.status(201).json(createdOrder);
});

export { addOrderItems };
