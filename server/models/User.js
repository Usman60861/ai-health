import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'nutritionist', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpiry: Date,
  profile: {
    name: String,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: Number,
    weight: Number,
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
    medicalConditions: [String],
    allergies: [String],
    dietaryPreference: { type: String, enum: ['veg', 'non-veg', 'vegan', 'keto', 'halal'] },
    fitnessGoals: [String],
    lifestyle: String
  },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
