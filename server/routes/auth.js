const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { register, login } = require('../controllers/authController.js');
const { updateUserProfile, updateUserAddress } = require('../controllers/userController.js');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update-profile', auth, updateUserProfile);
router.put('/update-address', auth, updateUserAddress);

module.exports = router;
