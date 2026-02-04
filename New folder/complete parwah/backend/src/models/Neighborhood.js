const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Neighborhood = sequelize.define('Neighborhood', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    centerLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    centerLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    radius: {
      type: DataTypes.INTEGER,
      defaultValue: 500,
      comment: 'Radius in meters'
    },
    totalComplaints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'resolved', 'merged'),
      defaultValue: 'active'
    },
    validatedBy: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    }
  }, {
    tableName: 'neighborhoods',
    timestamps: true
  });

  return Neighborhood;
};