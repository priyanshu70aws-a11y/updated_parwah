// // const db = require('./models');

// // async function testConnection() {
// //   try {
// //     await db.sequelize.authenticate();
// //     console.log('✅ Database connection established successfully');
    
// //     // Sync all models
// //     await db.sequelize.sync({ alter: true });
// //     console.log('✅ All models synchronized');
    
// //     process.exit(0);
// //   } catch (error) {
// //     console.error('❌ Unable to connect to database:', error);
// //     process.exit(1);
// //   }
// // }

// // testConnection();

// const db = require('./models');

// async function testConnection() {
//   try {
//     await db.sequelize.authenticate();
//     console.log('✅ Database connection established successfully');
    
//     // Sync models in correct order (tables without foreign keys first)
//     await db.Department.sync({ force: true });
//     console.log('✅ Departments table created');
    
//     await db.Category.sync({ force: true });
//     console.log('✅ Categories table created');
    
//     await db.User.sync({ force: true });
//     console.log('✅ Users table created');
    
//     await db.UserPoint.sync({ force: true });
//     console.log('✅ UserPoints table created');
    
//     await db.Neighborhood.sync({ force: true });
//     console.log('✅ Neighborhoods table created');
    
//     await db.Complaint.sync({ force: true });
//     console.log('✅ Complaints table created');
    
//     await db.ComplaintImage.sync({ force: true });
//     console.log('✅ ComplaintImages table created');
    
//     await db.Comment.sync({ force: true });
//     console.log('✅ Comments table created');
    
//     await db.Vote.sync({ force: true });
//     console.log('✅ Votes table created');
    
//     await db.Notification.sync({ force: true });
//     console.log('✅ Notifications table created');
    
//     console.log('\n🎉 All tables created successfully!');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Unable to connect to database:', error);
//     process.exit(1);
//   }
// }

// testConnection();






















const db = require('./models');

async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Drop all tables first, then recreate with correct references
    await db.sequelize.sync({ force: true });
    console.log('✅ All models synchronized');
    
    console.log('\n🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1);
  }
}

testConnection();