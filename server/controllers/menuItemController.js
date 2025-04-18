

///Change maybe done here as i just changed my menu item model 


const MenuItem = require('../models/MenuItem');

// GET all menu items (optionally filtered by restaurant)
exports.getAllMenuItems = async (req, res) => {
  try {
    const filter = req.query.restaurantId ? { restaurantId: req.query.restaurantId } : {};
    const items = await MenuItem.find(filter);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET featured menu items
exports.getFeaturedMenuItems = async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ isFeatured: true, isAvailable: true })
      .sort({ rating: -1 }); // Sort by highest rating first
    res.status(200).json(featuredItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create a menu item
// exports.createMenuItem = async (req, res) => {
//   try {
//     const newItem = new MenuItem(req.body);
//     const saved = await newItem.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// PUT update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
