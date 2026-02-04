const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vote = sequelize.define('Vote', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    voteType: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false
    }
  }, {
    tableName: 'votes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['complaintId', 'userId']
      }
    ]
  });

  return Vote;
};