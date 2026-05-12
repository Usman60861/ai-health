
<div align="center">

# ⚡ NutriAI — Intelligent Health & Fitness Platform

### *Your AI-Powered Personal Health Companion*

[![Version](https://img.shields.io/badge/version-1.0.0-6C63FF?style=for-the-badge)](.)
[![Stack](https://img.shields.io/badge/stack-MERN-4ECDC4?style=for-the-badge)](.)
[![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-2FE8FF?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/license-MIT-FFB74D?style=for-the-badge)](.)
[![Status](https://img.shields.io/badge/status-Production%20Ready-4ECDC4?style=for-the-badge)](.)

---

> **NutriAI** is a full-stack intelligent health platform that combines the power of Google Gemini / OpenAI with a beautiful, animated UI to deliver hyper-personalized diet plans, workout routines, and 24/7 health guidance — all in one place.

---

</div>

## 📋 Table of Contents

| # | Section |
|---|---------|
| 1 | [Overview](#-overview) |
| 2 | [Key Features](#-key-features) |
| 3 | [Tech Stack](#-tech-stack) |
| 4 | [Architecture](#-architecture) |
| 5 | [Getting Started](#-getting-started) |
| 6 | [Environment Variables](#-environment-variables) |
| 7 | [API Reference](#-api-reference) |
| 8 | [Module Breakdown](#-module-breakdown) |
| 9 | [UI & Design System](#-ui--design-system) |
| 10 | [Deployment](#-deployment) |
| 11 | [Roadmap](#-roadmap) |

---

## 🌟 Overview

NutriAI is not just another fitness app. It's a **full-stack AI health ecosystem** built for people who want real, personalized guidance — not generic advice.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   User Profile  →  AI Analysis  →  Personalized Plans          │
│        ↓                ↓                  ↓                    │
│   Health Data      Gemini/OpenAI      Diet + Workout            │
│        ↓                ↓                  ↓                    │
│   Progress Log    Smart Insights      24/7 AI Chat              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What makes it different?

- 🧠 **Context-aware AI** — Plans are generated based on your medical conditions, allergies, goals, and lifestyle
- 🎨 **Premium UI** — Glassmorphism, 3D effects, GSAP animations, and Framer Motion transitions
- 📊 **Live Analytics** — Real-time weight trends, calorie tracking, and macro breakdowns
- 👥 **Multi-role system** — Users, Nutritionists, and Admins each have tailored experiences
- 🔒 **Production-grade security** — JWT auth, bcrypt hashing, role-based access control

---

## ✨ Key Features

### 🤖 AI Engine
| Feature | Description | Status |
|---------|-------------|--------|
| Diet Plan Generator | Personalized meal plans with macros, calories, and reasoning | ✅ Live |
| Workout Plan Generator | Custom routines based on fitness level, location, limitations | ✅ Live |
| AI Chat Assistant | 24/7 health bot with full user context awareness | ✅ Live |
| Food Recommendations | Natural language food queries ("low-carb snacks for diabetics") | ✅ Live |
| Meal Analysis | AI analysis of logged meals against health goals | ✅ Live |

### 📊 Health Management
| Feature | Description | Status |
|---------|-------------|--------|
| Progress Tracking | Log weight, calories, water, sleep, symptoms daily | ✅ Live |
| Weight Trend Chart | Animated SVG chart with bezier curves and data points | ✅ Live |
| Calorie Dashboard | Dual-ring chart with macro breakdown bars | ✅ Live |
| Water Intake Tracker | Animated bottle visualization with fill animations | ✅ Live |
| Stats Overview | MIN / AVG / MAX / LOGS statistics panel | ✅ Live |

### 🎨 UI/UX
| Feature | Description |
|---------|-------------|
| 3D Particle Background | Three.js powered animated particle system |
| Glassmorphism Cards | Frosted glass effect with backdrop blur |
| GSAP Animations | Stagger entrance, magnetic buttons, counter animations |
| Framer Motion | Page transitions, card reveals, SVG path animations |
| Custom Cursor | Branded cursor with hover effects |
| Responsive Design | Mobile-first, works on all screen sizes |

### 👥 Role System
| Role | Capabilities |
|------|-------------|
| **User** | Full health management, AI plans, progress tracking, chat |
| **Nutritionist** | Review & update user diet/workout plans |
| **Admin** | Full system access, user management, food database, stats |

---

## 🛠 Tech Stack

### Frontend
```
React 18          — UI library with hooks
Vite 5            — Lightning-fast build tool & dev server
Tailwind CSS 3    — Utility-first styling framework
Three.js          — 3D graphics & particle systems
Framer Motion 10  — Production-ready animation library
GSAP 3            — Professional-grade animation engine
React Query 5     — Server state management & caching
Zustand           — Lightweight client state management
Axios             — HTTP client with interceptors
Recharts          — Composable charting library
React Router 6    — Client-side routing
React Hot Toast   — Notification system
Lucide React      — Consistent icon set
```

### Backend
```
Node.js           — JavaScript runtime
Express 4         — Minimal web framework
MongoDB           — NoSQL document database
Mongoose 8        — Elegant MongoDB ODM
JWT               — Stateless authentication
bcryptjs          — Password hashing (10 rounds)
Google Gemini     — Primary AI provider (@google/genai)
OpenAI            — Fallback AI provider
Nodemailer        — Email service (password reset)
Express Validator — Input validation & sanitization
CORS              — Cross-origin resource sharing
dotenv            — Environment variable management
```

---

## 🏗 Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   Pages Layer   │  │  Components  │  │   State Layer     │  │
│  │                 │  │              │  │                   │  │
│  │  Dashboard      │  │  Card3D      │  │  Zustand (auth)   │  │
│  │  DietPlan       │  │  Chart3D     │  │  React Query      │  │
│  │  WorkoutPlan    │  │  Layout      │  │  (server state)   │  │
│  │  Progress       │  │  Particles   │  │                   │  │
│  │  ChatAssistant  │  │  CustomCursor│  └───────────────────┘  │
│  │  FoodDatabase   │  └──────────────┘                         │
│  │  AdminPanel     │                                            │
│  └─────────────────┘  ┌──────────────────────────────────────┐ │
│                        │  API Client (Axios)                  │ │
│                        │  • JWT injection via interceptors    │ │
│                        │  • Auto token refresh                │ │
│                        │  • Error normalization               │ │
│                        └──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              ↕  REST / HTTP
┌──────────────────────────────────────────────────────────────────┐
│                     SERVER (Node.js / Express)                   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  API Routes  │  │  Middleware  │  │      Services          │ │
│  │              │  │              │  │                        │ │
│  │  /auth       │  │  authenticate│  │  aiService             │ │
│  │  /user       │  │  authorize   │  │  • generateDietPlan()  │ │
│  │  /diet       │  │  CORS        │  │  • generateWorkout()   │ │
│  │  /workout    │  │  bodyParser  │  │  • chatWithAI()        │ │
│  │  /food       │  │  validator   │  │                        │ │
│  │  /progress   │  └──────────────┘  │  emailService          │ │
│  │  /chat       │                    │  mealAnalysisService   │ │
│  │  /admin      │                    └────────────────────────┘ │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mongoose Models                                         │   │
│  │  User  •  DietPlan  •  WorkoutPlan  •  Food  •  Progress │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│  MongoDB Atlas                    External Services              │
│  • users                          • Google Gemini API            │
│  • dietplans                      • OpenAI API (fallback)        │
│  • workoutplans                   • Nodemailer / SMTP            │
│  • foods                                                         │
│  • progresses                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Key Data Flows

**AI Diet Plan Generation**
```
User clicks "Generate" 
  → POST /diet/generate 
  → Fetch user profile from DB 
  → Build AI prompt with health context 
  → Call Gemini API 
  → Parse & validate response 
  → Save DietPlan to MongoDB 
  → Return to client 
  → Render with animations
```

**Authentication Flow**
```
User submits credentials 
  → POST /auth/login 
  → Find user in DB 
  → bcrypt.compare() 
  → Sign JWT (7d expiry) 
  → Store in Zustand (persisted) 
  → Axios interceptor injects token 
  → Protected routes unlock
```

**Progress Tracking Flow**
```
User logs daily data 
  → POST /progress 
  → Save to MongoDB 
  → GET /progress/stats 
  → Calculate weightChange, avgCalories, avgSleep 
  → Return time-series data 
  → Render animated SVG chart
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node --version   # v18.0.0 or higher
npm --version    # v9.0.0 or higher
# MongoDB Atlas account OR local MongoDB
# Google Gemini API key (free tier available)
```

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd nutriai

# 2. Install all dependencies (root + client + server)
npm run install-all

# 3. Configure environment variables
cp .env.example .env
cp client/.env.example client/.env
# Edit both .env files — see Environment Variables section

# 4. (Optional) Seed the food database
npm run seed

# 5. Start development servers
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Create Admin Account

```bash
node create-admin.js
# Creates default admin: admin@nutriai.com / admin123
```

---

## 🔐 Environment Variables

### Server `.env`

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nutriai

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# AI Provider (choose one or both)
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key          # optional fallback

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
```

### Client `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> **Security Note:** Never commit `.env` files. They are already in `.gitignore`.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:** All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

### 🔑 Authentication

#### `POST /auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Response `201`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

#### `POST /auth/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

#### `POST /auth/forgot-password`
Initiate password reset flow.

**Request Body:**
```json
{ "email": "user@example.com" }
```

**Response `200`:**
```json
{ "message": "Reset email sent successfully" }
```

---

### 👤 User Profile

#### `GET /user/profile` 🔒
Retrieve the authenticated user's full profile.

**Response `200`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "email": "user@example.com",
  "role": "user",
  "profile": {
    "name": "John Doe",
    "age": 28,
    "gender": "male",
    "height": 178,
    "weight": 75,
    "activityLevel": "moderate",
    "medicalConditions": ["diabetes"],
    "allergies": ["nuts"],
    "dietaryPreference": "veg",
    "fitnessGoals": ["weight loss", "muscle gain"],
    "lifestyle": "Desk job, light evening walks"
  }
}
```

---

#### `PUT /user/profile` 🔒
Update user profile. Triggers AI plan regeneration on next request.

**Request Body:** *(all fields optional)*
```json
{
  "name": "John Doe",
  "age": 28,
  "height": 178,
  "weight": 75,
  "activityLevel": "moderate",
  "medicalConditions": ["diabetes"],
  "allergies": ["nuts"],
  "dietaryPreference": "veg",
  "fitnessGoals": ["weight loss"],
  "lifestyle": "Desk job, light evening walks"
}
```

---

### 🥗 Diet Plans

#### `POST /diet/generate` 🔒
Generate a new AI-powered personalized diet plan.

**Response `201`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "dailyCalories": 1850,
  "meals": {
    "breakfast": {
      "name": "High-Protein Morning Bowl",
      "items": [
        {
          "food": "Greek Yogurt",
          "quantity": "200g",
          "calories": 130,
          "protein": 17,
          "carbs": 9,
          "fats": 3
        }
      ],
      "totalCalories": 420,
      "reason": "High protein to support muscle recovery and sustained energy"
    },
    "lunch": { "..." : "..." },
    "dinner": { "..." : "..." },
    "snacks": []
  },
  "waterIntake": "2.5 liters",
  "supplements": ["Vitamin D3", "Omega-3"],
  "foodsToAvoid": ["Refined sugar", "Fried foods", "White bread"],
  "status": "active",
  "createdAt": "2026-05-10T10:30:00.000Z"
}
```

---

#### `GET /diet/current` 🔒
Fetch the currently active diet plan.

#### `GET /diet/history` 🔒
Fetch all past diet plans for the user.

#### `PUT /diet/:id/review` 🔒 *(Nutritionist / Admin)*
Review and update a diet plan.

---

### 💪 Workout Plans

#### `POST /workout/generate` 🔒
Generate a personalized AI workout plan.

**Request Body:**
```json
{
  "level": "beginner",
  "location": "home",
  "limitations": ["back pain"]
}
```

**Response `201`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "level": "beginner",
  "location": "home",
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "Upper Body",
      "duration": "35 mins",
      "exercises": [
        {
          "name": "Wall Push-ups",
          "sets": 3,
          "reps": "12-15",
          "restTime": "45s",
          "instructions": "Keep core tight, controlled movement"
        }
      ]
    }
  ],
  "status": "active"
}
```

---

### 🍎 Food Database

#### `GET /food/search?q=oatmeal` 🔒
Search the food database.

**Response `200`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Oatmeal",
    "category": "Grains",
    "servingSize": "1 cup (240ml cooked)",
    "nutrition": {
      "calories": 154,
      "protein": 5.3,
      "carbs": 27.4,
      "fats": 2.6,
      "fiber": 4.0,
      "sugar": 0.6,
      "sodium": 9
    },
    "tags": ["breakfast", "high-fiber", "heart-healthy"],
    "suitableFor": ["veg", "vegan", "diabetic-friendly"],
    "avoidFor": ["keto", "gluten-free"]
  }
]
```

---

#### `POST /food/recommend` 🔒
Get AI-powered food recommendations via natural language.

**Request Body:**
```json
{ "query": "High protein breakfast for someone with lactose intolerance" }
```

**Response `200`:**
```json
{
  "recommendation": "Based on your lactose intolerance, here are excellent high-protein breakfast options: 1. Scrambled eggs with spinach (25g protein)..."
}
```

---

### 📈 Progress Tracking

#### `POST /progress` 🔒
Log daily health metrics.

**Request Body:**
```json
{
  "weight": 74.2,
  "caloriesConsumed": 1780,
  "waterIntake": 2.8,
  "sleepHours": 7.5,
  "symptoms": [],
  "notes": "Felt energetic today, completed full workout"
}
```

---

#### `GET /progress/stats` 🔒
Retrieve aggregated statistics for charts and analytics.

**Response `200`:**
```json
{
  "weightChange": -1.8,
  "avgCalories": 1820,
  "avgSleep": 7.1,
  "data": [
    { "date": "2026-05-01T00:00:00.000Z", "weight": 76.0, "caloriesConsumed": 1900 },
    { "date": "2026-05-10T00:00:00.000Z", "weight": 74.2, "caloriesConsumed": 1780 }
  ]
}
```

---

### 💬 AI Chat

#### `POST /chat` 🔒
Send a message to the AI health assistant.

**Request Body:**
```json
{
  "message": "Can I eat mangoes if I have diabetes?",
  "history": [
    { "role": "user", "content": "What fruits are safe for diabetics?" },
    { "role": "assistant", "content": "Low-GI fruits like berries, apples, and pears are generally safe..." }
  ]
}
```

**Response `200`:**
```json
{
  "response": "Mangoes have a moderate glycemic index (51-56). For someone with Type 2 diabetes, small portions (half a cup) can be consumed occasionally, preferably with a protein source to slow glucose absorption. Given your profile showing HbA1c concerns, I'd recommend limiting to 2-3 times per week and monitoring your blood sugar response."
}
```

---

### 🛡 Admin

#### `GET /admin/stats` 🔒 *(Admin only)*

**Response `200`:**
```json
{
  "totalUsers": 1247,
  "totalDietPlans": 3891,
  "totalWorkoutPlans": 2654,
  "totalFoods": 847
}
```

---

### ⚠️ Error Responses

All endpoints return consistent error shapes:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role permissions |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## 📦 Module Breakdown

### Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| `LandingPageSimple` | `/` | Marketing landing page with hero animation |
| `Login` | `/login` | JWT authentication form |
| `Signup` | `/signup` | Registration with password strength meter |
| `Dashboard` | `/dashboard` | Main health overview with live stats |
| `DietPlan` | `/diet` | AI diet plan viewer and generator |
| `WorkoutPlan` | `/workout` | AI workout plan with weekly schedule |
| `Progress` | `/progress` | Health logging and trend charts |
| `FoodDatabase` | `/food` | Searchable nutrition database |
| `ChatAssistant` | `/chat` | AI health chat interface |
| `Profile` | `/profile` | User profile management |
| `AdminPanel` | `/admin` | System administration |
| `ForgotPassword` | `/forgot-password` | Password reset initiation |
| `ResetPassword` | `/reset-password` | Password reset completion |

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `Layout` | App shell with navigation and sidebar |
| `ParticleBackground` | Three.js animated particle system |
| `Card3D` | 3D perspective tilt card wrapper |
| `Chart3D` | Advanced 3D data visualization |
| `CustomCursor` | Branded cursor with hover states |
| `GSAPProvider` | GSAP animation context provider |
| `PasswordStrengthMeter` | Real-time password validation UI |
| `ProblemsSection` | Landing page problem/solution section |

### Backend Services

| Service | File | Responsibility |
|---------|------|---------------|
| AI Service | `services/aiService.js` | Gemini/OpenAI integration, prompt engineering |
| Email Service | `services/emailService.js` | Nodemailer, password reset emails |
| Meal Analysis | `services/mealAnalysisService.js` | Nutritional analysis of logged meals |

### Database Models

| Model | Collection | Key Fields |
|-------|-----------|------------|
| `User` | `users` | email, password, role, profile (nested) |
| `DietPlan` | `dietplans` | userId, meals, dailyCalories, status |
| `WorkoutPlan` | `workoutplans` | userId, weeklySchedule, level, location |
| `Food` | `foods` | name, nutrition, tags, suitableFor |
| `Progress` | `progresses` | userId, date, weight, calories, water, sleep |

---

## 🎨 UI & Design System

### Color Palette

```
Primary Cyan    #2FE8FF  — Main accent, headings, data values
Teal            #4ECDC4  — Success states, progress indicators
Purple          #6C63FF  — Interactive elements, badges
Soft Purple     #A89FFF  — Secondary text, labels
Warning Orange  #FF9800  — Over-goal states, alerts
Error Red       #FF6B6B  — Negative trends, errors
Amber           #FFB74D  — Statistics, highlights

Background Dark  #000d1a → #001428 → #001e3c  (gradient)
Card Surface     rgba(0, 20, 40, 0.8)
Border           rgba(47, 232, 255, 0.08–0.25)
```

### Typography

```
Headings    Montserrat — Bold, tracked, uppercase for labels
Body        System UI / Inter — Clean, readable
Numbers     Monospace — All data values, counters, stats
```

### Animation Principles

- **Entrance:** `opacity 0→1` + `y 24→0` with `easeOut` (0.5s)
- **Stagger:** 0.1s delay between sibling cards
- **Counters:** GSAP `power2.out` over 1.5s
- **Charts:** SVG `pathLength 0→1` over 2.2s `easeInOut`
- **Hover:** `border-color` + `box-shadow` transitions at 0.4s
- **Reduced motion:** Respects `prefers-reduced-motion`

### Clip Path System

Cards use a consistent angled corner cut:
```css
clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
```

---

## 🚢 Deployment

### Frontend — Vercel (Recommended)

```bash
# Build
cd client && npm run build

# Vercel config
Build Command:    cd client && npm run build
Output Directory: client/dist
Install Command:  cd client && npm install
```

**Environment Variables on Vercel:**
```
VITE_API_URL = https://your-backend.onrender.com/api
```

---

### Backend — Render (Recommended)

```
Build Command:  cd server && npm install
Start Command:  cd server && node index.js
```

**Environment Variables on Render:**
```
MONGODB_URI     = mongodb+srv://...
JWT_SECRET      = your_secret
GEMINI_API_KEY  = your_key
EMAIL_HOST      = smtp.gmail.com
EMAIL_USER      = your@gmail.com
EMAIL_PASS      = your_app_password
NODE_ENV        = production
PORT            = 10000
```

---

### Database — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render's dynamic IPs
3. Create a database user with read/write permissions
4. Copy the connection string to `MONGODB_URI`

---

### Production Checklist

```
✅ Environment variables set on all platforms
✅ MongoDB Atlas IP whitelist configured
✅ CORS origin updated to production frontend URL
✅ JWT_SECRET is a strong random string (32+ chars)
✅ NODE_ENV=production
✅ Email service tested
✅ AI API keys have sufficient quota
✅ Database seeded with food items
```

---

## 🗺 Roadmap

### v1.1 — Notifications & Reminders
- [ ] Push notifications (Web Push API)
- [ ] Meal reminder emails
- [ ] Weekly progress summary email
- [ ] AI alerts for unhealthy trends

### v1.2 — Social & Gamification
- [ ] Streak system with rewards
- [ ] Achievement badges
- [ ] Community challenges
- [ ] Leaderboards (opt-in)

### v1.3 — Advanced AI
- [ ] Photo-based meal logging (vision AI)
- [ ] Voice input for chat assistant
- [ ] Predictive health insights
- [ ] Grocery list generator from diet plan

### v2.0 — Mobile & Monetization
- [ ] React Native mobile app
- [ ] Stripe subscription tiers
- [ ] Nutritionist marketplace
- [ ] Wearable device integration (Fitbit, Apple Health)

---

## 🤝 Contributing

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

**Commit Convention:**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation update
style:    UI/styling changes
refactor: Code refactoring
perf:     Performance improvement
test:     Test additions
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**

*Transform your health journey — one data point at a time.*

</div>
