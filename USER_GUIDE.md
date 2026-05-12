# 🎯 Complete User Guide

## ✅ Your Application is FULLY WORKING!

All pages are complete and functional. Here's how to use each feature:

---

## 🌐 Access the Application

**Frontend**: http://localhost:3001  
**Backend**: http://localhost:5000

---

## 📋 Step-by-Step Usage Guide

### 1️⃣ Sign Up & Login

#### Sign Up (First Time)
1. Go to http://localhost:3001
2. Click "Sign up"
3. Enter:
   - Email: `test@example.com`
   - Password: `test123`
   - Role: Select "User" (or "Nutritionist" for admin features)
4. Click "Sign Up"
5. You'll be redirected to Profile page

#### Login (Returning Users)
1. Go to http://localhost:3001/login
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to Dashboard

---

### 2️⃣ Complete Your Profile

**This is IMPORTANT** - AI needs your profile to generate personalized plans!

1. Navigate to "Profile" from sidebar
2. Fill in ALL fields:
   - **Name**: Your name
   - **Age**: e.g., 25
   - **Gender**: Male/Female/Other
   - **Height**: e.g., 175 (cm)
   - **Weight**: e.g., 70 (kg)
   - **Activity Level**: Choose from dropdown
   - **Dietary Preference**: Veg/Non-veg/Vegan/Keto/Halal
   - **Medical Conditions**: e.g., "Diabetes, High BP" (comma separated)
   - **Allergies**: e.g., "Nuts, Gluten" (comma separated)
   - **Fitness Goals**: e.g., "Weight loss, Muscle gain" (comma separated)
   - **Lifestyle**: Describe your daily routine
3. Click "Save Profile"
4. Wait for success message

---

### 3️⃣ Generate AI Diet Plan

1. Navigate to "Diet Plan" from sidebar
2. Click "Generate New Plan" button
3. Wait 10-30 seconds (AI is generating)
4. Your personalized diet plan will appear with:
   - **Daily Calories**: Total recommended
   - **Breakfast**: Meals with nutrition info
   - **Lunch**: Meals with nutrition info
   - **Dinner**: Meals with nutrition info
   - **Snacks**: Optional snacks
   - **Water Intake**: Daily recommendation
   - **Supplements**: If needed
   - **Foods to Avoid**: Based on your conditions

**Features:**
- View detailed nutrition (calories, protein, carbs, fats)
- See reasons for each meal recommendation
- Generate new plans anytime

---

### 4️⃣ Generate AI Workout Plan

1. Navigate to "Workout" from sidebar
2. Click "Generate New Plan"
3. Fill in preferences:
   - **Fitness Level**: Beginner/Intermediate/Advanced
   - **Location**: Home or Gym
   - **Limitations**: e.g., "Back pain, Knee issues" (comma separated)
4. Click "Generate Plan"
5. Wait 10-30 seconds
6. Your weekly workout plan will appear with:
   - **7-Day Schedule**: Monday to Sunday
   - **Exercise Details**: Name, sets, reps, rest time
   - **Instructions**: How to perform each exercise
   - **Duration**: Time per session
   - **Focus**: Muscle groups targeted

**Features:**
- Complete weekly schedule
- Detailed exercise instructions
- Customized for your level and location

---

### 5️⃣ Search Food Database

1. Navigate to "Food DB" from sidebar
2. **Search Foods**:
   - Enter food name (e.g., "chicken")
   - Click search button
   - View nutrition information:
     - Calories
     - Protein, Carbs, Fats
     - Fiber, Sugar, Sodium
     - Serving size

3. **AI Food Recommendations**:
   - Type query like:
     - "Give me low-carb snacks"
     - "What should I eat for high BP?"
     - "Suggest dinner under 500 calories"
   - Click "Get Recommendation"
   - AI will suggest foods based on your profile

**Available Foods** (seeded):
- Oatmeal
- Grilled Chicken Breast
- Brown Rice
- Greek Yogurt
- Banana
- Almonds
- Spinach
- Salmon

---

### 6️⃣ Track Your Progress

1. Navigate to "Progress" from sidebar
2. Click "Log Today's Progress"
3. Fill in daily data:
   - **Weight**: Current weight in kg
   - **Calories Consumed**: Total calories eaten
   - **Water Intake**: Liters consumed
   - **Sleep Hours**: Hours slept
   - **Symptoms**: Any health issues (optional)
   - **Notes**: Additional observations (optional)
4. Click "Log Progress"
5. View your statistics:
   - **Weight Change**: Total change over time
   - **Average Calories**: Daily average
   - **Average Sleep**: Sleep average
   - **Weight Trend Chart**: Visual graph

**Features:**
- Daily logging
- Historical data view
- Visual charts
- Statistics calculation

---

### 7️⃣ Chat with AI Assistant

