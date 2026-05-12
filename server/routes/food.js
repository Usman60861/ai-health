import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Food from '../models/Food.js';
import { chatWithAI } from '../services/aiService.js';

const router = express.Router();

// Get all foods (for admin panel)
router.get('/', authenticate, async (req, res) => {
  try {
    const foods = await Food.find({}).sort({ createdAt: -1 });
    console.log('GET /food - Found foods:', foods.length);
    res.json(foods);
  } catch (error) {
    console.error('GET /food error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    let foods;
    if (!q || q.trim() === '') {
      // Return all foods if no query
      foods = await Food.find({}).limit(50);
    } else {
      // Search by name or tags
      foods = await Food.find({
        $or: [
          { name: new RegExp(q, 'i') },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ]
      }).limit(20);
    }
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/recommend', authenticate, async (req, res) => {
  try {
    const { query } = req.body;
    
    // Database-specific AI prompt
    const databasePrompt = `You are a FOOD DATABASE assistant. Only suggest foods that exist in our database. 
    
    Available foods in database: Oatmeal, Grilled Chicken Breast, Brown Rice, Greek Yogurt, Banana, Eggs, Spinach, Broccoli, Orange, Apple, Sweet Potato, Tuna, Turkey Breast, Avocado, Salmon, Quinoa, Cottage Cheese, Lentils, Walnuts, Almonds.
    
    User query: "${query}"
    
    ONLY respond with:
    1. Food recommendations from the above list
    2. Nutrition comparisons between database foods
    3. Meal combinations using database foods
    4. Quick food facts from database
    
    DO NOT give general health advice, workout plans, or lifestyle tips. For detailed health guidance, suggest: "For comprehensive health advice, please use the AI Chat feature."
    
    Keep responses focused on foods from our database only.`;
    
    const response = await chatWithAI(req.user.profile, databasePrompt);
    res.json({ recommendation: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    console.log('POST /food - Adding food:', req.body);
    const food = new Food(req.body);
    await food.save();
    console.log('POST /food - Food saved:', food);
    res.status(201).json(food);
  } catch (error) {
    console.error('POST /food error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    console.log('PUT /food/:id - Updating food:', req.params.id, req.body);
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('PUT /food/:id - Food updated:', food);
    res.json(food);
  } catch (error) {
    console.error('PUT /food/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete food (for admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    console.log('DELETE /food/:id - Deleting food:', req.params.id);
    const food = await Food.findByIdAndDelete(req.params.id);
    console.log('DELETE /food/:id - Food deleted:', food);
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('DELETE /food/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
