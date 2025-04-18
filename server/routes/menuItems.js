const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const menuController = require('../controllers/menuItemController');
// Get popular menu items for home page
router.get('/', menuController.getAllMenuItems);
router.get('/featured', menuController.getFeaturedMenuItems);
router.get('/:id', menuController.getMenuItemById);
//router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;