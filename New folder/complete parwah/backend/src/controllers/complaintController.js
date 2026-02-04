// // // const db = require('../models');

// // // // Create new complaint
// // // exports.createComplaint = async (req, res) => {
// // //   try {
// // //     console.log('📝 Creating complaint:', req.body);
// // //     console.log('👤 User ID:', req.user.id);
    
// // //     const {
// // //       title,
// // //       description,
// // //       categoryId,
// // //       address,
// // //       landmark,
// // //       latitude,
// // //       longitude,
// // //       priority = 'medium'
// // //     } = req.body;

// // //     // Validate required fields
// // //     if (!title || !description || !categoryId || !address || !latitude || !longitude) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Please provide all required fields'
// // //       });
// // //     }

// // //     // Get category to auto-assign department
// // //     const category = await db.Category.findByPk(categoryId);
// // //     if (!category) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Category not found'
// // //       });
// // //     }

// // //     // Create complaint
// // //     const complaint = await db.Complaint.create({
// // //       title,
// // //       description,
// // //       userId: req.user.id,
// // //       categoryId,
// // //       departmentId: category.departmentId,
// // //       address,
// // //       landmark,
// // //       latitude,
// // //       longitude,
// // //       priority,
// // //       status: 'pending'
// // //     });

// // //     console.log('✅ Complaint created:', complaint.id);

// // //     // Update user points
// // //     await db.UserPoint.increment(
// // //       { complaintsReported: 1, totalPoints: 10 },
// // //       { where: { userId: req.user.id } }
// // //     );

// // //     // Fetch complete complaint data
// // //     const completeComplaint = await db.Complaint.findByPk(complaint.id, {
// // //       include: [
// // //         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
// // //         { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
// // //         { model: db.Department, as: 'department', attributes: ['id', 'name'] }
// // //       ]
// // //     });

// // //     res.status(201).json({
// // //       success: true,
// // //       message: 'Complaint submitted successfully',
// // //       data: completeComplaint
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Create complaint error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to create complaint',
// // //       error: error.message
// // //     });
// // //   }
// // // };

// // // // Get all complaints (existing)
// // // exports.getAllComplaints = async (req, res) => {
// // //   try {
// // //     const complaints = await db.Complaint.findAll({
// // //       include: [
// // //         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
// // //         { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
// // //         { model: db.Department, as: 'department', attributes: ['id', 'name'] }
// // //       ],
// // //       order: [['createdAt', 'DESC']]
// // //     });

// // //     res.json({
// // //       success: true,
// // //       count: complaints.length,
// // //       data: complaints
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Error fetching complaints',
// // //       error: error.message
// // //     });
// // //   }
// // //   // Update complaint (admin only)
// // // exports.updateComplaint = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const { status, priority, assignedTo } = req.body;

// // //     console.log(`🔧 Updating complaint ${id}:`, req.body);

// // //     const complaint = await db.Complaint.findByPk(id);
// // //     if (!complaint) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Complaint not found'
// // //       });
// // //     }

// // //     // Update fields
// // //     if (status) complaint.status = status;
// // //     if (priority) complaint.priority = priority;
// // //     if (assignedTo) complaint.assignedTo = assignedTo;
    
// // //     // If status is resolved, set resolvedAt
// // //     if (status === 'resolved' && !complaint.resolvedAt) {
// // //       complaint.resolvedAt = new Date();
// // //     }

// // //     await complaint.save();

// // //     console.log('✅ Complaint updated');

// // //     res.json({
// // //       success: true,
// // //       message: 'Complaint updated successfully',
// // //       data: complaint
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Update error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to update complaint',
// // //       error: error.message
// // //     });
// // //   }
// // // };
// // // };

// // // // Other exports remain same...













// // const db = require('../models');

// // // Create new complaint
// // exports.createComplaint = async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       categoryId,
// //       address,
// //       landmark,
// //       latitude,
// //       longitude,
// //       priority = 'medium'
// //     } = req.body;

// //     if (!title || !description || !categoryId || !address || !latitude || !longitude) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Please provide all required fields'
// //       });
// //     }

// //     const category = await db.Category.findByPk(categoryId);
// //     if (!category) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Category not found'
// //       });
// //     }

// //     const complaint = await db.Complaint.create({
// //       title,
// //       description,
// //       userId: req.user.id,
// //       categoryId,
// //       departmentId: category.departmentId,
// //       address,
// //       landmark,
// //       latitude,
// //       longitude,
// //       priority,
// //       status: 'pending'
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: 'Complaint submitted successfully',
// //       data: complaint
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to create complaint',
// //       error: error.message
// //     });
// //   }
// // };

