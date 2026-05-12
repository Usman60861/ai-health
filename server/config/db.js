import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-health-fitness');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database. Some features may not work.');
    console.log('💡 To fix: Start MongoDB service or use MongoDB Atlas');
    // Don't exit - allow server to run for testing AI features
  }
};

export default connectDB;
