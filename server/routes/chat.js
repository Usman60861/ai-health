import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { chatWithAI } from '../services/aiService.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Pass user profile (may be undefined if not completed)
    const userProfile = req.user?.profile || {};
    const response = await chatWithAI(userProfile, message, history);
    res.json({ response });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
