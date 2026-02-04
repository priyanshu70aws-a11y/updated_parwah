// const db = require('../models');

// // Add comment to complaint
// exports.addComment = async (req, res) => {
//   try {
//     const { complaintId } = req.params;
//     const { content } = req.body;
//     const userId = req.user.id;

//     console.log(`💬 Adding comment to complaint ${complaintId}`);

//     // Check if complaint exists
//     const complaint = await db.Complaint.findByPk(complaintId);
//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: 'Complaint not found'
//       });
//     }

//     // Check if user is admin/department head for official comment
//     const user = await db.User.findByPk(userId);
//     const isOfficial = user.role === 'admin' || user.role === 'department_head';

//     // Create comment
//     const comment = await db.Comment.create({
//       complaintId,
//       userId,
//       content,
//       isOfficial
//     });

//     // Fetch complete comment data
//     const completeComment = await db.Comment.findByPk(comment.id, {
//       include: [
//         { model: db.User, as: 'user', attributes: ['id', 'name', 'email'] }
//       ]
//     });

//     console.log('✅ Comment added');

//     res.status(201).json({
//       success: true,
//       message: 'Comment added successfully',
//       data: completeComment
//     });
//   } catch (error) {
//     console.error('❌ Comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to add comment',
//       error: error.message
//     });
//   }
// };

// // Get all comments for a complaint
// exports.getComments = async (req, res) => {
//   try {
//     const { complaintId } = req.params;

//     const comments = await db.Comment.findAll({
//       where: { complaintId },
//       include: [
//         { model: db.User, as: 'user', attributes: ['id', 'name'] }
//       ],
//       order: [['createdAt', 'ASC']]
//     });

//     res.json({
//       success: true,
//       count: comments.length,
//       data: comments
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };


















const db = require('../models');
const { emitEvent } = require('../utils/eventBus');

exports.addComment = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const complaint = await db.Complaint.findByPk(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const user = await db.User.findByPk(userId);
    const isOfficial = user?.role === 'admin' || user?.role === 'department_head';

    const comment = await db.Comment.create({
      complaintId,
      userId,
      content,
      isOfficial
    });

    const completeComment = await db.Comment.findByPk(comment.id, {
      include: [{ model: db.User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    await db.Notification.create({
      userId: complaint.userId,
      type: 'comment',
      message: `New comment on "${complaint.title}".`,
      complaintId: complaint.id,
      isRead: false
    });

    emitEvent('comment.created', {
      complaintId,
      commentId: comment.id,
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: completeComment
    });
  } catch (error) {
    console.error('❌ Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const comments = await db.Comment.findAll({
      where: { complaintId },
      include: [{ model: db.User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
