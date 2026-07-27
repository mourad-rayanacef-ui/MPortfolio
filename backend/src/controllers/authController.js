const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password using the model's method
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    console.log('Creating admin user...');

    // Check if admin already exists
    const existingUser = await User.findOne({ 
      where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Create admin user - password will be hashed by the model hook
    const user = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      isAdmin: true
    });

    console.log('Admin created successfully');
    res.json({
      message: 'Admin created successfully',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(400).json({ message: error.message || 'Failed to create admin' });
  }
};