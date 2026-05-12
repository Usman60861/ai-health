import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: String,
  restTime: String,
  instructions: String
});

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  location: { type: String, enum: ['home', 'gym'] },
  limitations: [String],
  weeklySchedule: [{
    day: String,
    exercises: [exerciseSchema],
    duration: String,
    focus: String
  }],
  aiGenerated: { type: Boolean, default: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
