const db = require('../models');
const deduplicationService = require('../services/deduplicationService');
const neighborhoodService = require('../services/neighborhoodService');
const { emitEvent } = require('../utils/eventBus');

const mapPriorityLevel = (level) => {
  if (level <= 1) return 'low';
  if (level === 2) return 'medium';
  if (level === 3) return 'high';
  return 'critical';
};

// ===============================
// CREATE COMPLAINT
// ===============================
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      address,
      landmark,
      latitude,
      longitude,
      priority,
      imageUrls = []
    } = req.body;

    if (!title || !description || !categoryId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const dedupResult = await deduplicationService.checkDuplicate({
      description,
      categoryId,
      latitude,
      longitude,
      imageUrls
    });

    if (dedupResult.isDuplicate) {
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
        await deduplicationService.addSupporter(
          dedupResult.duplicateOf,
          req.user.id
        );

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

        await db.Notification.create({
          userId: req.user.id,
          type: 'duplicate_reported',
          message: `Your report was added to "${originalComplaint.title}". You earned ${pointsData.points} points!`,
          complaintId: originalComplaint.id,
          isRead: false
        });

        emitEvent('complaint.updated', {
          complaintId: originalComplaint.id,
          isDuplicate: true,
          supporterId: req.user.id
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

    const neighborhood = await neighborhoodService.assignNeighborhood({
      categoryId,
      latitude,
      longitude
    });

    const computedPriority = priority || mapPriorityLevel(category.priorityLevel);

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
      priority: computedPriority,
      status: 'pending',
      duplicateCount: 0,
      supporters: [req.user.id],
      neighborhoodGroupId: neighborhood?.id || null
    });

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

    const pointsData = deduplicationService.calculatePoints(false);
    await db.UserPoint.increment(
      {
        complaintsReported: 1,
        totalPoints: pointsData.points
      },
      { where: { userId: req.user.id } }
    );

    await db.Notification.create({
      userId: req.user.id,
      type: 'complaint_created',
      message: `Complaint "${title}" submitted! You earned ${pointsData.points} points.`,
      complaintId: complaint.id,
      isRead: false
    });

    await db.StatusHistory.create({
      complaintId: complaint.id,
      actorId: req.user.id,
      status: 'pending',
      notes: 'Complaint created'
    });

    const completeComplaint = await db.Complaint.findByPk(complaint.id, {
      include: [
        { model: db.User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: db.Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
        { model: db.Department, as: 'department', attributes: ['id', 'name'] },
        { model: db.ComplaintImage, as: 'images' }
      ]
    });

    emitEvent('complaint.created', {
      complaintId: complaint.id,
      categoryId,
      neighborhoodGroupId: neighborhood?.id || null
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

    if (status) {
      await db.StatusHistory.create({
        complaintId: complaint.id,
        actorId: req.user.id,
        status,
        notes: `Status updated to ${status}`
      });

      await db.Notification.create({
        userId: complaint.userId,
        type: 'status_update',
        message: `Status updated to ${status} for "${complaint.title}".`,
        complaintId: complaint.id,
        isRead: false
      });
    }

    emitEvent('complaint.updated', {
      complaintId: complaint.id,
      status,
      priority,
      assignedTo
    });

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

exports.getHeatmapData = async (req, res) => {
  try {
    const complaints = await db.Complaint.findAll({
      attributes: ['id', 'latitude', 'longitude', 'status', 'categoryId']
    });

    const bins = new Map();

    complaints.forEach((complaint) => {
      const lat = Number(parseFloat(complaint.latitude).toFixed(2));
      const lon = Number(parseFloat(complaint.longitude).toFixed(2));
      const key = `${lat},${lon}`;

      if (!bins.has(key)) {
        bins.set(key, {
          latitude: lat,
          longitude: lon,
          count: 0
        });
      }

      bins.get(key).count += 1;
    });

    res.json({
      success: true,
      data: Array.from(bins.values())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to build heatmap data',
      error: error.message
    });
  }
};

exports.getComplaintTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    const timeline = await db.StatusHistory.findAll({
      where: { complaintId: id },
      include: [{ model: db.User, as: 'actor', attributes: ['id', 'name', 'role'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint timeline',
      error: error.message
    });
  }
};
