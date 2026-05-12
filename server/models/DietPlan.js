import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: String,
  items: [{
    food: String,
    quantity: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  totalCalories: Number,
  reason: String
});

const dietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dailyCalories: Number,
  budgetPreference: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  meals: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: [mealSchema]
  },
  waterIntake: String,
  supplements: [String],
  foodsToAvoid: [String],
  weeklySchedule: mongoose.Schema.Types.Mixed,
  aiGenerated: { type: Boolean, default: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('DietPlan', dietPlanSchema);
