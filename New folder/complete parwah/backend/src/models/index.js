// const { Sequelize } = require('sequelize');
// const config = require('../config/config.json');

// const env = process.env.NODE_ENV || 'development';
// const dbConfig = config[env];

// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.username,
//   dbConfig.password,
//   {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect,
//     logging: false
//   }
// );

// // Import models
// const User = require('./User')(sequelize);
// const Department = require('./Department')(sequelize);
// const Category = require('./Category')(sequelize);
// const Complaint = require('./Complaint')(sequelize);
// const ComplaintImage = require('./ComplaintImage')(sequelize);
// const Comment = require('./Comment')(sequelize);
// const Vote = require('./Vote')(sequelize);
// const Notification = require('./Notification')(sequelize);
// const UserPoint = require('./UserPoint')(sequelize);
// const Neighborhood = require('./Neighborhood')(sequelize);

// // Define relationships
// // User relationships
// User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
// User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
// User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
// User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
// User.hasOne(UserPoint, { foreignKey: 'userId', as: 'points' });
// User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// // Department relationships
// Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });
// Department.hasMany(Category, { foreignKey: 'departmentId', as: 'categories' });
// Department.hasMany(Complaint, { foreignKey: 'departmentId', as: 'complaints' });

// // Category relationships
// Category.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
// Category.hasMany(Complaint, { foreignKey: 'categoryId', as: 'complaints' });
// Category.hasMany(Neighborhood, { foreignKey: 'categoryId', as: 'neighborhoods' });

// // Complaint relationships
// Complaint.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });
// Complaint.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
// Complaint.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
// Complaint.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
// Complaint.hasMany(ComplaintImage, { foreignKey: 'complaintId', as: 'images' });
// Complaint.hasMany(Comment, { foreignKey: 'complaintId', as: 'comments' });
// Complaint.hasMany(Vote, { foreignKey: 'complaintId', as: 'votes' });
// Complaint.hasMany(Notification, { foreignKey: 'complaintId', as: 'notifications' });
// Complaint.belongsTo(Complaint, { foreignKey: 'duplicateOf', as: 'originalComplaint' });
// Complaint.belongsTo(Neighborhood, { foreignKey: 'neighborhoodGroupId', as: 'neighborhood' });

// // ComplaintImage relationships
// ComplaintImage.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

// // Comment relationships
// Comment.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
// Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Vote relationships
// Vote.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
// Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Notification relationships
// Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Notification.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

// // UserPoint relationships
// UserPoint.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Neighborhood relationships
// Neighborhood.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
// Neighborhood.hasMany(Complaint, { foreignKey: 'neighborhoodGroupId', as: 'complaints' });

// const db = {
//   sequelize,
//   Sequelize,
//   User,
//   Department,
//   Category,
//   Complaint,
//   ComplaintImage,
//   Comment,
//   Vote,
//   Notification,
//   UserPoint,
//   Neighborhood
// };

// module.exports = db;


const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Use connection URL if provided
const sequelize = dbConfig.url 
  ? new Sequelize(dbConfig.url, {
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
      logging: false
    })
  : new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false
      }
    );

// Import all models
const User = require('./User')(sequelize);
const Department = require('./Department')(sequelize);
const Category = require('./Category')(sequelize);
const Complaint = require('./Complaint')(sequelize);
const ComplaintImage = require('./ComplaintImage')(sequelize);
const Comment = require('./Comment')(sequelize);
const Vote = require('./Vote')(sequelize);
const Notification = require('./Notification')(sequelize);
const UserPoint = require('./UserPoint')(sequelize);
const Neighborhood = require('./Neighborhood')(sequelize);
const StatusHistory = require('./StatusHistory')(sequelize);

// Define all relationships
User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasOne(UserPoint, { foreignKey: 'userId', as: 'points' });
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });
Department.hasMany(Category, { foreignKey: 'departmentId', as: 'categories' });
Department.hasMany(Complaint, { foreignKey: 'departmentId', as: 'complaints' });

Category.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Category.hasMany(Complaint, { foreignKey: 'categoryId', as: 'complaints' });
Category.hasMany(Neighborhood, { foreignKey: 'categoryId', as: 'neighborhoods' });

Complaint.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });
Complaint.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Complaint.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Complaint.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
Complaint.hasMany(ComplaintImage, { foreignKey: 'complaintId', as: 'images' });
Complaint.hasMany(Comment, { foreignKey: 'complaintId', as: 'comments' });
Complaint.hasMany(Vote, { foreignKey: 'complaintId', as: 'votes' });
Complaint.hasMany(Notification, { foreignKey: 'complaintId', as: 'notifications' });
Complaint.belongsTo(Complaint, { foreignKey: 'duplicateOf', as: 'originalComplaint' });
Complaint.belongsTo(Neighborhood, { foreignKey: 'neighborhoodGroupId', as: 'neighborhood' });
Complaint.hasMany(StatusHistory, { foreignKey: 'complaintId', as: 'statusHistory' });

ComplaintImage.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

Comment.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Vote.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

UserPoint.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Neighborhood.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Neighborhood.hasMany(Complaint, { foreignKey: 'neighborhoodGroupId', as: 'complaints' });

StatusHistory.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
StatusHistory.belongsTo(User, { foreignKey: 'actorId', as: 'actor' });

// Export everything
const db = {
  sequelize,
  Sequelize,
  User,
  Department,
  Category,
  Complaint,
  ComplaintImage,
  Comment,
  Vote,
  Notification,
  UserPoint,
  Neighborhood,
  StatusHistory
};

module.exports = db;
