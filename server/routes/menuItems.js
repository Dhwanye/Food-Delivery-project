const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get popular menu items for home page
router.get('/popular', async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ 
      isAvailable: true,
      isPopular: true 
    }).limit(8);
    res.json(popularItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all menu items for a restaurant
router.get('/restaurants/:restaurantId/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurantId: req.params.restaurantId,
      isAvailable: true 
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add sample menu items for testing
router.post('/sample-menu-items', async (req, res) => {
  try {
    const { restaurantId } = req.body;
    
    const sampleMenuItems = [
      // Main Course
      {
        name: "Classic Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, basil, and olive oil",
        price: 12.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
        restaurantId
      },
      {
        name: "Chicken Alfredo Pasta",
        description: "Creamy alfredo sauce with grilled chicken and parmesan",
        price: 14.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023a3f1",
        restaurantId
      },
      {
        name: "Grilled Salmon",
        description: "Fresh salmon fillet with lemon herb butter",
        price: 18.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927",
        restaurantId
      },
      {
        name: "BBQ Burger",
        description: "Angus beef patty with BBQ sauce and crispy onions",
        price: 13.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        restaurantId
      },
      {
        name: "Vegetable Stir Fry",
        description: "Fresh vegetables in a savory sauce with steamed rice",
        price: 11.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
        restaurantId
      },

      // Appetizers
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, croutons, and caesar dressing",
        price: 8.99,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
        restaurantId
      },
      {
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter and herbs",
        price: 4.99,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1619535860434-cf9b2bca5c68",
        restaurantId
      },
      {
        name: "Mozzarella Sticks",
        description: "Crispy breaded mozzarella with marinara sauce",
        price: 6.99,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1531749668029-257fe5f3d34f",
        restaurantId
      },
      {
        name: "Spinach Artichoke Dip",
        description: "Creamy dip with tortilla chips",
        price: 7.99,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7",
        restaurantId
      },

      // Desserts
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center",
        price: 6.99,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51",
        restaurantId
      },
      {
        name: "New York Cheesecake",
        description: "Classic cheesecake with berry compote",
        price: 7.99,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad",
        restaurantId
      },
      {
        name: "Tiramisu",
        description: "Italian coffee-flavored dessert",
        price: 6.99,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
        restaurantId
      },

      // Beverages
      {
        name: "Mango Smoothie",
        description: "Fresh mango blended with yogurt and honey",
        price: 5.99,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
        restaurantId
      },
      {
        name: "Fresh Lemonade",
        description: "Homemade lemonade with mint",
        price: 3.99,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859",
        restaurantId
      },
      {
        name: "Iced Coffee",
        description: "Cold-brewed coffee with cream",
        price: 4.49,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        restaurantId
      }
    ];

    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    res.status(201).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate menu items for cart
router.post('/validate', async (req, res) => {
  try {
    const { itemIds } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ 
        valid: false, 
        message: 'No items to validate' 
      });
    }
    
    // Find all items that match the provided IDs and are available
    const validItems = await MenuItem.find({ 
      _id: { $in: itemIds },
      isAvailable: true 
    });
    
    // Check if all items were found
    const foundItemIds = validItems.map(item => item._id.toString());
    const missingItems = itemIds.filter(id => !foundItemIds.includes(id));
    
    if (missingItems.length > 0) {
      // Get names of any items that were found but not available
      const unavailableItems = await MenuItem.find({ 
        _id: { $in: missingItems },
        isAvailable: false 
      });
      
      const unavailableItemNames = unavailableItems.map(item => item.name);
      
      return res.json({ 
        valid: false, 
        message: `Some items are no longer available: ${unavailableItemNames.join(', ')}`,
        unavailableItems: unavailableItems.map(item => ({
          _id: item._id,
          name: item.name
        }))
      });
    }
    
    // All items are valid and available
    return res.json({ valid: true });
    
  } catch (error) {
    console.error('Error validating menu items:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 