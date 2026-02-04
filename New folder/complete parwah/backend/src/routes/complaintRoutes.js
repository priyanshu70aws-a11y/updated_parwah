// const express = require('express');
// const router = express.Router();
// const db = require('../models');
// // const { protect } = require('../middleware/auth');
// // const { createComplaint } = require('../controllers/complaintController');
// const { protect, authorize } = require('../middleware/auth');
// const { createComplaint, updateComplaint } = require('../controllers/complaintController');

// // GET all complaints
// router.get('/', async (req, res) => {
//   try {
//     const complaints = await db.Complaint.findAll({
//       include: [
//         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
//         { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
//         { model: db.Department, as: 'department', attributes: ['id', 'name'] }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({
//       success: true,
//       count: complaints.length,
//       data: complaints
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching complaints',
//       error: error.message
//     });
//   }
// });

// // GET single complaint by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const complaint = await db.Complaint.findByPk(req.params.id, {
//       include: [
//         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email', 'phone'] },
//         { model: db.Category, as: 'category' },
//         { model: db.Department, as: 'department' },
//         { model: db.Comment, as: 'comments', include: [{ model: db.User, as: 'user', attributes: ['name'] }] },
//         { model: db.Vote, as: 'votes' }
//       ]
//     });

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: 'Complaint not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: complaint
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching complaint',
//       error: error.message
//     });
//   }
// });

// // GET complaints by status
// router.get('/status/:status', async (req, res) => {
//   try {
//     const complaints = await db.Complaint.findAll({
//       where: { status: req.params.status },
//       include: [
//         { model: db.User, as: 'reporter', attributes: ['name'] },
//         { model: db.Category, as: 'category', attributes: ['name', 'icon'] }
//       ]
//     });

//     res.json({
//       success: true,
//       count: complaints.length,
//       data: complaints
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching complaints',
//       error: error.message
//     });
//   }
// });

// // POST create new complaint (protected route)
// router.post('/', protect, createComplaint);

// router.put('/:id', protect, authorize('admin', 'department_head'), updateComplaint);

// module.exports = router;

// exports.updateComplaint = async (req, res) => {
//   try {
//     const { status, priority } = req.body;

//     const complaint = await db.Complaint.findByPk(req.params.id);

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: 'Complaint not found'
//       });
//     }

//     // Update allowed fields
//     if (status) complaint.status = status;
//     if (priority) complaint.priority = priority;

//     await complaint.save();

//     res.json({
//       success: true,
//       message: 'Complaint updated successfully',
//       data: complaint
//     });
//   } catch (error) {
//     console.error('❌ Update complaint error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update complaint',
//       error: error.message
//     });
//   }
// };






































// // const express = require('express');
// // const router = express.Router();
// // const db = require('../models');
// // const { protect, authorize } = require('../middleware/auth');
// // const { createComplaint, updateComplaint } = require('../controllers/complaintController');

// // /**
// //  * GET complaints by status
// //  * MUST come before '/:id'
// //  */
// // router.get('/status/:status', async (req, res) => {
// //   try {
// //     const complaints = await db.Complaint.findAll({
// //       where: { status: req.params.status },
// //       include: [
// //         { model: db.User, as: 'reporter', attributes: ['name'] },
// //         { model: db.Category, as: 'category', attributes: ['name', 'icon'] }
// //       ]
// //     });

// //     res.json({
// //       success: true,
// //       count: complaints.length,
// //       data: complaints
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching complaints',
// //       error: error.message
// //     });
// //   }
// // });

// // /**
// //  * GET all complaints
// //  */
// // router.get('/', async (req, res) => {
// //   try {
// //     const complaints = await db.Complaint.findAll({
// //       include: [
// //         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
// //         { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
// //         { model: db.Department, as: 'department', attributes: ['id', 'name'] }
// //       ],
// //       order: [['createdAt', 'DESC']]
// //     });

// //     res.json({
// //       success: true,
// //       count: complaints.length,
// //       data: complaints
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching complaints',
// //       error: error.message
// //     });
// //   }
// // });

// // /**
// //  * GET single complaint by ID
// //  */
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const complaint = await db.Complaint.findByPk(req.params.id, {
// //       include: [
// //         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email', 'phone'] },
// //         { model: db.Category, as: 'category' },
// //         { model: db.Department, as: 'department' },
// //         {
// //           model: db.Comment,
// //           as: 'comments',
// //           include: [{ model: db.User, as: 'user', attributes: ['name'] }]
// //         },
// //         { model: db.Vote, as: 'votes' }
// //       ]
// //     });

// //     if (!complaint) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Complaint not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       data: complaint
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching complaint',
// //       error: error.message
// //     });
// //   }
// // });

// // /**
// //  * POST create new complaint (protected)
// //  */
// // router.post('/', protect, createComplaint);

// // /**
// //  * UPDATE complaint (admin / department head only)
// //  */
// // router.put(
// //   '/:id',
// //   protect,
// //   authorize('admin', 'department_head'),
// //   updateComplaint
// // );

// // module.exports = router;














const express = require('express');
const router = express.Router();
const db = require('../models');
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  updateComplaint,
  getHeatmapData,
  getComplaintTimeline
} = require('../controllers/complaintController');

// GET complaints by status (must be before :id)
router.get('/status/:status', async (req, res) => {
  try {
    const complaints = await db.Complaint.findAll({
      where: { status: req.params.status },
      include: [
        { model: db.User, as: 'reporter', attributes: ['name'] },
        { model: db.Category, as: 'category', attributes: ['name', 'icon'] }
      ]
    });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
});

// Heatmap aggregation
router.get('/heatmap', getHeatmapData);

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await db.Complaint.findAll({
      include: [
        { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
        { model: db.Department, as: 'department', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
});

// GET complaint timeline
router.get('/:id/timeline', getComplaintTimeline);

// GET single complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await db.Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint',
      error: error.message
    });
  }
});

// CREATE complaint
router.post('/', protect, createComplaint);

// UPDATE complaint
router.put(
  '/:id',
  protect,
  authorize('admin', 'department_head'),
  updateComplaint
);

module.exports = router;
