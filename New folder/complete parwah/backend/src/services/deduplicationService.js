const axios = require('axios');
const db = require('../models');
const { Op } = require('sequelize');
const { isNearby, getBoundingBox } = require('../utils/geoUtils');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class DeduplicationService {
  async checkDuplicate(newComplaint) {
    try {
      console.log('🔍 Checking for duplicates...');
      
      // Find recent nearby complaints
      const recentComplaints = await this.findRecentNearbyComplaints(
        newComplaint.categoryId,
        newComplaint.latitude,
        newComplaint.longitude,
        7
      );

      if (recentComplaints.length === 0) {
        console.log('✅ No duplicates found');
        return { isDuplicate: false, duplicateOf: null, similarityScore: 0 };
      }

      // Calculate GPS similarity
      const complaintsWithGPS = recentComplaints.map(complaint => {
        const gpsResult = isNearby(
          parseFloat(newComplaint.latitude),
          parseFloat(newComplaint.longitude),
          parseFloat(complaint.latitude),
          parseFloat(complaint.longitude),
          100
        );

        return {
          id: complaint.id,
          image_urls: complaint.images?.map(img => img.imageUrl) || [],
          description: complaint.description,
          gps_similarity: gpsResult.similarity
        };
      });

      // Call ML service
      console.log('🤖 Calling ML service...');
      let mlResponse;
      
      try {
        mlResponse = await axios.post(
          `${ML_SERVICE_URL}/api/deduplication/check`,
          {
            new_complaint: {
              image_urls: newComplaint.imageUrls || [],
              description: newComplaint.description
            },
            existing_complaints: complaintsWithGPS
          },
          { timeout: 30000 }
        );
      } catch (error) {
        console.error('❌ ML service error:', error.message);
        return { isDuplicate: false, duplicateOf: null, similarityScore: 0 };
      }

      const result = mlResponse.data.data;
      console.log('📊 Result:', result.is_duplicate ? 'DUPLICATE' : 'NEW');

      return {
        isDuplicate: result.is_duplicate,
        duplicateOf: result.duplicate_of,
        similarityScore: result.similarity_score,
        breakdown: result.breakdown
      };

    } catch (error) {
      console.error('❌ Deduplication error:', error);
      return { isDuplicate: false, duplicateOf: null, similarityScore: 0 };
    }
  }

  async findRecentNearbyComplaints(categoryId, latitude, longitude, daysAgo = 7) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

    const bbox = getBoundingBox(parseFloat(latitude), parseFloat(longitude), 1000);

    const complaints = await db.Complaint.findAll({
      where: {
        categoryId,
        createdAt: { [Op.gte]: dateThreshold },
        latitude: { [Op.between]: [bbox.minLat, bbox.maxLat] },
        longitude: { [Op.between]: [bbox.minLon, bbox.maxLon] },
        status: { [Op.notIn]: ['resolved', 'rejected'] }
      },
      include: [{ 
        model: db.ComplaintImage, 
        as: 'images',
        attributes: ['imageUrl'],
        limit: 1
      }],
      attributes: ['id', 'description', 'latitude', 'longitude'],
      limit: 50
    });

    return complaints;
  }

  calculatePoints(isDuplicate, duplicateCount = 0) {
    if (!isDuplicate) {
      return { points: 10, reason: 'First to report this issue' };
    }
    if (duplicateCount === 0) {
      return { points: 5, reason: 'Duplicate report (confirms issue)' };
    }
    return { points: 2, reason: 'Additional confirmation' };
  }

  async addSupporter(complaintId, userId) {
    const complaint = await db.Complaint.findByPk(complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const supporters = complaint.supporters || [];
    if (!supporters.includes(userId)) {
      supporters.push(userId);
      await complaint.update({
        supporters,
        duplicateCount: supporters.length - 1
      });
    }
    return complaint;
  }
}

module.exports = new DeduplicationService();