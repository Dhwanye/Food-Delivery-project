const TableBooking = require('../models/TableBooking');

exports.createBooking = async (req, res) => {
  try {
    const { date, time, guestCount, specialRequests, contactPhone, contactEmail } = req.body;

    console.log('[Create Booking] Incoming data:', {
      date, time, guestCount, contactPhone, contactEmail,
      user: req.user?.id
    });

    // Static restaurantId and userId (as per the updated schema)
    const restaurantId = '67fdc0106ad3ad7f95cfec53'; // Static restaurant ObjectId
    const userId = 'staticUserId123456'; // Static user ObjectId

    // Check for existing booking
    const existingBooking = await TableBooking.findOne({
      user: userId, // Static user assigned in schema
      restaurant: restaurantId, // Static restaurant assigned in schema
      date: new Date(date),
      time: time
    });

    if (existingBooking) {
      console.warn('[Create Booking] Duplicate booking detected');
      return res.status(400).json({ message: 'You already have a booking at this restaurant for the selected date and time.' });
    }

    // Create new booking
    const booking = new TableBooking({
      user: userId,  // Static user assigned in schema
      restaurant: restaurantId,  // Static restaurant assigned in schema
      date,
      time,
      guestCount,
      specialRequests,
      contactPhone,
      contactEmail
    });

    console.log('[Create Booking] Saving booking:', booking);

    const newBooking = await booking.save();

    console.log('[Create Booking] Booking saved:', newBooking);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('[Create Booking] Error:', error);
    res.status(400).json({ message: error.message });
  }
};
