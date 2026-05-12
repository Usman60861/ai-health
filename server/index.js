import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root directory (one level up from server/)
dotenv.config({ path: join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import detectPort from 'detect-port';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dietRoutes from './routes/diet.js';
import workoutRoutes from './routes/workout.js';
import foodRoutes from './routes/food.js';
import progressRoutes from './routes/progress.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import foodItemsRoutes from './routes/foodItems.js';


const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 5000;

// Log environment configuration on startup
console.log('🔧 Environment Configuration:');
console.log('   AI_PROVIDER:', process.env.AI_PROVIDER || 'not set');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
console.log('   PORT:', DEFAULT_PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/food-items', foodItemsRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'AI Health & Fitness API' });
});

// Auto-detect free port and start server
const startServer = async () => {
  try {
    const port = await detectPort(DEFAULT_PORT);
    
    if (port !== DEFAULT_PORT) {
      console.log(`⚠️ Port ${DEFAULT_PORT} is busy, switching to free port ${port}`);
    }
    
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
      console.log(`🌐 API URL: http://localhost:${port}`);
      console.log(`📋 Health Check: http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
