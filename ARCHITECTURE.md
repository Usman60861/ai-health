# System Architecture

## Overview
Full-stack MERN application with AI integration for personalized health and fitness recommendations.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UI Layer (React Components + 3D Effects)            │  │
│  │  - Pages (Dashboard, Diet, Workout, etc.)            │  │
│  │  - Components (Card3D, Background3D, Layout)         │  │
│  │  - Three.js for 3D graphics                          │  │
│  │  - Framer Motion for animations                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management                                     │  │
│  │  - Zustand (Auth state)                              │  │
│  │  - React Query (Server state & caching)              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Client (Axios)                                   │  │
│  │  - JWT token injection                                │  │
│  │  - Error handling                                     │  │
│  │  - Request/Response interceptors                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js/Express)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  - /auth (Authentication)                             │  │
│  │  - /user (Profile management)                         │  │
│  │  - /diet (Diet plans)                                 │  │
│  │  - /workout (Workout plans)                           │  │
│  │  - /food (Food database)                              │  │
│  │  - /progress (Tracking)                               │  │
│  │  - /chat (AI assistant)                               │  │
│  │  - /admin (Admin panel)                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware                                           │  │
│  │  - authenticate (JWT verification)                    │  │
│  │  - authorize (Role-based access)                      │  │
│  │  - CORS                                               │  │
│  │  - Body parser                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services                                             │  │
│  │  - AI Service (OpenAI/Gemini integration)            │  │
│  │    • generateDietPlan()                               │  │
│  │    • generateWorkoutPlan()                            │  │
│  │    • chatWithAI()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models (Mongoose)                                    │  │
│  │  - User                                               │  │
│  │  - DietPlan                                           │  │
│  │  - WorkoutPlan                                        │  │
│  │  - Food                                               │  │
│  │  - Progress                                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                      │
│  Collections:                                                │
│  - users                                                     │
│  - dietplans                                                 │
│  - workoutplans                                              │
│  - foods                                                     │
│  - progresses                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  - OpenAI API / Google Gemini API                           │
│    (AI-powered recommendations)                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User → Login Form → API Client → /auth/login → Verify Credentials
→ Generate JWT → Return Token → Store in Zustand → Redirect to Dashboard
```

### 2. AI Diet Plan Generation Flow
```
User → Profile Complete → Click "Generate Diet Plan" → API Client
→ /diet/generate → Fetch User Profile → AI Service → OpenAI/Gemini API
→ Process Response → Save to MongoDB → Return Diet Plan → Display in UI
```

### 3. Progress Tracking Flow
```
User → Log Progress Form → API Client → /progress → Save to MongoDB
→ Fetch Stats → Calculate Trends → Return Data → Display Charts
```

### 4. AI Chat Flow
```
User → Type Message → API Client → /chat → AI Service
→ Include User Context → OpenAI/Gemini API → Stream Response
→ Return to Client → Display in Chat UI
```

## Security Architecture

### Authentication
- JWT tokens with 7-day expiration
- Bcrypt password hashing (10 rounds)
- Token stored in localStorage (Zustand persist)
- Token sent in Authorization header

### Authorization
- Role-based access control (User, Nutritionist, Admin)
- Middleware checks on protected routes
- Different permissions per role

### Data Protection
- Environment variables for secrets
- CORS configuration
- Input validation
- MongoDB injection prevention (Mongoose)

## Scalability Considerations

### Frontend
- Code splitting with React lazy loading
- Image optimization
- CDN for static assets
- Service worker for PWA

### Backend
- Stateless API (JWT)
- Database indexing on frequently queried fields
- API rate limiting (future)
- Caching with Redis (future)
- Load balancing (future)

### Database
- MongoDB Atlas for managed hosting
- Replica sets for high availability
- Sharding for horizontal scaling
- Regular backups

## Performance Optimizations

### Frontend
- React Query for caching
- Debounced search inputs
- Lazy loading routes
- Optimized 3D rendering
- Memoized components

### Backend
- Async/await for non-blocking operations
- Database query optimization
- Connection pooling
- Compression middleware

## Monitoring & Logging

### Frontend
- Error boundaries
- Console logging (development)
- Analytics integration ready

### Backend
- Request logging
- Error logging
- Performance monitoring ready
- Health check endpoints ready

## Deployment Architecture

### Production Setup
```
┌─────────────────────────────────────────────────────────────┐
│  CDN (Cloudflare/CloudFront)                                │
│  - Static assets                                             │
│  - Frontend build                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Vercel/Netlify)                                  │
│  - React SPA                                                 │
│  - Auto-scaling                                              │
│  - SSL/TLS                                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (Render/Railway/AWS)                               │
│  - Node.js API                                               │
│  - Auto-scaling                                              │
│  - SSL/TLS                                                   │
│  - Environment variables                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                                    │
│  - Managed MongoDB                                           │
│  - Automatic backups                                         │
│  - Replica sets                                              │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend Stack
- **React 18**: UI library with hooks
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS
- **Three.js**: 3D graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js helpers
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **React Hot Toast**: Notifications

### Backend Stack
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **OpenAI**: AI integration
- **Axios**: HTTP client for AI APIs
- **Dotenv**: Environment variables
- **CORS**: Cross-origin resource sharing
- **Express Validator**: Input validation

## Future Enhancements
- WebSocket for real-time notifications
- Redis for caching
- Elasticsearch for advanced search
- GraphQL API option
- Mobile app (React Native)
- Push notifications
- Email service integration
- Payment gateway (Stripe)
- Advanced analytics
- Machine learning models
