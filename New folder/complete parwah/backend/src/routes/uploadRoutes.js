const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../services/uploadService');
const { protect } = require('../middleware/auth');

// Upload single image
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log('📤 Uploading image to Cloudinary...');

    const result = await uploadToCloudinary(req.file.buffer);

    console.log('✅ Image uploaded:', result.secure_url);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    console.log(`📤 Uploading ${req.files.length} images to Cloudinary...`);

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer)
    );

    const results = await Promise.all(uploadPromises);

    const imageData = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));

    console.log(`✅ ${results.length} images uploaded`);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: imageData
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

module.exports = router;