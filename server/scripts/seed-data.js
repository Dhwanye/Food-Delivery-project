const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant'); // adjust path if needed
const User = require('../models/user'); // assuming you have a User model

// Replace with your MongoDB URI
const MONGO_URI = 'mongodb+srv://dhwani22:dhwani22@cluster0.p62ch.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🌱 Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seed() {
  try {
    const owner = await User.findOne(); // Just grab the first user as the owner
    if (!owner) {
      throw new Error('No user found to assign as restaurant owner');
    }

    const restaurantData = {
      name: 'Spicy Curry House',
      description: 'Delicious and authentic Indian food.',
      cuisine: 'Indian',
      address: {
        street: '123 Masala Street',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380015',
      },
      phone: '9876543210',
      email: 'contact@spicycurryhouse.com',
      imageUrl: 'https://example.com/images/spicy-curry.jpg',
      rating: 4.5,
      reviewCount: 127,
      deliveryTime: '30-40 mins',
      minOrder: 200,
      deliveryFee: 30,
      menu: [
        {
          name: 'Paneer Butter Masala',
          description: 'Creamy tomato gravy with soft paneer cubes.',
          price: 180,
          category: 'Main Course',
          image: 'https://example.com/images/paneer.jpg',
          isAvailable: true,
        },
        {
          name: 'Garlic Naan',
          description: 'Tandoori naan topped with garlic and butter.',
          price: 40,
          category: 'Bread',
          image: 'https://example.com/images/garlic-naan.jpg',
          isAvailable: true,
        },
        {
          name: 'Mango Lassi',
          description: 'Sweet mango yogurt smoothie.',
          price: 60,
          category: 'Beverages',
          image: 'https://example.com/images/mango-lassi.jpg',
          isAvailable: true,
        }
      ],
      owner: owner._id,
      isActive: true
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    console.log('✅ Restaurant seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding restaurant:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
