# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- OpenAI API key OR Google Gemini API key

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Environment Variables

Create `.env` in root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ai-health-fitness
JWT_SECRET=your_super_secret_jwt_key_change_this
AI_API_KEY=your_openai_or_gemini_api_key_here
AI_PROVIDER=openai
PORT=5000
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start MongoDB
If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, update `MONGODB_URI` with your connection string.

### 4. Seed Database (Optional)
```bash
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

## Getting AI API Keys

### OpenAI
1. Go to https://platform.openai.com
2. Sign up/Login
3. Navigate to API Keys
4. Create new secret key
5. Copy and paste into `.env` as `AI_API_KEY`
6. Set `AI_PROVIDER=openai`

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Copy and paste into `.env` as `AI_API_KEY`
5. Set `AI_PROVIDER=gemini`

## First Time Usage

1. Open http://localhost:3000
2. Click "Sign up"
3. Create account (choose role: user or nutritionist)
4. Complete your profile with:
   - Age, gender, height, weight
   - Medical conditions
   - Allergies
   - Dietary preferences
   - Fitness goals
5. Generate your AI diet plan
6. Generate your AI workout plan
7. Start tracking progress!

## Features Overview

### User Features
- ✅ AI-generated personalized diet plans
- ✅ AI-generated workout routines
- ✅ 24/7 AI health chat assistant
- ✅ Food database with nutrition info
- ✅ Progress tracking (weight, calories, sleep)
- ✅ Beautiful 3D UI effects

### Nutritionist/Admin Features
- ✅ View all users
- ✅ Review and update AI-generated plans
- ✅ Manage food database
- ✅ System statistics dashboard

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP

### AI Generation Not Working
- Verify `AI_API_KEY` is correct
- Check API provider has credits
- Review console logs for errors

### Port Already in Use
- Change `PORT` in `.env`
- Update `VITE_API_URL` in `client/.env`

### 3D Effects Not Rendering
- Ensure WebGL is enabled in browser
- Update graphics drivers
- Try different browser

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Three.js, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: OpenAI GPT / Google Gemini
- **State Management**: Zustand, React Query
- **Charts**: Recharts

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API client
│   │   └── store/         # State management
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth middleware
│   └── scripts/          # Utility scripts
└── package.json
```

## Support
For issues, check the console logs and ensure all environment variables are set correctly.
