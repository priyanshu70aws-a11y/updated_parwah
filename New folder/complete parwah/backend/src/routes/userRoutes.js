const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: db.UserPoint, as: 'points' }
      ]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.UserPoint.findAll({
      include: [
        { model: db.User, as: 'user', attributes: ['name', 'email', 'city'] }
      ],
      order: [['totalPoints', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if email exists
router.get('/check/:email', async (req, res) => {
  try {
    const user = await db.User.findOne({ 
      where: { email: req.params.email },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.json({ 
      success: true, 
      exists: !!user, 
      user: user || null 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;