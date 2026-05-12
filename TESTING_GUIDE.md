# Testing Guide

## Manual Testing Checklist

### 1. Authentication Flow

#### Signup
- [ ] Navigate to http://localhost:3000/signup
- [ ] Enter email and password
- [ ] Select role (User/Nutritionist)
- [ ] Click "Sign Up"
- [ ] Verify redirect to profile page
- [ ] Check token stored in localStorage

#### Login
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter credentials
- [ ] Click "Login"
- [ ] Verify redirect to dashboard
- [ ] Check authentication persists on refresh

#### Logout
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Check token removed from localStorage

### 2. Profile Management

- [ ] Navigate to Profile page
- [ ] Fill in all fields:
  - Name, age, gender
  - Height, weight
  - Activity level
  - Medical conditions
  - Allergies
  - Dietary preference
  - Fitness goals
  - Lifestyle
- [ ] Click "Save Profile"
- [ ] Verify success toast
- [ ] Refresh page and verify data persists

### 3. AI Diet Plan Generation

- [ ] Navigate to Diet Plan page
- [ ] Click "Generate New Plan"
- [ ] Wait for AI generation (may take 10-30 seconds)
- [ ] Verify plan displays:
  - Daily calories
  - Breakfast, lunch, dinner
  - Snacks
  - Water intake
  - Supplements
  - Foods to avoid
- [ ] Check nutrition details for each meal
- [ ] Verify macros (protein, carbs, fats)

### 4. AI Workout Plan Generation

- [ ] Navigate to Workout Plan page
- [ ] Click "Generate New Plan"
- [ ] Select:
  - Fitness level (beginner/intermediate/advanced)
  - Location (home/gym)
  - Limitations (if any)
- [ ] Click "Generate Plan"
- [ ] Wait for AI generation
- [ ] Verify weekly schedule displays
- [ ] Check exercise details:
  - Name, sets, reps
  - Rest time
  - Instructions

### 5. Food Database

#### Search
- [ ] Navigate to Food Database page
- [ ] Enter search query (e.g., "chicken")
- [ ] Click search
- [ ] Verify results display
- [ ] Check nutrition information

#### AI Recommendations
- [ ] Enter query: "Give me low-carb snacks"
- [ ] Click "Get Recommendation"
- [ ] Verify AI response
- [ ] Try different queries:
  - "What should I eat for high BP?"
  - "Suggest dinner under 500 calories"

### 6. Progress Tracking

#### Log Progress
- [ ] Navigate to Progress page
- [ ] Click "Log Today's Progress"
- [ ] Fill in:
  - Weight
  - Calories consumed
  - Water intake
  - Sleep hours
  - Symptoms (optional)
  - Notes (optional)
- [ ] Click "Log Progress"
- [ ] Verify success toast

#### View Statistics
- [ ] Check statistics cards:
  - Weight change
  - Average calories
  - Average sleep
- [ ] Verify weight trend chart displays
- [ ] Check data points on chart

### 7. AI Chat Assistant

- [ ] Navigate to Chat page
- [ ] Type message: "Can I eat banana if I have diabetes?"
- [ ] Press Enter or click Send
- [ ] Verify AI response
- [ ] Try multiple messages
- [ ] Check conversation history
- [ ] Verify context awareness

### 8. Dashboard

- [ ] Navigate to Dashboard
- [ ] Verify cards display:
  - Daily calories
  - Weight goal
  - Progress
  - Activity level
- [ ] Check today's diet plan summary
- [ ] Verify quick actions buttons

### 9. Admin Panel (Nutritionist/Admin only)

- [ ] Create account with role "nutritionist"
- [ ] Navigate to Admin Panel
- [ ] Verify statistics display:
  - Total users
  - Total diet plans
  - Total workout plans
  - Total foods
- [ ] Check recent users list
- [ ] Check recent diet plans list

### 10. UI/UX Testing

#### 3D Effects
- [ ] Verify 3D animated background on all pages
- [ ] Check sphere rotates smoothly
- [ ] Verify no performance issues

#### Animations
- [ ] Check page transitions
- [ ] Verify card hover effects
- [ ] Check button hover states
- [ ] Verify loading animations

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Verify sidebar collapses on mobile
- [ ] Check all forms are usable

#### Glassmorphism
- [ ] Verify glass effect on cards
- [ ] Check backdrop blur
- [ ] Verify transparency

### 11. Error Handling

#### Invalid Login
- [ ] Try login with wrong password
- [ ] Verify error message displays
- [ ] Check no redirect occurs

