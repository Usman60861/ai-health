import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Progress from '../models/Progress.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const progress = new Progress({
      userId: req.user._id,
      ...req.body
    });
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const progress = await Progress.find(query).sort('-date');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id }).sort('-date').limit(30);
    const stats = {
      weightChange: progress.length > 1 ? progress[0].weight - progress[progress.length - 1].weight : 0,
      avgCalories: progress.reduce((sum, p) => sum + (p.caloriesConsumed || 0), 0) / progress.length,
      avgSleep: progress.reduce((sum, p) => sum + (p.sleepHours || 0), 0) / progress.length,
      data: progress
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
