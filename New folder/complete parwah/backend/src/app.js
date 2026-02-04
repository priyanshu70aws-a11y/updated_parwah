// // const express = require('express');
// // const cors = require('cors');
// // require('dotenv').config();

// // const app = express();

// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // Routes
// // const authRoutes = require('./routes/authRoutes');
// // const complaintRoutes = require('./routes/complaintRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const statsRoutes = require('./routes/statsRoutes');

// // app.get('/', (req, res) => {
// //   res.json({ 
// //     message: 'PARWAH API',
// //     endpoints: {
// //       complaints: '/api/complaints',
// //       users: '/api/users',
// //       stats: '/api/stats'
// //     }
// //   });
// // });

// // app.use('/api/complaints', complaintRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/stats', statsRoutes);
// // app.use('/api/auth', authRoutes);

// // module.exports = app;

















// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Import routes
// const complaintRoutes = require('./routes/complaintRoutes');
// const userRoutes = require('./routes/userRoutes');
// const statsRoutes = require('./routes/statsRoutes');
// const authRoutes = require('./routes/authRoutes'); // ✅ Make sure this exists

// // Basic route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'PARWAH API is running!',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',        // ✅ Add this
//       complaints: '/api/complaints',
//       users: '/api/users',
//       stats: '/api/stats'
//     }
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);        // ✅ Make sure this exists
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/stats', statsRoutes);

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// module.exports = app;



const voteRoutes = require('./routes/voteRoutes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const commentRoutes = require('./routes/commentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const realtimeRoutes = require('./routes/realtimeRoutes');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'PARWAH API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      complaints: '/api/complaints',
      users: '/api/users',
      stats: '/api/stats'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/votes', voteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/realtime', realtimeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
