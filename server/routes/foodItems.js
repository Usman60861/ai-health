import express from 'express';
import FoodItem from '../models/FoodItem.js';
import { authenticate } from '../middleware/auth.js';
import { defaultFoods } from '../data/foodDatabase.js';

const router = express.Router();

// Get all food items
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foodItems = await FoodItem.find(query).sort({ name: 1 });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get food item by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create custom food item
router.post('/', authenticate, async (req, res) => {
  try {
    const foodItem = new FoodItem({
      ...req.body,
      isCustom: true,
      createdBy: req.userId
    });
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed default food items (admin only)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Seeding food database...');
    
    await FoodItem.deleteMany({}); // Clear existing
    await FoodItem.insertMany(defaultFoods);
    
    console.log(`✅ Successfully seeded ${defaultFoods.length} food items`);
    
    res.json({ 
      message: 'Food items seeded successfully', 
      count: defaultFoods.length,
      categories: {
        grains: defaultFoods.filter(f => f.category === 'grains').length,
        protein: defaultFoods.filter(f => f.category === 'protein').length,
        vegetables: defaultFoods.filter(f => f.category === 'vegetables').length,
        fruits: defaultFoods.filter(f => f.category === 'fruits').length,
        dairy: defaultFoods.filter(f => f.category === 'dairy').length,
        snacks: defaultFoods.filter(f => f.category === 'snacks').length,
        beverages: defaultFoods.filter(f => f.category === 'beverages').length,
        sweets: defaultFoods.filter(f => f.category === 'sweets').length
      }
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
