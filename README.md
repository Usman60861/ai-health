# 🏥 AI Health & Fitness Application

> A complete full-stack MERN web application that acts as your personal AI nutritionist and fitness advisor with stunning 3D effects.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![AI Powered](https://img.shields.io/badge/AI-Powered-blue)
![3D Effects](https://img.shields.io/badge/3D-Three.js-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Overview

Get personalized diet plans, workout routines, and 24/7 health assistance powered by AI. This production-ready application combines cutting-edge AI technology with beautiful 3D graphics to deliver an exceptional user experience.

## ✨ Key Features

### 🤖 AI-Powered Features
- **Personalized Diet Plans** - AI generates custom meal plans based on your health profile
- **Custom Workout Routines** - Tailored exercise plans for your fitness level
- **24/7 Health Assistant** - Chat with AI for instant health guidance
- **Smart Food Recommendations** - AI suggests foods based on your needs

### 📊 Health Management
- **Progress Tracking** - Monitor weight, calories, sleep, and symptoms
- **Visual Analytics** - Beautiful charts showing your health trends
- **Food Database** - Comprehensive nutrition information
- **Goal Setting** - Track your fitness and health goals

### 🎨 Beautiful UI/UX
- **3D Graphics** - Animated 3D backgrounds using Three.js
- **Glassmorphism Design** - Modern glass-effect UI
- **Smooth Animations** - Fluid transitions with Framer Motion
- **Responsive** - Works perfectly on all devices

### 👥 Multi-Role Support
- **Users** - Get personalized health plans
- **Nutritionists** - Review and update AI plans
- **Admins** - Manage users and content

## 🚀 Quick Start

**Get running in 5 minutes!** See [QUICKSTART.md](QUICKSTART.md)

```bash
# 1. Install dependencies
npm run install-all

# 2. Setup environment (see QUICKSTART.md)

# 3. Run the app
npm run dev
```

Open http://localhost:3000 and start your health journey!

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[SETUP.md](SETUP.md)** - Detailed installation instructions
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API reference
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D graphics
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **OpenAI/Gemini** - AI integration

## 📁 Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities
│   │   └── store/       # State management
│   └── package.json
├── server/              # Node.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth middleware
│   └── scripts/         # Utility scripts
└── package.json
```

## 🎯 Core Modules

1. **Authentication** - Secure JWT-based auth with role management
2. **AI Health Assessment** - Analyzes user data for recommendations
3. **Diet Plan Generator** - Creates personalized meal plans
4. **Workout Plan Generator** - Designs custom exercise routines
5. **Food Database** - Searchable nutrition information
6. **Progress Tracking** - Monitor health metrics over time
7. **AI Chat Assistant** - Real-time health guidance
8. **Admin Panel** - User and content management

## 🖼️ Screenshots

### Dashboard
Beautiful 3D animated dashboard with health overview

### Diet Plan
AI-generated personalized meal plans with nutrition details

### Workout Plan
Custom exercise routines with detailed instructions

### AI Chat
24/7 health assistant with context-aware responses

### Progress Tracking
Visual charts showing your health journey

## 🔧 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI or Google Gemini API key

### Setup
```bash
# Install all dependencies
npm run install-all

# Setup environment variables
cp .env.example .env
cp client/.env.example client/.env

# Edit .env files with your credentials

# Seed database (optional)
npm run seed

# Run development server
npm run dev
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
- Build command: `cd client && npm run build`
- Output directory: `client/dist`

### Backend (Render/Railway/AWS)
- Start command: `cd server && node index.js`
- Add environment variables

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Features Checklist

- ✅ User authentication & authorization
- ✅ AI diet plan generation
- ✅ AI workout plan generation
- ✅ AI chat assistant
- ✅ Food database with search
- ✅ Progress tracking with charts
- ✅ Admin panel
- ✅ 3D graphics & animations
- ✅ Responsive design
- ✅ Role-based access control
- ✅ Password reset
- ✅ Profile management
- ⚠️ Push notifications (future)
- ⚠️ Payment integration (future)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Enhance documentation
- Optimize performance

## 📝 License

MIT License - Free to use and modify

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- AI API integration
- 3D graphics in React
- State management patterns
- RESTful API design
- Authentication & authorization
- Modern UI/UX practices

## 💡 Use Cases

- Personal health management
- Nutrition consulting platforms
- Fitness coaching apps
- Diet planning services
- Wellness platforms
- Telemedicine support

## 🔮 Future Enhancements

- Push notifications
- Email reminders
- Payment integration (Stripe)
- Mobile app (React Native)
- Social features
- Meal planning calendar
- Recipe suggestions
- Grocery list generator

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review console logs
3. Verify environment variables
4. Check API credentials

## 🎉 Acknowledgments

Built with modern web technologies and AI to help people achieve their health goals.

---

**Ready to transform your health journey?** Get started now! 🚀
