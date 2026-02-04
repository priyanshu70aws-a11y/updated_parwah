const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPoint = sequelize.define('UserPoint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    complaintsReported: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    complaintsResolved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    upvotesReceived: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    badges: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  }, {
    tableName: 'user_points',
    timestamps: true
  });

  return UserPoint;
};