const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const auth = require('./middleware/auth'); 
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
//const menuRoutes = require('./routes/menu');
const menuItemRoutes = require('./routes/menuItems');
//const orderRoutes = require('./routes/orders');
//const paymentRoutes = require('./routes/payments');
//const homeRoutes = require('./routes/home');
//const tableBookingRoutes = require('./routes/tableBooking');
//const databaseRoutes = require('./routes/database');
const Restaurant = require('./models/Restaurant');



const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('debug', true);

const User = require('./models/user'); // ✅ Import your User model

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'profile-images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food Delivery API' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// ✅ Register
// app.post('/api/auth/register', upload.single('profileImage'), async (req, res) => {
//   try {
//     const { name, email, password, role, zipCode, state, city, street, phone,country } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already registered' });

//     const profileImage = req.file ? `/uploads/profile-images/${req.file.filename}` : null;

//     const user = new User({
//       name,
//       email,
//       password,
//       phone,
//       street,
//       city,
//       state,
//       zipCode,
//       role: role || 'user',
//       country, 
//       profileImage
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

//     res.status(201).json({
//       message: 'Registration successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         street: user.street,
//         city: user.city,
//         state: user.state,
//         zipCode: user.zipCode,
//         role: user.role,
//         country: user.country,
//         profileImage: user.profileImage
//       },
//       token
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);

// app.use('/api/table-bookings', tableBookingRoutes);
// app.use('/api/database', databaseRoutes);
// Create database info route (for /api/db-Food_Delivery)
// app.get('/api/db-Food_Delivery', async (req, res) => {
//   try {
//     // Count documents in each collection
//     const userCount = await mongoose.model('User').countDocuments();
//     const restaurantCount = await Restaurant.countDocuments();
//     const orderCount = await mongoose.model('Order').countDocuments();
//     const menuItemCount = await mongoose.model('MenuItem').countDocuments();
//     const tableBookingCount = await mongoose.model('TableBooking').countDocuments();
    
//     // Get list of all collections in the database
//     const collections = mongoose.connection.collections;
//     const collectionNames = Object.keys(collections);
    
//     res.json({
//       database: 'Food_Delivery',
//       connection: 'Connected to MongoDB Atlas',
//       collections: collectionNames,
//       stats: {
//         users: userCount,
//         restaurants: restaurantCount,
//         orders: orderCount,
//         menuItems: menuItemCount,
//         tableBookings: tableBookingCount
//       },
//       url: process.env.MONGODB_URI.split('@')[1], // Only show server part, not credentials
//       status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//     });
//   } catch (error) {
//     console.error('Error fetching database info:', error);
//     res.status(500).json({ 
//       message: 'Error fetching database info',
//       error: error.message 
//     });
//   }
// });

// app.get('/api/protected', auth, (req, res) => {
//   res.json({ message: 'Access granted to protected route!', user: req.user });
// });

// ✅ Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid email or password' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         profileImage: user.profileImage
//       },
//       token
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// ✅ Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authorization token required' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Auth error:', error);
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
    res.status(500).json({ message: 'Server error during auth check' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
