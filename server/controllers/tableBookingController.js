// controllers/bookingController.js

const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, guests } = req.body;
    const userId = req.user.id; // assuming JWT middleware sets req.user

    const newBooking = new Booking({
      userId,
      restaurantId,
      date,
      time,
      guests
    });

    await newBooking.save();
    res.status(201).json({ message: 'Table booked successfully!' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Error booking table' });
  }
};
