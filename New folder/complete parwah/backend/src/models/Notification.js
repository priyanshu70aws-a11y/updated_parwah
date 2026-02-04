const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    complaintId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'complaints',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'status_update',
        'comment',
        'assignment',
        'escalation',
        'resolution',
        'system',
        'complaint_created',
        'duplicate_reported',
        'vote'
      ),
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sentVia: {
      type: DataTypes.ARRAY(DataTypes.ENUM('app', 'email', 'sms', 'whatsapp')),
      defaultValue: ['app']
    }
  }, {
    tableName: 'notifications',
    timestamps: true
  });

  return Notification;
};
