import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { validatePassword } from '../utils/passwordValidator.js';

const router = express.Router();

// Step 1: Send verification code to email
router.post('/signup/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (existingUser) {
      // Update existing unverified user
      existingUser.verificationCode = verificationCode;
      existingUser.verificationCodeExpiry = Date.now() + 600000; // 10 minutes
      await existingUser.save();
    } else {
      // Create new user with verification code
      const user = new User({
        email,
        verificationCode,
        verificationCodeExpiry: Date.now() + 600000, // 10 minutes
        isVerified: false
      });
      await user.save();
    }

    // Send email with verification code
    const emailResult = await sendVerificationEmail(email, verificationCode);
    
    if (!emailResult.success) {
      console.log(`⚠️ Email failed, showing code in console: ${verificationCode}`);
    }
    
    res.json({ 
      message: 'Verification code sent to email',
      // Remove this in production - only for testing
      ...(process.env.NODE_ENV === 'development' && { verificationCode })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Verify code
router.post('/signup/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const user = await User.findOne({ 
      email,
      verificationCode: code,
      verificationCodeExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Mark as verified but don't complete signup yet
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 3: Complete signup with name and password
router.post('/signup/complete', async (req, res) => {
  try {
    const { email, name, password, confirmPassword, role } = req.body;
    
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
    }

    const user = await User.findOne({ email, isVerified: true });
    
    if (!user) {
      return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });
    }

    if (user.password) {
      return res.status(400).json({ error: 'Account already completed' });
    }

    // Complete user profile
    user.profile.name = name;
    user.password = password;
    
    // Set role if provided and valid
    if (role && ['user', 'admin', 'nutritionist'].includes(role)) {
      user.role = role;
    }
    
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.profile.name,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.profile?.name,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ 
      message: 'Password reset link sent to email',
      // Remove this in production - only for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmation are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
    }

    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate password strength (for real-time feedback)
router.post('/validate-password', (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const validation = validatePassword(password);
    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
