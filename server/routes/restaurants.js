const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');
// Get all restaurants
//router.get('/', restaurantController.getAllRestaurants);
//featured
router.get('/featured', restaurantController.getFeaturedRestaurants);

// Get single restaurant
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router;