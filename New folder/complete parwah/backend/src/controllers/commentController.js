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
const deduplicationService = require('../services/deduplicationService');

exports.createComplaint = async (req, res) => {
  try {
    console.log('📝 Creating complaint with deduplication');

    const {
      title,
      description,
      categoryId,
      address,
      landmark,
      latitude,
      longitude,
      priority = 'medium',
      imageUrls = []
    } = req.body;

    // Validation
    if (!title || !description || !categoryId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get category
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // ✨ DEDUPLICATION CHECK ✨
    const dedupResult = await deduplicationService.checkDuplicate({
      description,
      categoryId,
      latitude,
      longitude,
      imageUrls
    });

    // 🔁 DUPLICATE FOUND
    if (dedupResult.isDuplicate) {
      console.log(`⚠️ Duplicate! Linking to: ${dedupResult.duplicateOf}`);

      const originalComplaint = await db.Complaint.findByPk(
        dedupResult.duplicateOf,
        {
          include: [
            { model: db.User, as: 'reporter', attributes: ['id', 'name'] },
            { model: db.Category, as: 'category' },
            { model: db.Department, as: 'department' },
            { model: db.ComplaintImage, as: 'images' }
          ]
        }
      );

      if (originalComplaint) {
        // Add supporter
        await deduplicationService.addSupporter(
          dedupResult.duplicateOf,
          req.user.id
        );

        // Award points
        const pointsData = deduplicationService.calculatePoints(
          true,
          originalComplaint.duplicateCount
        );

        await db.UserPoint.increment(
          {
            complaintsReported: 1,
            totalPoints: pointsData.points
          },
          { where: { userId: req.user.id } }
        );

        // Notification
        await db.Notification.create({
          userId: req.user.id,
          type: 'duplicate_reported',
          message: `Your report was added to "${originalComplaint.title}". You earned ${pointsData.points} points!`,
          complaintId: originalComplaint.id,
          isRead: false
        });

        return res.status(200).json({
          success: true,
          isDuplicate: true,
          message: `Similar issue found! Added to existing complaint. You earned ${pointsData.points} points.`,
          data: {
            originalComplaint,
            deduplication: {
              isDuplicate: true,
              similarityScore: dedupResult.similarityScore,
              breakdown: dedupResult.breakdown,
              pointsEarned: pointsData.points,
              reason: pointsData.reason
            }
          }
        });
      }
    }

    // 🆕 NOT DUPLICATE — CREATE NEW
    console.log('✅ Not duplicate - Creating new complaint');

    const complaint = await db.Complaint.create({
      title,
      description,
      userId: req.user.id,
      categoryId,
      departmentId: category.departmentId,
      address,
      landmark,
      latitude,
      longitude,
      priority,
      status: 'pending',
      duplicateCount: 0,
      supporters: [req.user.id]
    });

    // Save images
    if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map((url, index) =>
          db.ComplaintImage.create({
            complaintId: complaint.id,
            imageUrl: url,
            mediaType: 'image',
            order: index
          })
        )
      );
    }

    // Award points
    const pointsData = deduplicationService.calculatePoints(false);
    await db.UserPoint.increment(
      {
        complaintsReported: 1,
        totalPoints: pointsData.points
      },
      { where: { userId: req.user.id } }
    );

    // Notification
    await db.Notification.create({
      userId: req.user.id,
      type: 'complaint_created',
      message: `Complaint "${title}" submitted! You earned ${pointsData.points} points.`,
      complaintId: complaint.id,
      isRead: false
    });

    // Fetch complete complaint
    const completeComplaint = await db.Complaint.findByPk(complaint.id, {
      include: [
        { model: db.User, as: 'reporter', attributes: ['id', 'name'] },
        { model: db.Category, as: 'category' },
        { model: db.Department, as: 'department' },
        { model: db.ComplaintImage, as: 'images' }
      ]
    });

    res.status(201).json({
      success: true,
      isDuplicate: false,
      message: `Complaint submitted! You earned ${pointsData.points} points.`,
      data: {
        complaint: completeComplaint,
        deduplication: {
          isDuplicate: false,
          pointsEarned: pointsData.points,
          reason: pointsData.reason
        }
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create complaint',
      error: error.message
    });
  }
};
