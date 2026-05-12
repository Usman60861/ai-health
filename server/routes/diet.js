import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import DietPlan from '../models/DietPlan.js';
import { generateDietPlan } from '../services/aiService.js';

const router = express.Router();

router.post('/generate', authenticate, async (req, res) => {
  try {
    const { budgetPreference } = req.body;
    const aiPlan = await generateDietPlan(req.user.profile, budgetPreference);
    const dietPlan = new DietPlan({
      userId: req.user._id,
      budgetPreference,
      ...aiPlan
    });
    await dietPlan.save();
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/current', authenticate, async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ userId: req.user._id, status: 'active' }).sort('-createdAt');
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.user._id }).sort('-createdAt');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/modify-meal', authenticate, async (req, res) => {
  try {
    const { mealType, action, food, itemIndex, replaceIndex } = req.body;
    
    // Get current diet plan
    const plan = await DietPlan.findOne({ userId: req.user._id, status: 'active' }).sort('-createdAt');
    if (!plan) {
      return res.status(404).json({ error: 'No active diet plan found' });
    }

    // Helper function to calculate meal total calories
    const calculateMealTotal = (items) => {
      return items.reduce((total, item) => total + (item.calories || 0), 0);
    };

    // Modify the meal based on action
    if (action === 'add') {
      if (mealType === 'breakfast' && plan.meals.breakfast) {
        plan.meals.breakfast.items.push(food);
        plan.meals.breakfast.totalCalories = calculateMealTotal(plan.meals.breakfast.items);
      } else if (mealType === 'lunch' && plan.meals.lunch) {
        plan.meals.lunch.items.push(food);
        plan.meals.lunch.totalCalories = calculateMealTotal(plan.meals.lunch.items);
      } else if (mealType === 'dinner' && plan.meals.dinner) {
        plan.meals.dinner.items.push(food);
        plan.meals.dinner.totalCalories = calculateMealTotal(plan.meals.dinner.items);
      } else if (mealType.startsWith('snack-')) {
        const snackIndex = parseInt(mealType.split('-')[1]);
        if (plan.meals.snacks && plan.meals.snacks[snackIndex]) {
          plan.meals.snacks[snackIndex].items.push(food);
          plan.meals.snacks[snackIndex].totalCalories = calculateMealTotal(plan.meals.snacks[snackIndex].items);
        }
      }
    } else if (action === 'remove') {
      if (mealType === 'breakfast' && plan.meals.breakfast) {
        plan.meals.breakfast.items.splice(itemIndex, 1);
        plan.meals.breakfast.totalCalories = calculateMealTotal(plan.meals.breakfast.items);
      } else if (mealType === 'lunch' && plan.meals.lunch) {
        plan.meals.lunch.items.splice(itemIndex, 1);
        plan.meals.lunch.totalCalories = calculateMealTotal(plan.meals.lunch.items);
      } else if (mealType === 'dinner' && plan.meals.dinner) {
        plan.meals.dinner.items.splice(itemIndex, 1);
        plan.meals.dinner.totalCalories = calculateMealTotal(plan.meals.dinner.items);
      } else if (mealType.startsWith('snack-')) {
        const snackIndex = parseInt(mealType.split('-')[1]);
        if (plan.meals.snacks && plan.meals.snacks[snackIndex]) {
          plan.meals.snacks[snackIndex].items.splice(itemIndex, 1);
          plan.meals.snacks[snackIndex].totalCalories = calculateMealTotal(plan.meals.snacks[snackIndex].items);
        }
      }
    } else if (action === 'replace') {
      // Replace food at specific index
      if (mealType === 'breakfast' && plan.meals.breakfast) {
        plan.meals.breakfast.items[replaceIndex] = food;
        plan.meals.breakfast.totalCalories = calculateMealTotal(plan.meals.breakfast.items);
      } else if (mealType === 'lunch' && plan.meals.lunch) {
        plan.meals.lunch.items[replaceIndex] = food;
        plan.meals.lunch.totalCalories = calculateMealTotal(plan.meals.lunch.items);
      } else if (mealType === 'dinner' && plan.meals.dinner) {
        plan.meals.dinner.items[replaceIndex] = food;
        plan.meals.dinner.totalCalories = calculateMealTotal(plan.meals.dinner.items);
      }
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/review', authenticate, authorize('nutritionist', 'admin'), async (req, res) => {
  try {
    const plan = await DietPlan.findByIdAndUpdate(
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