// // // Get all complaints
// // exports.getAllComplaints = async (req, res) => {
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
// // };

// // // ✅ UPDATE complaint (admin / department head)
// // exports.updateComplaint = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status, priority, assignedTo } = req.body;

// //     const complaint = await db.Complaint.findByPk(id);
// //     if (!complaint) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Complaint not found'
// //       });
// //     }

// //     if (status) complaint.status = status;
// //     if (priority) complaint.priority = priority;
// //     if (assignedTo) complaint.assignedTo = assignedTo;

// //     if (status === 'resolved' && !complaint.resolvedAt) {
// //       complaint.resolvedAt = new Date();
// //     }

// //     await complaint.save();

// //     res.json({
// //       success: true,
// //       message: 'Complaint updated successfully',
// //       data: complaint
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to update complaint',
// //       error: error.message
// //     });
// //   }
// // };











// exports.createComplaint = async (req, res) => {
//   try {
//     console.log('📝 Creating complaint:', req.body);
//     console.log('👤 User ID:', req.user.id);
    
//     const {
//       title,
//       description,
//       categoryId,
//       address,
//       landmark,
//       latitude,
//       longitude,
//       priority = 'medium',
//       imageUrls = [] // Add this
//     } = req.body;

//     // Validate required fields
//     if (!title || !description || !categoryId || !address || !latitude || !longitude) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }

//     // Get category to auto-assign department
//     const category = await db.Category.findByPk(categoryId);
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: 'Category not found'
//       });
//     }

//     // Create complaint
//     const complaint = await db.Complaint.create({
//       title,
//       description,
//       userId: req.user.id,
//       categoryId,
//       departmentId: category.departmentId,
//       address,
//       landmark,
//       latitude,
//       longitude,
//       priority,
//       status: 'pending'
//     });

//     console.log('✅ Complaint created:', complaint.id);

//     // Save images if provided
//     if (imageUrls && imageUrls.length > 0) {
//       const imagePromises = imageUrls.map((url, index) => 
//         db.ComplaintImage.create({
//           complaintId: complaint.id,
//           imageUrl: url,
//           mediaType: 'image',
//           order: index
//         })
//       );
//       await Promise.all(imagePromises);
//       console.log(`✅ ${imageUrls.length} images saved`);
//     }

//     // Update user points
//     await db.UserPoint.increment(
//       { complaintsReported: 1, totalPoints: 10 },
//       { where: { userId: req.user.id } }
//     );

//     // Fetch complete complaint data with images
//     const completeComplaint = await db.Complaint.findByPk(complaint.id, {
//       include: [
//         { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
//         { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
//         { model: db.Department, as: 'department', attributes: ['id', 'name'] },
//         { model: db.ComplaintImage, as: 'images' }
//       ]
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Complaint submitted successfully',
//       data: completeComplaint
//     });
//   } catch (error) {
//     console.error('❌ Create complaint error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create complaint',
//       error: error.message
//     });
//   }
// };





const db = require('../models');

// ===============================
// CREATE COMPLAINT
// ===============================
exports.createComplaint = async (req, res) => {
  try {
    console.log('📝 Creating complaint:', req.body);
    console.log('👤 User ID:', req.user.id);

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

    // Validate required fields
    if (!title || !description || !categoryId || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get category to auto-assign department
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    
    
    
    
    
    
    // Create complaint
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
      status: 'pending'
    });

    console.log('✅ Complaint created:', complaint.id);

    // Save images if provided
    if (imageUrls.length > 0) {
      const imagePromises = imageUrls.map((url, index) =>
        db.ComplaintImage.create({
          complaintId: complaint.id,
          imageUrl: url,
          mediaType: 'image',
          order: index
        })
      );
      await Promise.all(imagePromises);
      console.log(`✅ ${imageUrls.length} images saved`);
    }

    // Update user points
    await db.UserPoint.increment(
      { complaintsReported: 1, totalPoints: 10 },
      { where: { userId: req.user.id } }
    );

    // Fetch full complaint with relations
    const completeComplaint = await db.Complaint.findByPk(complaint.id, {
      include: [
        { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
        { model: db.Department, as: 'department', attributes: ['id', 'name'] },
        { model: db.ComplaintImage, as: 'images' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: completeComplaint
    });
  } catch (error) {
    console.error('❌ Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create complaint',
      error: error.message
    });
  }
};

// ===============================
// UPDATE COMPLAINT (ADMIN / DEPARTMENT HEAD)
// ===============================
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    const complaint = await db.Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (assignedTo) complaint.assignedTo = assignedTo;

    if (status === 'resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    console.error('❌ Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message
    });
  }
};
