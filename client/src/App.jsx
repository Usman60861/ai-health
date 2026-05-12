import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import CustomCursor from './components/CustomCursor';
import GSAPProvider from './components/GSAPProvider';
import LandingPageSimple from './pages/LandingPageSimple';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DietPlan from './pages/DietPlan';
import WorkoutPlan from './pages/WorkoutPlan';
import FoodDatabase from './pages/FoodDatabase';
import Progress from './pages/Progress';
import ChatAssistant from './pages/ChatAssistant';
import AdminPanel from './pages/AdminPanel';


function App() {
  const { token, user, isHydrated } = useAuthStore();
  
  // Wait for auth store to hydrate
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  const isAdmin = user?.role === 'admin' || user?.role === 'nutritionist';

  return (
    <>
      <CustomCursor />
      <Routes>
      <Route path="/landing" element={<LandingPageSimple />} />
      <Route path="/login" element={!token ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/signup" element={!token ? <Signup /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/reset-password" element={!token ? <ResetPassword /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      
      {/* Show landing page for unauthenticated users on root */}
      <Route path="/" element={token ? <Layout /> : <LandingPageSimple />}>
        <Route index element={<Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
        <Route path="dashboard" element={isAdmin ? <Navigate to="/admin" /> : <Dashboard />} />
        <Route path="profile" element={isAdmin ? <Navigate to="/admin" /> : <Profile />} />
        <Route path="diet" element={isAdmin ? <Navigate to="/admin" /> : <DietPlan />} />
        <Route path="workout" element={isAdmin ? <Navigate to="/admin" /> : <WorkoutPlan />} />
        <Route path="food" element={isAdmin ? <Navigate to="/admin" /> : <FoodDatabase />} />
        <Route path="food-database" element={isAdmin ? <Navigate to="/admin" /> : <FoodDatabase />} />
        <Route path="progress" element={isAdmin ? <Navigate to="/admin" /> : <Progress />} />
        <Route path="chat" element={isAdmin ? <Navigate to="/admin" /> : <ChatAssistant />} />
        <Route path="timeline" element={<Navigate to="/dashboard" replace />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
      </Routes>
    </>
  );
}

export default App;