#### Network Errors
- [ ] Stop backend server
- [ ] Try any API call
- [ ] Verify error toast displays
- [ ] Restart server and verify recovery

#### Validation
- [ ] Try submitting empty forms
- [ ] Verify required field validation
- [ ] Check email format validation

### 12. Performance Testing

- [ ] Check page load times
- [ ] Verify smooth scrolling
- [ ] Check 3D rendering performance
- [ ] Monitor memory usage
- [ ] Test with slow network (throttling)

## API Testing with Postman/Thunder Client

### Setup
1. Import base URL: `http://localhost:5000/api`
2. Create environment variable for token

### Test Endpoints

#### Auth
```
POST /auth/signup
Body: { "email": "test@test.com", "password": "test123", "role": "user" }

POST /auth/login
Body: { "email": "test@test.com", "password": "test123" }
```

#### User Profile
```
GET /user/profile
Headers: Authorization: Bearer <token>

PUT /user/profile
Headers: Authorization: Bearer <token>
Body: { "name": "Test User", "age": 30, ... }
```

#### Diet Plans
```
POST /diet/generate
Headers: Authorization: Bearer <token>

GET /diet/current
Headers: Authorization: Bearer <token>
```

#### Workout Plans
```
POST /workout/generate
Headers: Authorization: Bearer <token>
Body: { "level": "beginner", "location": "home", "limitations": [] }

GET /workout/current
Headers: Authorization: Bearer <token>
```

#### Food Database
```
GET /food/search?q=chicken
Headers: Authorization: Bearer <token>

POST /food/recommend
Headers: Authorization: Bearer <token>
Body: { "query": "Give me low-carb snacks" }
```

#### Progress
```
POST /progress
Headers: Authorization: Bearer <token>
Body: { "weight": 70, "caloriesConsumed": 1800, ... }

GET /progress/stats
Headers: Authorization: Bearer <token>
```

#### Chat
```
POST /chat
Headers: Authorization: Bearer <token>
Body: { "message": "Can I eat banana?", "history": [] }
```

## Database Testing

### MongoDB Queries

```javascript
// Check users
db.users.find()

// Check diet plans
db.dietplans.find()

// Check progress entries
db.progresses.find()

// Check foods
db.foods.find()
```

## Common Issues & Solutions

### Issue: AI generation fails
**Solution**: 
- Check AI_API_KEY in .env
- Verify API provider has credits
- Check console for error details

### Issue: 3D effects not rendering
**Solution**:
- Check WebGL support in browser
- Update graphics drivers
- Try different browser

### Issue: MongoDB connection error
**Solution**:
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Issue: CORS errors
**Solution**:
- Check VITE_API_URL in client/.env
- Verify backend CORS configuration
- Check port numbers match

## Performance Benchmarks

### Expected Performance
- Page load: < 2 seconds
- API response: < 500ms
- AI generation: 10-30 seconds
- 3D rendering: 60 FPS
- Chart rendering: < 1 second

## Security Testing

- [ ] Verify JWT tokens expire
- [ ] Check password hashing (bcrypt)
- [ ] Test unauthorized access to protected routes
- [ ] Verify role-based access control
- [ ] Check for SQL/NoSQL injection protection
- [ ] Test XSS protection

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Focus indicators
- [ ] Alt text for images

## Load Testing (Optional)

Use tools like Apache JMeter or Artillery:
- Test concurrent users
- API endpoint stress testing
- Database query performance
- Memory leak detection

## Automated Testing (Future)

Consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests
- Supertest for API tests

## Test Data

### Sample User
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "profile": {
    "name": "Test User",
    "age": 30,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activityLevel": "moderate",
    "medicalConditions": ["diabetes"],
    "allergies": ["nuts"],
    "dietaryPreference": "veg",
    "fitnessGoals": ["weight loss"]
  }
}
```

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/videos
5. Browser/OS information
6. Console errors
7. Network tab information

## Testing Checklist Summary

- [ ] All authentication flows work
- [ ] Profile management functional
- [ ] AI diet plans generate correctly
- [ ] AI workout plans generate correctly
- [ ] Food database searchable
- [ ] Progress tracking works
- [ ] AI chat responds appropriately
- [ ] Dashboard displays correctly
- [ ] Admin panel accessible (for admins)
- [ ] 3D effects render smoothly
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] All API endpoints work
- [ ] Error handling works
- [ ] Performance is acceptable
