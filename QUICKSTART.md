# 🚀 Quick Start Guide

Get your AI Health & Fitness app running in 5 minutes!

## Step 1: Install Dependencies (2 min)
```bash
npm run install-all
```

## Step 2: Setup Environment (1 min)

Copy and paste this into `.env` file in root:
```env
MONGODB_URI=mongodb://localhost:27017/ai-health-fitness
JWT_SECRET=my_super_secret_jwt_key_12345
AI_API_KEY=your_api_key_here
AI_PROVIDER=openai
PORT=5000
```

Copy and paste this into `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Step 3: Get AI API Key (1 min)

### Option A: OpenAI (Recommended)
1. Go to https://platform.openai.com/api-keys
2. Sign up/Login
3. Click "Create new secret key"
4. Copy the key
5. Paste into `.env` as `AI_API_KEY`

### Option B: Google Gemini (Free)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in
3. Create API key
4. Copy and paste into `.env` as `AI_API_KEY`
5. Change `AI_PROVIDER=gemini` in `.env`

## Step 4: Start MongoDB (30 sec)

### If you have MongoDB installed:
```bash
mongod
```

### If you don't have MongoDB:
Use MongoDB Atlas (free):
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env`

## Step 5: Run the App (30 sec)
```bash
npm run dev
```

## Step 6: Use the App! 🎉

1. Open http://localhost:3000
2. Click "Sign up"
3. Create account
4. Fill your profile
5. Generate AI diet plan
6. Generate AI workout plan
7. Chat with AI assistant
8. Track your progress!

## Troubleshooting

### "Cannot connect to MongoDB"
- Start MongoDB: `mongod`
- Or use MongoDB Atlas

### "AI generation failed"
- Check your API key in `.env`
- Make sure you have API credits

### "Port 5000 already in use"
- Change `PORT=5001` in `.env`
- Update `VITE_API_URL=http://localhost:5001` in `client/.env`

## What's Next?

- Explore all features in FEATURES.md
- Read API docs in API_DOCUMENTATION.md
- Check deployment guide in DEPLOYMENT.md
- Understand architecture in ARCHITECTURE.md

## Need Help?

Check the console logs for detailed error messages!
