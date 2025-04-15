const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns the order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if payment is already completed
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      // Update order payment status
      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'completed';
          await order.save();
        }
      } catch (err) {
        console.error('Error updating order:', err);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedOrderId = failedPayment.metadata.orderId;

      // Update order payment status
      try {
        const order = await Order.findById(failedOrderId);
        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
        }
      } catch (err) {
        console.error('Error updating order:', err);
      }
      break;
  }

  res.json({ received: true });
});

module.exports = router; 