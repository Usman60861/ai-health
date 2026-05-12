import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      activityLevel,
      medicalConditions,
      allergies,
      dietaryPreference,
      fitnessGoals,
      lifestyle
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile fields
    if (name !== undefined) user.profile.name = name;
    if (age !== undefined) user.profile.age = age;
    if (gender !== undefined) user.profile.gender = gender;
    if (height !== undefined) user.profile.height = height;
    if (weight !== undefined) user.profile.weight = weight;
    if (activityLevel !== undefined) user.profile.activityLevel = activityLevel;
    if (medicalConditions !== undefined) user.profile.medicalConditions = medicalConditions;
    if (allergies !== undefined) user.profile.allergies = allergies;
    if (dietaryPreference !== undefined) user.profile.dietaryPreference = dietaryPreference;
    if (fitnessGoals !== undefined) user.profile.fitnessGoals = fitnessGoals;
    if (lifestyle !== undefined) user.profile.lifestyle = lifestyle;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;