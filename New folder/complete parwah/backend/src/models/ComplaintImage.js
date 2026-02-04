const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ComplaintImage = sequelize.define('ComplaintImage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    complaintId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'complaints',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'audio'),
      defaultValue: 'image'
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'complaint_images',
    timestamps: true
  });

  return ComplaintImage;
};