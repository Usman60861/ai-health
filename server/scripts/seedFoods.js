import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';

dotenv.config();

const sampleFoods = [
  // Popular Foods
  {
    name: 'Oatmeal',
    category: 'Grains',
    servingSize: '1 cup',
    nutrition: { calories: 150, protein: 5, carbs: 27, fats: 3, fiber: 4, sugar: 1, sodium: 0 },
    tags: ['breakfast', 'high-fiber', 'popular'],
    suitableFor: ['veg', 'vegan', 'diabetic'],
    avoidFor: [],
    icon: '🥣',
    budget: 'low',
    priceRange: { min: 15, max: 25, currency: 'PKR' }
  },
  {
    name: 'Grilled Chicken Breast',
    category: 'Protein',
    servingSize: '150g',
    nutrition: { calories: 250, protein: 30, carbs: 0, fats: 10, fiber: 0, sugar: 0, sodium: 70 },
    tags: ['lunch', 'dinner', 'high-protein', 'popular'],
    suitableFor: ['non-veg', 'keto'],
    avoidFor: ['veg', 'vegan'],
    icon: '🍗',
    budget: 'medium',
    priceRange: { min: 80, max: 120, currency: 'PKR' }
  },
  {
    name: 'Brown Rice',
    category: 'Grains',
    servingSize: '1 cup',
    nutrition: { calories: 215, protein: 5, carbs: 45, fats: 2, fiber: 3, sugar: 1, sodium: 10 },
    tags: ['lunch', 'dinner', 'popular'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: ['keto'],
    icon: '🍚',
    budget: 'low',
    priceRange: { min: 20, max: 35, currency: 'PKR' }
  },
  {
    name: 'Greek Yogurt',
    category: 'Dairy',
    servingSize: '1 cup',
    nutrition: { calories: 100, protein: 17, carbs: 6, fats: 0, fiber: 0, sugar: 6, sodium: 65 },
    tags: ['breakfast', 'snack', 'high-protein', 'low-calorie', 'popular'],
    suitableFor: ['veg'],
    avoidFor: ['vegan', 'lactose-intolerant'],
    icon: '🥛',
    budget: 'medium',
    priceRange: { min: 60, max: 90, currency: 'PKR' }
  },
  {
    name: 'Banana',
    category: 'Fruits',
    servingSize: '1 medium',
    nutrition: { calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3, sugar: 14, sodium: 1 },
    tags: ['snack', 'breakfast', 'popular'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: [],
    icon: '🍌',
    budget: 'low',
    priceRange: { min: 8, max: 15, currency: 'PKR' }
  },
  {
    name: 'Eggs',
    category: 'Protein',
    servingSize: '2 large',
    nutrition: { calories: 140, protein: 12, carbs: 1, fats: 10, fiber: 0, sugar: 1, sodium: 140 },
    tags: ['breakfast', 'high-protein', 'popular'],
    suitableFor: ['veg', 'keto'],
    avoidFor: ['vegan'],
    icon: '🥚',
    budget: 'low',
    priceRange: { min: 25, max: 40, currency: 'PKR' }
  },
  
  // Low-Calorie Foods
  {
    name: 'Spinach',
    category: 'Vegetables',
    servingSize: '1 cup',
    nutrition: { calories: 7, protein: 1, carbs: 1, fats: 0, fiber: 1, sugar: 0, sodium: 24 },
    tags: ['lunch', 'dinner', 'low-calorie'],
    suitableFor: ['veg', 'vegan', 'keto'],
    avoidFor: [],
    icon: '🥬',
    budget: 'low',
    priceRange: { min: 30, max: 50, currency: 'PKR' }
  },
  {
    name: 'Broccoli',
    category: 'Vegetables',
    servingSize: '1 cup',
    nutrition: { calories: 25, protein: 3, carbs: 5, fats: 0, fiber: 2, sugar: 2, sodium: 33 },
    tags: ['lunch', 'dinner', 'low-calorie'],
    suitableFor: ['veg', 'vegan', 'keto'],
    avoidFor: [],
    icon: '🥦',
    budget: 'medium',
    priceRange: { min: 80, max: 120, currency: 'PKR' }
  },
  {
    name: 'Orange',
    category: 'Fruits',
    servingSize: '1 medium',
    nutrition: { calories: 62, protein: 1, carbs: 15, fats: 0, fiber: 3, sugar: 12, sodium: 0 },
    tags: ['snack', 'breakfast', 'low-calorie'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: [],
    icon: '🍊',
    budget: 'low',
    priceRange: { min: 12, max: 20, currency: 'PKR' }
  },
  {
    name: 'Apple',
    category: 'Fruits',
    servingSize: '1 medium',
    nutrition: { calories: 95, protein: 0, carbs: 25, fats: 0, fiber: 4, sugar: 19, sodium: 2 },
    tags: ['snack', 'breakfast', 'low-calorie'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: [],
    icon: '🍎',
    budget: 'medium',
    priceRange: { min: 25, max: 40, currency: 'PKR' }
  },
  {
    name: 'Sweet Potato',
    category: 'Vegetables',
    servingSize: '1 medium',
    nutrition: { calories: 112, protein: 2, carbs: 26, fats: 0, fiber: 4, sugar: 5, sodium: 7 },
    tags: ['lunch', 'dinner', 'low-calorie'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: ['keto'],
    icon: '🍠',
    budget: 'low',
    priceRange: { min: 15, max: 30, currency: 'PKR' }
  },
  {
    name: 'Tuna',
    category: 'Protein',
    servingSize: '100g',
    nutrition: { calories: 144, protein: 30, carbs: 0, fats: 1, fiber: 0, sugar: 0, sodium: 50 },
    tags: ['lunch', 'dinner', 'high-protein', 'low-calorie'],
    suitableFor: ['non-veg', 'keto'],
    avoidFor: ['veg', 'vegan'],
    icon: '🐟',
    budget: 'high',
    priceRange: { min: 200, max: 300, currency: 'PKR' }
  },
  {
    name: 'Turkey Breast',
    category: 'Protein',
    servingSize: '100g',
    nutrition: { calories: 135, protein: 30, carbs: 0, fats: 1, fiber: 0, sugar: 0, sodium: 1040 },
    tags: ['lunch', 'dinner', 'high-protein', 'low-calorie'],
    suitableFor: ['non-veg', 'keto'],
    avoidFor: ['veg', 'vegan'],
    icon: '🦃',
    budget: 'high',
    priceRange: { min: 250, max: 350, currency: 'PKR' }
  },
  
  // High-Calorie Foods
  {
    name: 'Avocado',
    category: 'Fruits',
    servingSize: '1 medium',
    nutrition: { calories: 234, protein: 3, carbs: 12, fats: 21, fiber: 10, sugar: 1, sodium: 11 },
    tags: ['breakfast', 'lunch', 'healthy-fats', 'high-calorie'],
    suitableFor: ['veg', 'vegan', 'keto'],
    avoidFor: [],
    icon: '🥑',
    budget: 'high',
    priceRange: { min: 150, max: 250, currency: 'PKR' }
  },
  {
    name: 'Salmon',
    category: 'Protein',
    servingSize: '150g',
    nutrition: { calories: 280, protein: 25, carbs: 0, fats: 20, fiber: 0, sugar: 0, sodium: 60 },
    tags: ['lunch', 'dinner', 'omega-3', 'high-calorie'],
    suitableFor: ['non-veg', 'keto'],
    avoidFor: ['veg', 'vegan'],
    icon: '🐟',
    budget: 'high',
    priceRange: { min: 400, max: 600, currency: 'PKR' }
  },
  {
    name: 'Quinoa',
    category: 'Grains',
    servingSize: '1 cup',
    nutrition: { calories: 222, protein: 8, carbs: 39, fats: 4, fiber: 5, sugar: 2, sodium: 13 },
    tags: ['lunch', 'dinner', 'high-protein', 'high-calorie'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: ['keto'],
    icon: '🌾',
    budget: 'high',
    priceRange: { min: 120, max: 180, currency: 'PKR' }
  },
  {
    name: 'Cottage Cheese',
    category: 'Dairy',
    servingSize: '1 cup',
    nutrition: { calories: 220, protein: 25, carbs: 9, fats: 10, fiber: 0, sugar: 9, sodium: 746 },
    tags: ['breakfast', 'snack', 'high-protein', 'high-calorie'],
    suitableFor: ['veg'],
    avoidFor: ['vegan', 'lactose-intolerant'],
    icon: '🧀',
    budget: 'medium',
    priceRange: { min: 80, max: 120, currency: 'PKR' }
  },
  {
    name: 'Lentils',
    category: 'Protein',
    servingSize: '1 cup',
    nutrition: { calories: 230, protein: 18, carbs: 40, fats: 1, fiber: 16, sugar: 4, sodium: 4 },
    tags: ['lunch', 'dinner', 'high-protein', 'high-fiber', 'high-calorie'],
    suitableFor: ['veg', 'vegan'],
    avoidFor: ['keto'],
    icon: '🫘',
    budget: 'low',
    priceRange: { min: 40, max: 60, currency: 'PKR' }
  },
  {
    name: 'Walnuts',
    category: 'Nuts',
    servingSize: '28g',
    nutrition: { calories: 185, protein: 4, carbs: 4, fats: 18, fiber: 2, sugar: 1, sodium: 1 },
    tags: ['snack', 'healthy-fats', 'high-calorie'],
    suitableFor: ['veg', 'vegan', 'keto'],
    avoidFor: ['nut-allergy'],
    icon: '🥜',
    budget: 'high',
    priceRange: { min: 200, max: 300, currency: 'PKR' }
  },
  {
    name: 'Almonds',
    category: 'Nuts',
    servingSize: '28g',
    nutrition: { calories: 160, protein: 6, carbs: 6, fats: 14, fiber: 3, sugar: 1, sodium: 0 },
    tags: ['snack', 'high-protein', 'high-calorie'],
    suitableFor: ['veg', 'vegan', 'keto'],
    avoidFor: ['nut-allergy'],
    icon: '🥜',
    budget: 'high',
    priceRange: { min: 180, max: 280, currency: 'PKR' }
  }
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-health-fitness');
    console.log('Connected to MongoDB');

    await Food.deleteMany({});
    console.log('Cleared existing foods');

    await Food.insertMany(sampleFoods);
    console.log('Seeded sample foods');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedFoods();
