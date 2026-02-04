const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      where: { isActive: true },
      include: [
        { model: db.Department, as: 'department', attributes: ['id', 'name'] }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

module.exports = router;