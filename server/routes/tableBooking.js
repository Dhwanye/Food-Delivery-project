const express = require('express');
const router = express.Router();
const TableBooking = require('../models/TableBooking');
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');
const tableBookingController = require('../controllers/tableBookingController');

// Create a new booking
router.post('/', auth, tableBookingController.createBooking);

// Get all bookings for a user
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await TableBooking.find({ user: req.user.userId })
      .populate('restaurant', 'name imageUrl address')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings for a restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }
    
    const bookings = await TableBooking.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email phone')
      .sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching restaurant bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new booking

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await TableBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Verify permission: either the user who made the booking or the restaurant owner
    const restaurant = await Restaurant.findById(booking.restaurant);
    if (booking.user.toString() !== req.user.userId && 
        restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    booking.status = status;
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await TableBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only the user who made the booking can delete it
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    // Only allow cancellation for future bookings
    const bookingDate = new Date(booking.date);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Cannot delete a past booking' });
    }
    
    await booking.remove();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 