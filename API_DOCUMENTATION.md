# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### POST /auth/signup
Create new user account
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // or "nutritionist"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### POST /auth/login
Login existing user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### POST /auth/forgot-password
Request password reset
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Reset token generated",
  "resetToken": "token_string"
}
```

### POST /auth/reset-password
Reset password with token
```json
Request:
{
  "resetToken": "token_string",
  "newPassword": "newpassword123"
}

Response:
{
  "message": "Password reset successful"
}
```

## User Profile

### GET /user/profile
Get current user profile (Protected)
```json
Response:
{
  "_id": "user_id",
  "email": "user@example.com",
  "role": "user",
  "profile": {
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activityLevel": "moderate",
    "medicalConditions": ["diabetes"],
    "allergies": ["nuts"],
    "dietaryPreference": "veg",
    "fitnessGoals": ["weight loss"],
    "lifestyle": "Sedentary job"
  }
}
```

### PUT /user/profile
Update user profile (Protected)
```json
Request:
{
  "name": "John Doe",
  "age": 30,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "activityLevel": "moderate",
  "medicalConditions": ["diabetes"],
  "allergies": ["nuts"],
  "dietaryPreference": "veg",
  "fitnessGoals": ["weight loss"],
  "lifestyle": "Sedentary job"
}
```

## Diet Plans

### POST /diet/generate
Generate AI diet plan (Protected)
```json
Response:
{
  "_id": "plan_id",
  "userId": "user_id",
  "dailyCalories": 2000,
  "meals": {
    "breakfast": {
      "name": "Healthy Breakfast",
      "items": [
        {
          "food": "Oatmeal",
          "quantity": "1 cup",
          "calories": 150,
          "protein": 5,
          "carbs": 27,
          "fats": 3
        }
      ],
      "totalCalories": 150,
      "reason": "High fiber start"
    },
    "lunch": {...},
    "dinner": {...},
    "snacks": [...]
  },
  "waterIntake": "2-3 liters",
  "supplements": ["Vitamin D"],
  "foodsToAvoid": ["Sugar", "Fried foods"],
  "status": "active"
}
```

### GET /diet/current
Get current active diet plan (Protected)

### GET /diet/history
Get all diet plans history (Protected)

### PUT /diet/:id/review
Review/update diet plan (Nutritionist/Admin only)

## Workout Plans

### POST /workout/generate
Generate AI workout plan (Protected)
```json
Request:
{
  "level": "beginner",
  "location": "home",
  "limitations": ["back pain"]
}

Response:
{
  "_id": "plan_id",
  "userId": "user_id",
  "level": "beginner",
  "location": "home",
  "limitations": ["back pain"],
  "weeklySchedule": [
    {
      "day": "Monday",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "10-15",
          "restTime": "60s",
          "instructions": "Keep back straight"
        }
      ],
      "duration": "30 mins",
      "focus": "Upper body"
    }
  ],
  "status": "active"
}
```

### GET /workout/current
Get current active workout plan (Protected)

### PUT /workout/:id/review
Review/update workout plan (Nutritionist/Admin only)

## Food Database

### GET /food/search?q=query
Search foods (Protected)
```json
Response: [
  {
    "_id": "food_id",
    "name": "Oatmeal",
    "category": "Grains",
    "servingSize": "1 cup",
    "nutrition": {
      "calories": 150,
      "protein": 5,
      "carbs": 27,
      "fats": 3,
      "fiber": 4,
      "sugar": 1,
      "sodium": 0
    },
    "tags": ["breakfast", "high-fiber"],
    "suitableFor": ["veg", "vegan"],
    "avoidFor": []
  }
]
```

### GET /food/:id
Get single food item (Protected)

### POST /food/recommend
Get AI food recommendations (Protected)
```json
Request:
{
  "query": "Give me low-carb snacks"
}

Response:
{
  "recommendation": "AI generated recommendation text"
}
```

### POST /food
Add new food (Admin only)
```json
Request:
{
  "name": "Food Name",
  "category": "Category",
  "servingSize": "100g",
  "nutrition": {
    "calories": 100,
    "protein": 10,
    "carbs": 20,
    "fats": 5,
    "fiber": 3,
    "sugar": 2,
    "sodium": 50
  },
  "tags": ["tag1", "tag2"],
  "suitableFor": ["veg"],
  "avoidFor": ["keto"]
}
```

### PUT /food/:id
Update food (Admin only)

## Progress Tracking

### POST /progress
Log daily progress (Protected)
```json
Request:
{
  "weight": 70.5,
  "caloriesConsumed": 1800,
  "waterIntake": 2.5,
  "sleepHours": 7.5,
  "symptoms": ["headache"],
  "notes": "Felt good today"
}
```

### GET /progress
Get progress history (Protected)
Query params: `?startDate=2024-01-01&endDate=2024-01-31`

### GET /progress/stats
Get progress statistics (Protected)
```json
Response:
{
  "weightChange": -2.5,
  "avgCalories": 1850,
  "avgSleep": 7.2,
  "data": [...]
}
```

## AI Chat

### POST /chat
Chat with AI assistant (Protected)
```json
Request:
{
  "message": "Can I eat banana if I have diabetes?",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}

Response:
{
  "response": "AI generated response"
}
```

## Admin

### GET /admin/users
Get all users (Admin/Nutritionist only)

### GET /admin/stats
Get system statistics (Admin only)
```json
Response:
{
  "totalUsers": 100,
  "totalDietPlans": 250,
  "totalWorkoutPlans": 180,
  "totalFoods": 500
}
```

### GET /admin/diet-plans
Get all diet plans (Admin/Nutritionist only)

## Error Responses

All endpoints may return:
```json
{
  "error": "Error message"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