1. Navigate to "AI Chat" from sidebar
2. Type your health question, for example:
   - "Can I eat banana if I have diabetes?"
   - "Give me a high-protein veg breakfast"
   - "What exercises are good for back pain?"
   - "How much water should I drink?"
3. Press Enter or click Send
4. AI will respond based on your profile
5. Continue conversation - AI remembers context

**Features:**
- 24/7 health guidance
- Context-aware responses
- Personalized to your profile
- Chat history maintained

---

### 8️⃣ View Dashboard

1. Navigate to "Dashboard" from sidebar
2. See your health overview:
   - **Daily Calories**: From your diet plan
   - **Weight Goal**: Your current weight
   - **Progress**: Weight change
   - **Activity Level**: Your activity
   - **Today's Diet Plan**: Quick summary
   - **Quick Actions**: Generate plans

**Features:**
- Health overview at a glance
- Quick access to all features
- Today's meal summary

---

### 9️⃣ Admin Panel (Nutritionist/Admin Only)

If you signed up as "Nutritionist" or "Admin":

1. Navigate to "Admin" from sidebar
2. View:
   - **System Statistics**: Total users, plans, foods
   - **Recent Users**: Latest signups
   - **Recent Diet Plans**: All generated plans
   - **User Management**: View all users
3. Review and update plans
4. Manage food database

---

## 🎨 UI Features

### 3D Effects
- **Animated Background**: Rotating 3D sphere
- **Glassmorphism Cards**: Beautiful glass effect
- **Hover Effects**: Cards lift on hover
- **Smooth Animations**: Page transitions

### Responsive Design
- Works on desktop, tablet, and mobile
- Sidebar collapses on small screens
- Touch-friendly interface

---

## 🔧 Troubleshooting

### "Signup failed"
- Make sure backend is running (check terminal)
- MongoDB should be connected
- Check browser console (F12) for errors

### "AI generation failed"
- Check your Gemini API key in `.env`
- Verify internet connection
- Fallback plan will be used if AI fails

### "No data showing"
- Make sure you completed your profile
- Generate plans first
- Log some progress data

### "Food search returns nothing"
- Run seed script: `node server\scripts\seedFoods.js`
- Or add foods manually (Admin only)

---

## 📊 What Each Page Does

| Page | Purpose | Key Features |
|------|---------|--------------|
| **Dashboard** | Overview | Stats, quick actions, today's plan |
| **Profile** | User info | Personal details, health info |
| **Diet Plan** | Meal planning | AI-generated meals, nutrition |
| **Workout** | Exercise | AI-generated workouts, schedule |
| **Food DB** | Nutrition lookup | Search foods, AI recommendations |
| **Progress** | Tracking | Log data, view charts, statistics |
| **AI Chat** | Health help | Ask questions, get advice |
| **Admin** | Management | Users, plans, statistics |

---

## ✅ Testing Checklist

Test each feature:
- [ ] Sign up new account
- [ ] Login with credentials
- [ ] Complete profile with all details
- [ ] Generate diet plan (wait for it)
- [ ] Generate workout plan
- [ ] Search for food (try "chicken")
- [ ] Ask AI a question in chat
- [ ] Log today's progress
- [ ] View dashboard overview
- [ ] Check all 3D effects work
- [ ] Test on mobile (resize browser)

---

## 🎯 Quick Test Scenario

1. **Sign up**: `test@example.com` / `test123`
2. **Profile**: Age 25, Weight 70kg, Height 175cm, Goal: "Weight loss"
3. **Diet Plan**: Click generate, wait, view meals
4. **Workout**: Beginner, Home, Generate
5. **Food**: Search "chicken", view nutrition
6. **Progress**: Log weight 70kg, calories 1800
7. **Chat**: Ask "Can I eat banana?"
8. **Dashboard**: View your overview

---

## 🚀 All Features Working

✅ Authentication (Signup/Login)  
✅ Profile Management  
✅ AI Diet Plan Generation  
✅ AI Workout Plan Generation  
✅ Food Database Search  
✅ AI Food Recommendations  
✅ Progress Tracking  
✅ Charts & Statistics  
✅ AI Chat Assistant  
✅ Admin Panel  
✅ 3D Effects & Animations  
✅ Responsive Design  

---

## 💡 Pro Tips

1. **Complete profile first** - AI needs this for personalization
2. **Be patient with AI** - Generation takes 10-30 seconds
3. **Use fallback plans** - If AI fails, you still get a plan
4. **Log progress daily** - Better charts and insights
5. **Ask specific questions** - AI gives better answers
6. **Try different queries** - Food recommendations are smart
7. **Check dashboard daily** - Quick overview of everything

---

## 🎉 Enjoy Your AI Health & Fitness App!

Everything is working perfectly. Start your health journey now! 💪

**Current Status**: ✅ FULLY FUNCTIONAL  
**Frontend**: http://localhost:3001  
**Backend**: http://localhost:5000  
**MongoDB**: ✅ Connected  
**AI**: ✅ Gemini Integrated
