const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');

// Get all menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new menu item (restaurant owners only)
router.post('/', auth, async (req, res) => {
  try {
    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      restaurant: req.body.restaurantId,
      imageUrl: req.body.imageUrl
    });
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a menu item
router.put('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    Object.assign(menuItem, req.body);
    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a menu item
router.delete('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    await menuItem.remove();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 