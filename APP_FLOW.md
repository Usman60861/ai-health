# 🔄 Application Flow Guide

Visual guide to understand how users interact with the application.

## 📱 User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE                              │
│                  http://localhost:3000                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    ┌───────────────┐
                    │  New User?    │
                    └───────────────┘
                      │           │
                 Yes  │           │  No
                      ↓           ↓
            ┌──────────────┐  ┌──────────────┐
            │   SIGNUP     │  │    LOGIN     │
            │              │  │              │
            │ • Email      │  │ • Email      │
            │ • Password   │  │ • Password   │
            │ • Role       │  │              │
            └──────────────┘  └──────────────┘
                      │           │
                      └─────┬─────┘
                            ↓
                    ┌───────────────┐
                    │ Authenticated │
                    │  JWT Token    │
                    └───────────────┘
                            │
                            ↓
            ┌───────────────────────────────┐
            │      PROFILE SETUP            │
            │                               │
            │ • Personal Info               │
            │ • Medical Conditions          │
            │ • Allergies                   │
            │ • Dietary Preferences         │
            │ • Fitness Goals               │
            └───────────────────────────────┘
                            │
                            ↓
            ┌───────────────────────────────┐
            │         DASHBOARD             │
            │                               │
            │ • Health Overview             │
            │ • Quick Stats                 │
            │ • Today's Plan                │
            │ • Quick Actions               │
            └───────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ↓           ↓           ↓
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │   DIET   │  │ WORKOUT  │  │ PROGRESS │
        │   PLAN   │  │   PLAN   │  │ TRACKING │
        └──────────┘  └──────────┘  └──────────┘
                │           │           │
                ↓           ↓           ↓
```

## 🎯 Feature Flows

### 1️⃣ Diet Plan Generation Flow

```
User Profile
    ↓
Click "Generate Diet Plan"
    ↓
Frontend sends request to /api/diet/generate
    ↓
Backend fetches user profile
    ↓
AI Service processes:
    • Age, gender, weight, height
    • Medical conditions
    • Allergies
    • Dietary preferences
    • Fitness goals
    • Activity level
    ↓
OpenAI/Gemini generates plan
    ↓
Backend saves to MongoDB
    ↓
Frontend displays:
    • Daily calories
    • Breakfast, lunch, dinner
    • Snacks
    • Water intake
    • Supplements
    • Foods to avoid
```

### 2️⃣ Workout Plan Generation Flow

```
User clicks "Generate Workout Plan"
    ↓
User selects:
    • Fitness level (beginner/intermediate/advanced)
    • Location (home/gym)
    • Limitations (injuries, conditions)
    ↓
Frontend sends to /api/workout/generate
    ↓
AI Service processes user data
    ↓
Generates weekly schedule:
    • Monday: Upper body
    • Tuesday: Cardio
    • Wednesday: Lower body
    • Thursday: Rest
    • Friday: Full body
    • Saturday: Cardio
    • Sunday: Rest
    ↓
Each day includes:
    • Exercise name
    • Sets & reps
    • Rest time
    • Instructions
    ↓
Saved to database
    ↓
Displayed to user
```

### 3️⃣ AI Chat Flow

```
User types message
    ↓
"Can I eat banana if I have diabetes?"
    ↓
Frontend sends to /api/chat
    ↓
Backend includes context:
    • User profile
    • Medical conditions
    • Current diet plan
    • Chat history
    ↓
AI processes with context
    ↓
Generates personalized response
    ↓
Response displayed in chat
    ↓
History saved for context
```

### 4️⃣ Progress Tracking Flow

```
User logs daily data:
    • Weight: 70 kg
    • Calories: 1800
    • Water: 2.5 L
    • Sleep: 7.5 hours
    • Symptoms: None
    • Notes: "Felt great!"
    ↓
Saved to /api/progress
    ↓
Backend calculates:
    • Weight change trend
    • Average calories
    • Average sleep
    • Progress over time
    ↓
Frontend displays:
    • Statistics cards
    • Weight trend chart
    • Calorie chart
    • Historical data
```

### 5️⃣ Food Database Flow

```
User searches "chicken"
    ↓
Frontend calls /api/food/search?q=chicken
    ↓
MongoDB searches food collection
    ↓
Returns matching foods:
    • Grilled Chicken Breast
    • Chicken Curry
    • Chicken Salad
    ↓
Each shows:
    • Calories
    • Protein, carbs, fats
    • Serving size
    • Suitable for
    • Avoid for
    ↓
User can also ask AI:
"Give me low-carb snacks"
    ↓
AI recommends based on profile
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      SIGNUP/LOGIN                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    User credentials
                            │
                            ↓
                    Backend validates
                            │
                            ↓
                    Password hashed (bcrypt)
                            │
                            ↓
                    JWT token generated
                            │
                            ↓
                    Token sent to frontend
                            │
                            ↓
                    Stored in localStorage (Zustand)
                            │
                            ↓
            ┌───────────────┴───────────────┐
            │                               │
            ↓                               ↓
    All API requests include:      Protected routes check:
    Authorization: Bearer <token>   • Token valid?
                                    • User exists?
                                    • Role authorized?
