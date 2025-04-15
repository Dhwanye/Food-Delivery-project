import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Test protected route
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

export default router;
