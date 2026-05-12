import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';

dotenv.config();

// Budget mapping based on typical Pakistani food prices
const budgetMapping = {
  // Low budget foods (under 50 PKR per serving)
  'Oatmeal': { budget: 'low', priceRange: { min: 15, max: 25, currency: 'PKR' } },
  'Brown Rice': { budget: 'low', priceRange: { min: 20, max: 35, currency: 'PKR' } },
  'Banana': { budget: 'low', priceRange: { min: 8, max: 15, currency: 'PKR' } },
  'Eggs': { budget: 'low', priceRange: { min: 25, max: 40, currency: 'PKR' } },
  'Spinach': { budget: 'low', priceRange: { min: 30, max: 50, currency: 'PKR' } },
  'Orange': { budget: 'low', priceRange: { min: 12, max: 20, currency: 'PKR' } },
  'Sweet Potato': { budget: 'low', priceRange: { min: 15, max: 30, currency: 'PKR' } },
  'Lentils': { budget: 'low', priceRange: { min: 40, max: 60, currency: 'PKR' } },

  // Medium budget foods (50-150 PKR per serving)
  'Grilled Chicken Breast': { budget: 'medium', priceRange: { min: 80, max: 120, currency: 'PKR' } },
  'Greek Yogurt': { budget: 'medium', priceRange: { min: 60, max: 90, currency: 'PKR' } },
  'Broccoli': { budget: 'medium', priceRange: { min: 80, max: 120, currency: 'PKR' } },
  'Apple': { budget: 'medium', priceRange: { min: 25, max: 40, currency: 'PKR' } },
  'Cottage Cheese': { budget: 'medium', priceRange: { min: 80, max: 120, currency: 'PKR' } },

  // High budget foods (above 150 PKR per serving)
  'Tuna': { budget: 'high', priceRange: { min: 200, max: 300, currency: 'PKR' } },
  'Turkey Breast': { budget: 'high', priceRange: { min: 250, max: 350, currency: 'PKR' } },
  'Avocado': { budget: 'high', priceRange: { min: 150, max: 250, currency: 'PKR' } },
  'Salmon': { budget: 'high', priceRange: { min: 400, max: 600, currency: 'PKR' } },
  'Quinoa': { budget: 'high', priceRange: { min: 120, max: 180, currency: 'PKR' } },
  'Walnuts': { budget: 'high', priceRange: { min: 200, max: 300, currency: 'PKR' } },
  'Almonds': { budget: 'high', priceRange: { min: 180, max: 280, currency: 'PKR' } }
};

async function updateFoodBudgets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-health-fitness');
    console.log('Connected to MongoDB');

    const foods = await Food.find({});
    console.log(`Found ${foods.length} foods to update`);

    for (const food of foods) {
      const budgetInfo = budgetMapping[food.name];
      if (budgetInfo) {
        await Food.findByIdAndUpdate(food._id, {
          budget: budgetInfo.budget,
          priceRange: budgetInfo.priceRange
        });
        console.log(`Updated ${food.name} with ${budgetInfo.budget} budget`);
      } else {
        // Set default budget for foods not in mapping
        await Food.findByIdAndUpdate(food._id, {
          budget: 'medium',
          priceRange: { min: 50, max: 100, currency: 'PKR' }
        });
        console.log(`Set default budget for ${food.name}`);
      }
    }

    console.log('Budget update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
}

updateFoodBudgets();