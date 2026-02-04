const express = require('express');
const router = express.Router();
const db = require('../models');

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalComplaints: await db.Complaint.count(),
      pending: await db.Complaint.count({ where: { status: 'pending' } }),
      inProgress: await db.Complaint.count({ where: { status: 'in_progress' } }),
      resolved: await db.Complaint.count({ where: { status: 'resolved' } }),
      totalUsers: await db.User.count({ where: { role: 'citizen' } })
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;