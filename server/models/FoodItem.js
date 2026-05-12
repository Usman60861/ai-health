import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['grains', 'protein', 'vegetables', 'fruits', 'dairy', 'snacks', 'beverages', 'sweets'],
    required: true 
  },
  image: { type: String },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 }
  },
  servingSize: { type: String, required: true }, // e.g., "1 cup", "100g"
  servingUnit: { type: String, default: 'serving' },
  tags: [String], // e.g., ['high-protein', 'low-carb', 'diabetic-friendly']
  warnings: [String], // e.g., ['high-sugar', 'high-sodium']
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('FoodItem', foodItemSchema);
