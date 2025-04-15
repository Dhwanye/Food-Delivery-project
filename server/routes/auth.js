const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { register } = require('../controllers/authController.js');
const { login } = require('../controllers/authController.js');
// Register a new user
router.post('/register', register);

//module.exports = router;


// router.post('/register', async (req, res) => {
//   console.log('POST /register called'); // ✅ Route hit confirmation
//   console.log('Request body:', req.body); // ✅ Check what data is received
//   try {
//     const { name, email, password, role, zipCode, state, city, street, phone,country } = req.body;

//     //validate all the files are required
//     if (!name || !email || !password || !phone || !street || !city || !state || !zipCode || !country) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     user = new User({
//       name,
//       email,
//       phone,
//       role: role || 'user', 
//      password,
//       street,
//       city,
//       state,
//       zipCode,
//       country
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Create and return JWT token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         password:user.password,
//         phone: user.phone,
//         role: user.role,
//         street: user.street,
//         city: user.city,
//         state: user.state,
//         zipCode: user.zipCode,
//         country: user.country

//       }
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });





//Login user
router.post('/login',login);

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create and return JWT token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         password:user.password,
//         phone: user.phone,
//         street: user.street,
//         city: user.city,
//         state: user.state,
//         zipcode: user.zipcode,
//         country:user.country

//       }
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get user profile
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
