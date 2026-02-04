const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Complaint = sequelize.define('Complaint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'rejected', 'escalated'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolutionNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

  

  // updation after first part


    estimatedResolutionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
// ⬇️ ADD THESE TWO NEW FIELDS HERE ⬇️
    duplicateCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    supporters: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    isDuplicate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    duplicateOf: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'complaints',
        key: 'id'
      }
    },








    
    neighborhoodGroupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'neighborhoods',
        key: 'id'
      }
    }
  }, {
    tableName: 'complaints',
    timestamps: true
  });

  return Complaint;
};