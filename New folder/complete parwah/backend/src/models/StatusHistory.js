const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StatusHistory = sequelize.define('StatusHistory', {
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
    actorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'rejected', 'escalated'),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'status_history',
    timestamps: true
  });

  return StatusHistory;
};
