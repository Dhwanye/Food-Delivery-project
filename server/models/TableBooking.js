//67fdb9cecb15c77ccf29d067
const mongoose = require('mongoose');

const tableBookingSchema = new mongoose.Schema({
  user: {
    type: String,
    default: '67fdb9cecb15c77ccf29d067', // Static user ID as a string
    required: true
  },
  restaurant: {
    type: String,
    default: '67fdc0106ad3ad7f95cfec53', // Static restaurant ID as a string
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate a unique booking reference before saving
tableBookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `BK-${randomString}`;
  }
  next();
});

const TableBooking = mongoose.model('TableBooking', tableBookingSchema);

module.exports = TableBooking;
