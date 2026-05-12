# Deployment Guide

## Frontend Deployment (Vercel/Netlify)

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL

### Netlify
1. Push code to GitHub
2. Import project in Netlify
3. Set build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL

## Backend Deployment (Render/Railway/AWS)

### Render
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && node index.js`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `AI_API_KEY`
   - `AI_PROVIDER`
   - `PORT`

### Railway
1. Create new project
2. Connect GitHub repo
3. Add environment variables
4. Railway auto-detects Node.js

### AWS (EC2)
1. Launch EC2 instance
2. Install Node.js and MongoDB
3. Clone repo
4. Set environment variables
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server/index.js
   ```

## Database (MongoDB Atlas)
1. Create cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Add to `MONGODB_URI` environment variable
4. Whitelist deployment server IP

## AI API Setup

### OpenAI
1. Get API key from platform.openai.com
2. Set `AI_PROVIDER=openai`
3. Set `AI_API_KEY=your_openai_key`

### Google Gemini
1. Get API key from makersuite.google.com
2. Set `AI_PROVIDER=gemini`
3. Set `AI_API_KEY=your_gemini_key`

## Post-Deployment
1. Run seed script: `node server/scripts/seedFoods.js`
2. Test all endpoints
3. Monitor logs
4. Set up SSL certificate
