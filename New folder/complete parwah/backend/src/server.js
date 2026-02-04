const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');

    if (process.env.DB_SYNC === 'true') {
      await db.sequelize.sync({ alter: true });
      console.log('✅ Database synced');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
