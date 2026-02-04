// const express = require('express');
// const router = express.Router();
// const { addComment, getComments } = require('../controllers/commentController');
// const { protect } = require('../middleware/auth');

// router.post('/:complaintId', protect, addComment);
// router.get('/:complaintId', getComments);

// module.exports = router;






const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:complaintId', auth.protect, commentController.addComment);
router.get('/:complaintId', commentController.getComments);

module.exports = router;
