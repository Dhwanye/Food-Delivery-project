const User = require('../models/user');

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserAddress = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (req.body.street) user.street = req.body.street;
      if (req.body.city) user.city = req.body.city;
      if (req.body.state) user.state = req.body.state;
      if (req.body.zipcode) user.zipcode = req.body.zipcode;
      if (req.body.country) user.country = req.body.country;
  
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        street: updatedUser.street,
        city: updatedUser.city,
        state: updatedUser.state,
        zipcode: updatedUser.zipcode,
        country: updatedUser.country,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
