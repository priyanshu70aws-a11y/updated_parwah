const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { name, email, phone, password, role = 'citizen' } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    console.log('🔍 Existing user check:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔒 Password hashed');

    // Create user
    const user = await db.User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: true
    });
    console.log('✅ User created:', user.id);

    // Create user points entry
    await db.UserPoint.create({
      userId: user.id,
      totalPoints: 0,
      complaintsReported: 0,
      complaintsResolved: 0,
      upvotesReceived: 0
    });
    console.log('✅ User points created');

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ Registration successful');
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('🔑 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ Login successful:', email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: db.UserPoint, as: 'points' }
      ]
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};