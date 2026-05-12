import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreVertical, Search } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/user/profile')).data
  });

  const { data: dietPlan } = useQuery({
    queryKey: ['currentDiet'],
    queryFn: async () => (await api.get('/diet/current')).data
  });

  const userName = profile?.profile?.name || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Calculate total calories from diet plan
  const getTotalCalories = () => {
    if (!dietPlan?.meals) return 0;
    const { breakfast, lunch, dinner, snacks } = dietPlan.meals;
    let total = 0;
    if (breakfast?.totalCalories) total += breakfast.totalCalories;
    if (lunch?.totalCalories) total += lunch.totalCalories;
    if (dinner?.totalCalories) total += dinner.totalCalories;
    if (snacks) {
      snacks.forEach(snack => {
        if (snack.totalCalories) total += snack.totalCalories;
      });
    }
    return Math.round(total);
  };

  const currentCalories = getTotalCalories();
  const goalCalories = dietPlan?.dailyCalories || 1850;
  const caloriePercentage = (currentCalories / goalCalories) * 100;

  // Get water intake from diet plan
  const waterIntake = dietPlan?.waterIntake || '3L';
  const waterAmount = parseFloat(waterIntake.replace('L', '')) || 3;
  const currentWater = 2.5; // This should come from user's daily log in future
  const waterGlasses = Math.ceil(waterAmount);
  const filledGlasses = Math.floor((currentWater / waterAmount) * waterGlasses);

  return (
    <div className="flex gap-6 max-w-[1400px] mx-auto min-h-screen" style={{ paddingLeft: '0', paddingRight: '0' }}>
      {/* LEFT COLUMN - Main Content */}
      <div className="flex-1 space-y-6" style={{ minWidth: '0' }}>
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-primary/10"
          style={{ backgroundColor: '#25253D' }}
        >
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4" style={{ borderColor: '#6C63FF', boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)' }}>
                <img 
                  src={profile?.profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} 
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#4CAF50', border: '2px solid #25253D' }}>
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            {/* Greeting Text */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: '#E0E0E0' }}>
                {greeting}, {userName}! 👋
              </h1>
              <p style={{ color: '#A0A0B0' }}>Your AI plans are ready.</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <button 
            onClick={() => navigate('/workout')}
            className="text-white rounded-xl p-4 font-semibold transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#6C63FF', boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)' }}
          >
            Generate New Workout Plan
          </button>
          <button 
            onClick={() => navigate('/diet')}
            className="text-white rounded-xl p-4 font-semibold transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#4ECDC4' }}
          >
            Log Today's Meal
          </button>
        </motion.div>

        {/* Daily Overview Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#E0E0E0' }}>
            Your Daily Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Calories Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 border transition-all duration-300"
              style={{ 
                backgroundColor: '#25253D', 
                borderColor: 'rgba(108, 99, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)'
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: '#E0E0E0' }}>Today's Calories</h3>
              
              <div className="relative w-40 h-40 mx-auto mb-4">
                {/* Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#2F2F4A"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(currentCalories / goalCalories) * 440} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#44A3A0" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold font-mono" style={{ color: '#E0E0E0' }}>{currentCalories}</div>
                  <div className="text-sm" style={{ color: '#A0A0B0' }}>/ {goalCalories} kcal</div>
                </div>
                
                {/* Fire Icon */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <svg className="w-6 h-6 text-[#4ECDC4]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Status Message */}
              <div className="text-center">
                {currentCalories > goalCalories ? (
                  <p className="text-xs" style={{ color: '#FF9800' }}>⚠️ Over goal by {currentCalories - goalCalories} cal</p>
                ) : (
                  <p className="text-xs" style={{ color: '#4CAF50' }}>✓ {goalCalories - currentCalories} cal remaining</p>
                )}
              </div>
            </motion.div>

            {/* Water Intake Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 border transition-all duration-300"
              style={{ 
                backgroundColor: '#25253D', 
                borderColor: 'rgba(108, 99, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)'
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: '#E0E0E0' }}>Daily Water Intake</h3>
              
              <div className="flex items-end justify-center gap-3 mb-6 h-32">
                {Array.from({ length: waterGlasses }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="relative"
                    style={{ originY: 1 }}
                  >
                    <div className={`w-12 h-24 rounded-lg border-2 ${i < filledGlasses ? 'border-[#4ECDC4] bg-gradient-to-t from-[#4ECDC4]/30 to-[#4ECDC4]/10' : 'border-text-muted/30'} flex items-center justify-center transition-all duration-300`}>
                      <svg className={`w-6 h-6 ${i < filledGlasses ? 'text-[#4ECDC4]' : 'text-text-muted/30'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: '#E0E0E0' }}>{currentWater} / {waterAmount} L</div>
                <div className="text-xs" style={{ color: '#A0A0B0' }}>Goal: {dietPlan?.goal || 'Weight Loss'}</div>
                <div className="text-xs" style={{ color: '#808090' }}>Updated: Just now</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Weight Trend Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 border"
          style={{ 
            backgroundColor: '#25253D', 
            borderColor: 'rgba(108, 99, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: '#E0E0E0' }}>Weight Trend</h3>
              <p className="text-sm" style={{ color: '#A0A0B0' }}>(Last 30 Days)</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono" style={{ color: '#E0E0E0' }}>68.2 kg</div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#4CAF50' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                -4.2 kg
              </div>
            </div>
          </div>
          
          <div className="text-xs mb-4" style={{ color: '#808090' }}>Status: Active calories & macros...</div>
          
          {/* Chart */}
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ECDC4" />
                  <stop offset="100%" stopColor="#44A3A0" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="45" x2="600" y2="45" stroke="#2F2F4A" strokeWidth="1"/>
              <line x1="0" y1="90" x2="600" y2="90" stroke="#2F2F4A" strokeWidth="1"/>
              <line x1="0" y1="135" x2="600" y2="135" stroke="#2F2F4A" strokeWidth="1"/>
              
              {/* Area under line */}
              <path
                d="M 0,30 L 100,40 L 200,60 L 300,90 L 400,110 L 500,120 L 600,130 L 600,180 L 0,180 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 0,30 L 100,40 L 200,60 L 300,90 L 400,110 L 500,120 L 600,130"
                fill="none"
                stroke="url(#lineGradient2)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {[
                { x: 0, y: 30 },
                { x: 100, y: 40 },
                { x: 200, y: 60 },
                { x: 300, y: 90 },
                { x: 400, y: 110 },
                { x: 500, y: 120 },
                { x: 600, y: 130 }
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#4ECDC4"
                  className="hover:r-6 transition-all cursor-pointer"
                />
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-xs mt-2" style={{ color: '#808090' }}>
              <span>100</span>
              <span>200</span>
              <span>400</span>
              <span>500</span>
              <span>1200</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN - Sidebar Cards */}
      <div className="w-[320px] space-y-4 flex-shrink-0 hidden lg:block">
        {/* AI Food Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-primary/10"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Quick Food Lookoup..." 
              className="w-full pl-10 pr-4 py-2 bg-background-light border border-primary/20 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <h3 className="text-lg font-bold text-text-primary mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AI Food Recomendations
          </h3>

          <div className="space-y-2">
            <button className="w-full py-3 bg-[#4ECDC4] hover:bg-[#45B8AF] text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              Low-Carb Snacks
            </button>
            <button className="w-full py-3 bg-background-light hover:bg-background-lighter text-text-primary rounded-lg font-semibold transition-all duration-300 border border-primary/10">
              High-Protein Breakfast
            </button>
          </div>
        </motion.div>

        {/* TODAY'S WORKOUT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-primary/10"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Today's Workout</h2>
          
          <div className="relative mb-6 overflow-hidden rounded-xl group">
            <img 
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop" 
              alt="Workout" 
              className="w-full h-40 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white text-lg mb-1">Full Body Strength</h3>
              <p className="text-white/80 text-sm">Duration: 45 mins</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/workout')}
            className="w-full py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-glow hover:shadow-card-hover"
          >
            Start Workout
          </button>
        </motion.div>

        {/* AI TIP OF THE DAY */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl p-6 shadow-card border border-primary/20 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="currentColor" className="text-primary"/>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>AI Tip of the Day</h2>
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
            </div>
            
            <div className="bg-background-light/50 backdrop-blur-sm rounded-xl p-4 mb-4 border border-primary/10">
              <p className="text-text-primary text-sm leading-relaxed mb-3">
                Avoid sugary drinks today due to diabetes risk. Try herbal tea or infused water instead! 🍵
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Your current diet is well-balanced, but increasing protein intake by 10g can help with muscle recovery.
              </p>
            </div>

            <button 
              onClick={() => navigate('/chat')}
              className="w-full px-4 py-2 bg-primary/20 hover:bg-primary/30 backdrop-blur-sm text-primary rounded-lg text-sm font-semibold transition-all border border-primary/30 hover:scale-105"
            >
              Ask AI
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
