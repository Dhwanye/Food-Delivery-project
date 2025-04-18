const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurant: { // ✅ For frontend display
    type: String,
    required: true
  },
  rating: { // ✅ Optional, for display
    type: Number,
    default: 0
  },
  tags: [String], // ✅ Like ['non-veg', 'spicy']
  discount: String, // ✅ Example: "₹125 OFF ABOVE ₹349"
  isVeg: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: { // ✅ For Featured section
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
