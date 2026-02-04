const express = require('express');
const router = express.Router();
const { toggleVote, getUserVote } = require('../controllers/voteController');
const { protect } = require('../middleware/auth');

// All vote routes require authentication
router.post('/:complaintId', protect, toggleVote);
router.get('/:complaintId/user', protect, getUserVote);

module.exports = router;