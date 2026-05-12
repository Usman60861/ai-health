import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import { generateWorkoutPlan } from '../services/aiService.js';

const router = express.Router();

router.post('/generate', authenticate, async (req, res) => {
  try {
    const { level, location, limitations } = req.body;
    const aiPlan = await generateWorkoutPlan(req.user.profile, level, location, limitations);
    const workoutPlan = new WorkoutPlan({
      userId: req.user._id,
      level,
      location,
      limitations,
      ...aiPlan
    });
    await workoutPlan.save();
    res.json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/current', authenticate, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id, status: 'active' }).sort('-createdAt');
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/review', authenticate, authorize('nutritionist', 'admin'), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, reviewedBy: req.user._id } },
      { new: true }
    );
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
