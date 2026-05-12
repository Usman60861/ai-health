import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: Number,
  caloriesConsumed: Number,
  waterIntake: Number,
  sleepHours: Number,
  symptoms: [String],
  notes: String
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
