const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const User = require('../models/user');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const TableBooking = require('../models/TableBooking');

// Get database statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access database stats' });
    }

    // Get counts from each collection
    const stats = {
      users: await User.countDocuments(),
      restaurants: await Restaurant.countDocuments(),
      orders: await Order.countDocuments(),
      menuItems: await MenuItem.countDocuments(),
      tableBookings: await TableBooking.countDocuments()
    };

    // Get additional order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Format the order stats
    const formattedOrderStats = {};
    orderStats.forEach(stat => {
      formattedOrderStats[stat._id] = {
        count: stat.count,
        revenue: stat.totalRevenue
      };
    });

    // Get restaurant cuisine types
    const cuisineTypes = await Restaurant.distinct('cuisine');
    
    // Return the full stats object
    res.json({
      collections: stats,
      orderStatsByStatus: formattedOrderStats,
      cuisineTypes,
      databaseName: 'Food_Delivery',
      connectionStatus: 'Connected'
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get collection data (admin only)
router.get('/collection/:name', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access collection data' });
    }

    const collectionName = req.params.name;
    const validCollections = ['users', 'restaurants', 'orders', 'menuItems', 'tableBookings'];
    
    if (!validCollections.includes(collectionName)) {
      return res.status(400).json({ message: 'Invalid collection name' });
    }

    let data;
    switch (collectionName) {
      case 'users':
        data = await User.find().select('-password');
        break;
      case 'restaurants':
        data = await Restaurant.find();
        break;
      case 'orders':
        data = await Order.find().populate('user', 'name email').populate('restaurant', 'name');
        break;
      case 'menuItems':
        data = await MenuItem.find().populate('restaurantId', 'name');
        break;
      case 'tableBookings':
        data = await TableBooking.find().populate('user', 'name email').populate('restaurant', 'name');
        break;
    }

    res.json({
      collection: collectionName,
      count: data.length,
      data
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.name} collection:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Get database info for dashboard
router.get('/info', auth, async (req, res) => {
  try {
    // This endpoint can be accessed by any authenticated user
    // but will show different data based on user role
    const user = await User.findById(req.user.userId);
    
    let responseData = {
      databaseName: 'Food_Delivery',
      connectionStatus: 'Connected'
    };
    
    if (user.role === 'admin') {
      // For admin users, show complete database info
      responseData.collections = {
        users: await User.countDocuments(),
        restaurants: await Restaurant.countDocuments(),
        orders: await Order.countDocuments(),
        menuItems: await MenuItem.countDocuments(),
        tableBookings: await TableBooking.countDocuments()
      };
      responseData.lastUpdated = new Date();
    } else if (user.role === 'restaurant') {
      // For restaurant owners, show their restaurant data
      const restaurantCount = await Restaurant.countDocuments({ owner: user._id });
      const restaurants = await Restaurant.find({ owner: user._id });
      const restaurantIds = restaurants.map(r => r._id);
      
      responseData.restaurants = {
        count: restaurantCount,
        orderCount: await Order.countDocuments({ restaurant: { $in: restaurantIds } }),
        menuItemCount: await MenuItem.countDocuments({ restaurantId: { $in: restaurantIds } }),
        bookingCount: await TableBooking.countDocuments({ restaurant: { $in: restaurantIds } })
      };
    } else {
      // For regular users, show their own data
      responseData.userInfo = {
        orderCount: await Order.countDocuments({ user: user._id }),
        bookingCount: await TableBooking.countDocuments({ user: user._id })
      };
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching database info:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get database schema and relationships
router.get('/schema', async (req, res) => {
  try {
    // Define the schema information for each collection
    const schemaInfo = {
      users: {
        description: 'User accounts for customers, restaurant owners, and admins',
        fields: [
          { name: '_id', type: 'ObjectId', description: 'Unique identifier' },
          { name: 'name', type: 'String', description: 'User\'s full name' },
          { name: 'email', type: 'String', description: 'User\'s email address (unique)' },
          { name: 'password', type: 'String', description: 'Hashed password' },
          { name: 'role', type: 'String', description: 'User role (user, restaurant, admin)' },
          { name: 'phone', type: 'String', description: 'Contact phone number' },
          { name: 'address', type: 'Object', description: 'User\'s address information' },
          { name: 'profileImage', type: 'String', description: 'URL to profile image' }
        ],
        relationships: [
          { collection: 'restaurants', relationship: 'One user can own many restaurants', via: 'restaurants.owner' },
          { collection: 'orders', relationship: 'One user can have many orders', via: 'orders.user' },
          { collection: 'tableBookings', relationship: 'One user can have many table bookings', via: 'tableBookings.user' }
        ]
      },
      restaurants: {
        description: 'Restaurant information including details, menu, and owner',
        fields: [
          { name: '_id', type: 'ObjectId', description: 'Unique identifier' },
          { name: 'name', type: 'String', description: 'Restaurant name' },
          { name: 'description', type: 'String', description: 'Restaurant description' },
          { name: 'cuisine', type: 'String', description: 'Type of cuisine' },
          { name: 'address', type: 'Object', description: 'Restaurant location' },
          { name: 'phone', type: 'String', description: 'Contact phone number' },
          { name: 'email', type: 'String', description: 'Contact email' },
          { name: 'imageUrl', type: 'String', description: 'Restaurant image' },
          { name: 'rating', type: 'Number', description: 'Average rating' },
          { name: 'owner', type: 'ObjectId', description: 'Reference to user who owns the restaurant' },
          { name: 'featured', type: 'Boolean', description: 'Whether restaurant is featured on home page' }
        ],
        relationships: [
          { collection: 'users', relationship: 'Each restaurant has one owner', via: 'restaurants.owner' },
          { collection: 'menuItems', relationship: 'One restaurant has many menu items', via: 'menuItems.restaurantId' },
          { collection: 'orders', relationship: 'One restaurant has many orders', via: 'orders.restaurant' },
          { collection: 'tableBookings', relationship: 'One restaurant has many table bookings', via: 'tableBookings.restaurant' }
        ]
      },
      menuItems: {
        description: 'Food and beverage items available at restaurants',
        fields: [
          { name: '_id', type: 'ObjectId', description: 'Unique identifier' },
          { name: 'name', type: 'String', description: 'Item name' },
          { name: 'description', type: 'String', description: 'Item description' },
          { name: 'price', type: 'Number', description: 'Item price' },
          { name: 'category', type: 'String', description: 'Food category' },
          { name: 'image', type: 'String', description: 'Item image URL' },
          { name: 'restaurantId', type: 'ObjectId', description: 'Reference to restaurant' },
          { name: 'isAvailable', type: 'Boolean', description: 'Whether item is currently available' },
          { name: 'isPopular', type: 'Boolean', description: 'Whether item is popular (featured)' }
        ],
        relationships: [
          { collection: 'restaurants', relationship: 'Each menu item belongs to one restaurant', via: 'menuItems.restaurantId' },
          { collection: 'orders', relationship: 'Menu items can be included in many orders', via: 'orders.items.menuItem' }
        ]
      },
      orders: {
        description: 'Customer orders with items, delivery info, and payment status',
        fields: [
          { name: '_id', type: 'ObjectId', description: 'Unique identifier' },
          { name: 'user', type: 'ObjectId', description: 'Reference to ordering user' },
          { name: 'restaurant', type: 'ObjectId', description: 'Reference to restaurant' },
          { name: 'items', type: 'Array', description: 'Array of ordered items with quantity' },
          { name: 'totalAmount', type: 'Number', description: 'Total order amount' },
          { name: 'status', type: 'String', description: 'Order status' },
          { name: 'deliveryAddress', type: 'Object', description: 'Delivery address' },
          { name: 'paymentMethod', type: 'String', description: 'Payment method' },
          { name: 'paymentStatus', type: 'String', description: 'Payment status' },
          { name: 'deliveryStatus', type: 'String', description: 'Delivery status' },
          { name: 'orderReference', type: 'String', description: 'Unique order reference number' }
        ],
        relationships: [
          { collection: 'users', relationship: 'Each order belongs to one user', via: 'orders.user' },
          { collection: 'restaurants', relationship: 'Each order is from one restaurant', via: 'orders.restaurant' },
          { collection: 'menuItems', relationship: 'Orders contain many menu items', via: 'orders.items.menuItem' }
        ]
      },
      tableBookings: {
        description: 'Restaurant table reservations',
        fields: [
          { name: '_id', type: 'ObjectId', description: 'Unique identifier' },
          { name: 'user', type: 'ObjectId', description: 'Reference to booking user' },
          { name: 'restaurant', type: 'ObjectId', description: 'Reference to restaurant' },
          { name: 'date', type: 'Date', description: 'Booking date' },
          { name: 'time', type: 'String', description: 'Booking time' },
          { name: 'guestCount', type: 'Number', description: 'Number of guests' },
          { name: 'status', type: 'String', description: 'Booking status' },
          { name: 'bookingReference', type: 'String', description: 'Unique booking reference' }
        ],
        relationships: [
          { collection: 'users', relationship: 'Each booking belongs to one user', via: 'tableBookings.user' },
          { collection: 'restaurants', relationship: 'Each booking is for one restaurant', via: 'tableBookings.restaurant' }
        ]
      }
    };

    // Get counts for each collection
    const collectionCounts = {
      users: await User.countDocuments(),
      restaurants: await Restaurant.countDocuments(),
      menuItems: await MenuItem.countDocuments(),
      orders: await Order.countDocuments(),
      tableBookings: await TableBooking.countDocuments()
    };

    res.json({
      databaseName: 'Food_Delivery',
      collections: Object.keys(schemaInfo).map(name => ({
        name,
        count: collectionCounts[name] || 0,
        ...schemaInfo[name]
      })),
      totalDocuments: Object.values(collectionCounts).reduce((sum, count) => sum + count, 0)
    });
  } catch (error) {
    console.error('Error fetching database schema:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 