import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  servingSize: String,
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  tags: [String],
  suitableFor: [String],
  avoidFor: [String],
  icon: { type: String, default: '🍽️' },
  budget: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium',
    required: true 
  },
  priceRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'PKR' }
  }
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);
