const db = require('../models');

// Toggle vote (upvote/downvote)
exports.toggleVote = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    console.log(`👍 Vote attempt: ${voteType} on complaint ${complaintId} by user ${userId}`);

    // Check if complaint exists
    const complaint = await db.Complaint.findByPk(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user already voted
    const existingVote = await db.Vote.findOne({
      where: { complaintId, userId }
    });

    if (existingVote) {
      // If same vote type, remove vote
      if (existingVote.voteType === voteType) {
        await existingVote.destroy();
        
        // Update complaint counts
        if (voteType === 'upvote') {
          await complaint.decrement('upvotes');
        } else {
          await complaint.decrement('downvotes');
        }

        console.log('✅ Vote removed');
        
        return res.json({
          success: true,
          message: 'Vote removed',
          action: 'removed'
        });
      } else {
        // Change vote type
        await existingVote.update({ voteType });
        
        // Update complaint counts
        if (voteType === 'upvote') {
          await complaint.increment('upvotes');
          await complaint.decrement('downvotes');
        } else {
          await complaint.increment('downvotes');
          await complaint.decrement('upvotes');
        }

        console.log('✅ Vote changed');
        
        return res.json({
          success: true,
          message: 'Vote updated',
          action: 'changed'
        });
      }
    } else {
      // Create new vote
      await db.Vote.create({
        complaintId,
        userId,
        voteType
      });

      // Update complaint counts
      if (voteType === 'upvote') {
        await complaint.increment('upvotes');
      } else {
        await complaint.increment('downvotes');
      }

      console.log('✅ Vote added');

      return res.json({
        success: true,
        message: 'Vote added',
        action: 'added'
      });
    }
  } catch (error) {
    console.error('❌ Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process vote',
      error: error.message
    });
  }
};

// Get user's vote on a complaint
exports.getUserVote = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user.id;

    const vote = await db.Vote.findOne({
      where: { complaintId, userId }
    });

    res.json({
      success: true,
      data: vote ? vote.voteType : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};