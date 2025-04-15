import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔐 Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// 📝 Signup
export const register = async (req, res) => {
  console.log('POST /register called'); // ✅ Route hit confirmation
  console.log('Request body:', req.body); // ✅ Check what data is received
  try {
    const { name, email, password, role, zipcode, state, city, street, phone,country } = req.body;
    console.log("Received registration data:", req.body);
    //validate all the files are required
    if (!name || !email || !password || !street || !city || !state || !zipcode || !country || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      phone,
      role: role || 'user', 
     password,
      street,
      city,
      state,
      zipcode,
      country
    });
    
    // Hash password
    // const salt = await bcrypt.genSalt(10);
   
    // user.password = await bcrypt.hash(password, salt);

    console.log("About to save user:", user);
   

    try {
      const validationError = user.validateSync(); // Synchronize validation
      if (validationError) {
        console.log("Validation failed:", validationError);
        return res.status(400).json({ message: "Validation failed", error: validationError });
      }
      
      console.log("About to save user:", user);
      await user.save();
      console.log("User saved successfully");
    } catch (err) {
      console.error("Error during user save:", err);
      res.status(500).json({ message: "Server error during save" });
    }
    

    // Create and return JWT token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        password:user.password,
        phone: user.phone,
        role: user.role,
        street: user.street,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
        country: user.country

      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔑 Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
     
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // console.log('Entered Password:', password);
    // console.log('Stored Hashed Password:', user.password);
    
    // const isMatch = await bcrypt.compare(password, user.password);
    
    // console.log('Password Match Result:', isMatch);
    // // If password doesn't match, return an error
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
        country: user.country
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
