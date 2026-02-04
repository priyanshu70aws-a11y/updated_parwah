const bcrypt = require('bcryptjs');
const db = require('../src/models');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await db.sequelize.sync({ force: true });
    console.log('✅ Database cleared\n');

    // 1. Create Departments
    console.log('Creating departments...');
    const departments = await db.Department.bulkCreate([
      {
        name: 'Public Works Department',
        description: 'Handles roads, drainage, and infrastructure',
        email: 'pwd@city.gov',
        phone: '+91-9876543210',
        headName: 'Rajesh Kumar'
      },
      {
        name: 'Sanitation Department',
        description: 'Manages garbage collection and cleanliness',
        email: 'sanitation@city.gov',
        phone: '+91-9876543211',
        headName: 'Priya Sharma'
      },
      {
        name: 'Electricity Department',
        description: 'Handles streetlights and power issues',
        email: 'electricity@city.gov',
        phone: '+91-9876543212',
        headName: 'Amit Verma'
      },
      {
        name: 'Water Supply Department',
        description: 'Manages water supply and sewage',
        email: 'water@city.gov',
        phone: '+91-9876543213',
        headName: 'Sneha Reddy'
      }
    ]);
    console.log(`✅ Created ${departments.length} departments\n`);

    // 2. Create Categories
    console.log('Creating categories...');
    const categories = await db.Category.bulkCreate([
      {
        name: 'Pothole',
        slug: 'pothole',
        description: 'Road damage and potholes',
        icon: '🕳️',
        color: '#ef4444',
        departmentId: departments[0].id,
        priorityLevel: 4
      },
      {
        name: 'Garbage',
        slug: 'garbage',
        description: 'Garbage not collected or overflowing bins',
        icon: '🗑️',
        color: '#f59e0b',
        departmentId: departments[1].id,
        priorityLevel: 3
      },
      {
        name: 'Streetlight',
        slug: 'streetlight',
        description: 'Non-functional streetlights',
        icon: '💡',
        color: '#eab308',
        departmentId: departments[2].id,
        priorityLevel: 2
      },
      {
        name: 'Water Leakage',
        slug: 'water-leakage',
        description: 'Water pipeline leaks',
        icon: '💧',
        color: '#3b82f6',
        departmentId: departments[3].id,
        priorityLevel: 5
      },
      {
        name: 'Drainage',
        slug: 'drainage',
        description: 'Blocked or overflowing drains',
        icon: '🚰',
        color: '#8b5cf6',
        departmentId: departments[0].id,
        priorityLevel: 4
      }
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // 3. Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await db.User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@parwah.com',
        phone: '+91-9999999999',
        password: hashedPassword,
        role: 'admin',
        city: 'Greater Noida',
        isVerified: true
      },
      {
        name: 'Saurabh Prabhakar',
        email: 'saurabh@example.com',
        phone: '+91-9876543220',
        password: hashedPassword,
        role: 'citizen',
        address: 'Sector 10, Greater Noida',
        city: 'Greater Noida',
        pincode: '201310',
        isVerified: true
      },
      {
        name: 'Shreeya Shatabdi',
        email: 'shreeya@example.com',
        phone: '+91-9876543221',
        password: hashedPassword,
        role: 'citizen',
        address: 'Sector 12, Greater Noida',
        city: 'Greater Noida',
        pincode: '201310',
        isVerified: true
      },
      {
        name: 'Priyanshi Jain',
        email: 'priyanshi@example.com',
        phone: '+91-9876543222',
        password: hashedPassword,
        role: 'citizen',
        address: 'Sector 16, Greater Noida',
        city: 'Greater Noida',
        pincode: '201310',
        isVerified: true
      },
      {
        name: 'Department Head PWD',
        email: 'head.pwd@city.gov',
        phone: '+91-9876543230',
        password: hashedPassword,
        role: 'department_head',
        departmentId: departments[0].id,
        city: 'Greater Noida',
        isVerified: true
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // 4. Create User Points
    console.log('Creating user points...');
    await db.UserPoint.bulkCreate([
      {
        userId: users[1].id,
        totalPoints: 150,
        complaintsReported: 5,
        complaintsResolved: 2,
        upvotesReceived: 20,
        rank: 1,
        badges: ['First Reporter', 'Community Helper']
      },
      {
        userId: users[2].id,
        totalPoints: 100,
        complaintsReported: 3,
        complaintsResolved: 1,
        upvotesReceived: 15,
        rank: 2,
        badges: ['Active Citizen']
      },
      {
        userId: users[3].id,
        totalPoints: 80,
        complaintsReported: 2,
        complaintsResolved: 1,
        upvotesReceived: 10,
        rank: 3,
        badges: []
      }
    ]);
    console.log('✅ Created user points\n');

    // 5. Create Complaints
    console.log('Creating complaints...');
    const complaints = await db.Complaint.bulkCreate([
      {
        title: 'Large pothole near GNIOT college gate',
        description: 'There is a big pothole causing traffic issues and accidents',
        userId: users[1].id,
        categoryId: categories[0].id,
        departmentId: departments[0].id,
        status: 'in_progress',
        priority: 'high',
        latitude: 28.4744,
        longitude: 77.5040,
        address: 'Near GNIOT College, Greater Noida',
        landmark: 'College Main Gate',
        upvotes: 15,
        downvotes: 1,
        assignedTo: users[4].id,
        estimatedResolutionTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Garbage not collected for 3 days',
        description: 'Garbage bins are overflowing in Sector 10',
        userId: users[2].id,
        categoryId: categories[1].id,
        departmentId: departments[1].id,
        status: 'pending',
        priority: 'medium',
        latitude: 28.4750,
        longitude: 77.5050,
        address: 'Sector 10, Greater Noida',
        upvotes: 8,
        downvotes: 0
      },
      {
        title: 'Streetlight not working',
        description: '3 streetlights not working on main road',
        userId: users[1].id,
        categoryId: categories[2].id,
        departmentId: departments[2].id,
        status: 'resolved',
        priority: 'low',
        latitude: 28.4755,
        longitude: 77.5055,
        address: 'Sector 12 Main Road, Greater Noida',
        upvotes: 5,
        downvotes: 0,
        resolvedAt: new Date(),
        resolutionNotes: 'All streetlights repaired and tested'
      },
      {
        title: 'Water leakage on main road',
        description: 'Major water pipeline leak causing road flooding',
        userId: users[3].id,
        categoryId: categories[3].id,
        departmentId: departments[3].id,
        status: 'escalated',
        priority: 'critical',
        latitude: 28.4760,
        longitude: 77.5060,
        address: 'Sector 16, Greater Noida',
        upvotes: 25,
        downvotes: 0
      },
      {
        title: 'Blocked drainage causing waterlogging',
        description: 'Drain is blocked, causing water accumulation during rain',
        userId: users[2].id,
        categoryId: categories[4].id,
        departmentId: departments[0].id,
        status: 'pending',
        priority: 'high',
        latitude: 28.4765,
        longitude: 77.5065,
        address: 'Sector 18, Greater Noida',
        upvotes: 12,
        downvotes: 1
      }
    ]);
    console.log(`✅ Created ${complaints.length} complaints\n`);

    // 6. Create Comments
    console.log('Creating comments...');
    await db.Comment.bulkCreate([
      {
        complaintId: complaints[0].id,
        userId: users[2].id,
        content: 'Yes, I also faced issues because of this pothole yesterday!',
        isOfficial: false
      },
      {
        complaintId: complaints[0].id,
        userId: users[4].id,
        content: 'We have assigned a team to fix this. Work will start tomorrow.',
        isOfficial: true
      },
      {
        complaintId: complaints[1].id,
        userId: users[3].id,
        content: 'Same problem in our area too!',
        isOfficial: false
      }
    ]);
    console.log('✅ Created comments\n');

    // 7. Create Votes
    console.log('Creating votes...');
    await db.Vote.bulkCreate([
      { complaintId: complaints[0].id, userId: users[2].id, voteType: 'upvote' },
      { complaintId: complaints[0].id, userId: users[3].id, voteType: 'upvote' },
      { complaintId: complaints[1].id, userId: users[1].id, voteType: 'upvote' },
      { complaintId: complaints[3].id, userId: users[1].id, voteType: 'upvote' },
      { complaintId: complaints[3].id, userId: users[2].id, voteType: 'upvote' }
    ]);
    console.log('✅ Created votes\n');

    // 8. Create Notifications
    console.log('Creating notifications...');
    await db.Notification.bulkCreate([
      {
        userId: users[1].id,
        complaintId: complaints[0].id,
        title: 'Status Update',
        message: 'Your complaint has been assigned to Public Works Department',
        type: 'assignment',
        sentVia: ['app', 'email']
      },
      {
        userId: users[1].id,
        complaintId: complaints[0].id,
        title: 'New Comment',
        message: 'Department head commented on your complaint',
        type: 'comment',
        isRead: false,
        sentVia: ['app']
      }
    ]);
    console.log('✅ Created notifications\n');

    console.log('🎉 Database seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   - ${departments.length} Departments`);
    console.log(`   - ${categories.length} Categories`);
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${complaints.length} Complaints`);
    console.log('\n✅ Login credentials:');
    console.log('   Email: admin@parwah.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();