```

## 🎨 UI Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      APP COMPONENT                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              BACKGROUND 3D                          │    │
│  │  (Three.js animated sphere - always visible)       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              LAYOUT COMPONENT                       │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │         NAVIGATION BAR                    │     │    │
│  │  │  Logo | User Email | Logout               │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │                                                      │    │
│  │  ┌─────────┐  ┌──────────────────────────┐        │    │
│  │  │ SIDEBAR │  │    MAIN CONTENT          │        │    │
│  │  │         │  │                          │        │    │
│  │  │ • Home  │  │  ┌────────────────────┐ │        │    │
│  │  │ • Diet  │  │  │   CARD 3D          │ │        │    │
│  │  │ • Workout│ │  │  (Glassmorphism)   │ │        │    │
│  │  │ • Food  │  │  │                    │ │        │    │
│  │  │ • Progress│ │  │  Content here...   │ │        │    │
│  │  │ • Chat  │  │  │                    │ │        │    │
│  │  │ • Admin │  │  └────────────────────┘ │        │    │
│  │  │         │  │                          │        │    │
│  │  └─────────┘  └──────────────────────────┘        │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                                                              │
│  User Action → Component → React Query → API Client         │
│                                    ↓                         │
│                              Add JWT Token                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ HTTP Request
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                       │
│                                                              │
│  Route → Middleware (Auth) → Controller → Service           │
│                                              ↓               │
│                                         AI Service           │
│                                              ↓               │
│                                         OpenAI/Gemini        │
│                                              ↓               │
│                                         MongoDB              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ HTTP Response
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                                                              │
│  API Client → React Query (Cache) → Component → UI Update   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ZUSTAND (Auth State)                      │
│                                                              │
│  • token                                                     │
│  • user                                                      │
│  • setAuth()                                                 │
│  • logout()                                                  │
│                                                              │
│  Persisted in localStorage                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 REACT QUERY (Server State)                   │
│                                                              │
│  • profile                                                   │
│  • currentDiet                                               │
│  • currentWorkout                                            │
│  • stats                                                     │
│  • foods                                                     │
│                                                              │
│  Cached and auto-refetched                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎭 User Roles Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER ROLE                            │
│                                                              │
│  Can access:                                                 │
│  • Dashboard                                                 │
│  • Profile                                                   │
│  • Diet Plan (generate & view)                              │
│  • Workout Plan (generate & view)                           │
│  • Food Database (search & recommend)                       │
│  • Progress Tracking (log & view)                           │
│  • AI Chat                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    NUTRITIONIST ROLE                         │
│                                                              │
│  All User features +                                         │
│  • View all users                                            │
│  • Review diet plans                                         │
│  • Update diet plans                                         │
│  • Review workout plans                                      │
│  • Update workout plans                                      │
│  • Admin panel (limited)                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       ADMIN ROLE                             │
│                                                              │
│  All Nutritionist features +                                 │
│  • Full admin panel                                          │
│  • Manage users                                              │
│  • Add/edit foods                                            │
│  • System statistics                                         │
│  • Content moderation                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Flow

```
Development
    ↓
Local Testing
    ↓
Git Commit & Push
    ↓
┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │         │    BACKEND      │
│                 │         │                 │
│ Vercel/Netlify  │         │ Render/Railway  │
│                 │         │                 │
│ • Auto build    │         │ • Auto deploy   │
│ • CDN           │         │ • Environment   │
│ • SSL           │         │ • SSL           │
└─────────────────┘         └─────────────────┘
        │                           │
        │                           ↓
        │                   ┌─────────────────┐
        │                   │   MONGODB       │
        │                   │                 │
        │                   │ MongoDB Atlas   │
        │                   │                 │
        │                   │ • Managed       │
        │                   │ • Backups       │
        │                   │ • Scaling       │
        │                   └─────────────────┘
        │                           │
        └───────────┬───────────────┘
                    ↓
            ┌─────────────────┐
            │   PRODUCTION    │
            │                 │
            │ Users access    │
            │ the app         │
            └─────────────────┘
```

## 📱 Mobile Responsive Flow

```
Desktop (1920px+)
    • Full sidebar visible
    • 3D effects at full quality
    • Multi-column layouts
    • Large cards

Tablet (768px - 1919px)
    • Collapsible sidebar
    • Optimized 3D effects
    • 2-column layouts
    • Medium cards

Mobile (< 768px)
    • Hidden sidebar (hamburger menu)
    • Simplified 3D effects
    • Single column layout
    • Compact cards
    • Touch-optimized
```

## 🎯 Summary

This application follows a clear flow:
1. **User signs up/logs in**
2. **Completes profile**
3. **Generates AI plans**
4. **Tracks progress**
5. **Chats with AI**
6. **Achieves health goals**

All with beautiful 3D effects and smooth animations! 🚀
