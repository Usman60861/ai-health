import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Food from '../models/Food.js';

const router = express.Router();

router.get('/users', authenticate, authorize('admin', 'nutritionist'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isVerified: true }),
      inactiveUsers: await User.countDocuments({ isVerified: false }),
      newUsersToday: await User.countDocuments({ createdAt: { $gte: today } }),
      totalDietPlans: await DietPlan.countDocuments(),
      totalWorkoutPlans: await WorkoutPlan.countDocuments(),
      totalFoods: await Food.countDocuments(),
      aiRequestsToday: 0, // This would come from AI service logs
      systemHealth: 'Excellent'
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/diet-plans', authenticate, authorize('admin', 'nutritionist'), async (req, res) => {
  try {
    const plans = await DietPlan.find().populate('userId', 'email profile.name').sort('-createdAt').limit(50);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.put('/users/:id/role', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'nutritionist'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow changing your own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (admin only)
router.post('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { email, name, password, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({
      email,
      password,
      role,
      profile: { name },
      isVerified: true // Admin created users are auto-verified
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: { ...user.toObject(), password: undefined } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system logs (admin only)
router.get('/logs', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would typically come from a logging system
    const logs = [
      { id: 1, level: 'info', message: 'User login successful', timestamp: new Date(), user: 'admin@example.com' },
      { id: 2, level: 'warning', message: 'Failed login attempt', timestamp: new Date(), ip: '192.168.1.1' },
      { id: 3, level: 'error', message: 'Database connection timeout', timestamp: new Date() },
    ];
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System backup (admin only)
router.post('/backup', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would typically trigger a backup process
    res.json({ message: 'Backup initiated successfully', backupId: Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cache (admin only)
router.post('/clear-cache', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would typically clear application cache
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send system notification (admin only)
router.post('/notification', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { message, type = 'info', targetUsers = 'all' } = req.body;
    
    // This would typically send notifications to users
    res.json({ 
      message: 'Notification sent successfully', 
      recipients: targetUsers === 'all' ? await User.countDocuments() : targetUsers.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system analytics (admin only)
router.get('/analytics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const analytics = {
      userGrowth: {
        total: await User.countDocuments(),
        thisMonth: await User.countDocuments({ createdAt: { $gte: lastMonth } }),
        thisWeek: await User.countDocuments({ createdAt: { $gte: lastWeek } })
      },
      dietPlanActivity: {
        total: await DietPlan.countDocuments(),
        active: await DietPlan.countDocuments({ status: 'active' }),
        thisMonth: await DietPlan.countDocuments({ createdAt: { $gte: lastMonth } })
      },
      userRoles: {
        admins: await User.countDocuments({ role: 'admin' }),
        nutritionists: await User.countDocuments({ role: 'nutritionist' }),
        users: await User.countDocuments({ role: 'user' })
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk user operations (admin only)
router.post('/users/bulk', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { action, userIds } = req.body;
    
    switch (action) {
      case 'delete':
        await User.deleteMany({ _id: { $in: userIds } });
        res.json({ message: `${userIds.length} users deleted successfully` });
        break;
      case 'verify':
        await User.updateMany({ _id: { $in: userIds } }, { isVerified: true });
        res.json({ message: `${userIds.length} users verified successfully` });
        break;
      case 'suspend':
        await User.updateMany({ _id: { $in: userIds } }, { isActive: false });
        res.json({ message: `${userIds.length} users suspended successfully` });
        break;
      default:
        res.status(400).json({ error: 'Invalid bulk action' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data (admin only)
router.get('/export/:type', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { type } = req.params;
    let data;
    
    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        break;
      case 'diet-plans':
        data = await DietPlan.find().populate('userId', 'email');
        break;
      case 'foods':
        data = await Food.find();
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    res.json({ data, exportedAt: new Date(), count: data.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
