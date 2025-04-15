const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      totalAmount += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        name: menuItem.name,
      });
    }

    // Add delivery fee
    totalAmount += restaurant.deliveryFee;

    // Create order
    const order = new Order({
      user: req.user.userId,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee: restaurant.deliveryFee,
      deliveryAddress,
      paymentMethod,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get restaurant's orders
router.get('/restaurant-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.restaurantId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.restaurant.toString() !== req.user.restaurantId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 