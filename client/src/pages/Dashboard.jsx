import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import api from '../lib/api';
import { useMagnetic, useGSAP } from '../lib/useGSAP';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [workoutHovered, setWorkoutHovered] = useState(false);
  const [mealHovered, setMealHovered] = useState(false);
  const [caloriesHovered, setCaloriesHovered] = useState(false);
  const [waterHovered, setWaterHovered] = useState(false);
  const [weightHovered, setWeightHovered] = useState(false);

  // GSAP refs
  const workoutBtnRef = useRef(null);
  const mealBtnRef = useRef(null);
  const caloriesNumRef = useRef(null);
  const weightNumRef = useRef(null);
  const greetingRef = useRef(null);

  // Magnetic buttons
  useMagnetic(workoutBtnRef, 0.3);
  useMagnetic(mealBtnRef, 0.3);

  // Page entrance animation
  useGSAP(() => {
    gsap.fromTo('[data-gsap="card"]',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/user/profile')).data
  });

  const { data: dietPlan } = useQuery({
    queryKey: ['currentDiet'],
    queryFn: async () => (await api.get('/diet/current')).data
  });

  const { data: todayProgress } = useQuery({
    queryKey: ['todayProgress'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const res = await api.get(`/progress?startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`);
      return res.data;
    },
    refetchInterval: 10000, // refresh every 10s
  });

  const { data: progressStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/progress/stats')).data,
    refetchInterval: 15000,
  });

  const userName = profile?.profile?.name || 'User';
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';

  const getTotalCalories = () => {
    if (!dietPlan?.meals) return 0;
    let t = 0;
    const { breakfast, lunch, dinner, snacks } = dietPlan.meals;
    if (breakfast?.totalCalories) t += breakfast.totalCalories;
    if (lunch?.totalCalories) t += lunch.totalCalories;
    if (dinner?.totalCalories) t += dinner.totalCalories;
    if (snacks) {
      snacks.forEach(snack => {
        if (snack.totalCalories) t += snack.totalCalories;
      });
    }
    return Math.round(t);
  };

  const currentCalories = getTotalCalories();
  const goalCalories = dietPlan?.dailyCalories || 1850;

  // Counter animation when calories data loads
  useEffect(() => {
    if (caloriesNumRef.current && currentCalories > 0) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: currentCalories,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (caloriesNumRef.current) caloriesNumRef.current.textContent = Math.round(obj.val);
        },
      });
    }
  }, [currentCalories]);

  // Water from today's progress log
  const waterAmount = 4;
  const currentWater = todayProgress?.[0]?.waterIntake ?? 0;
  const waterGlasses = waterAmount;
  const filledGlasses = Math.round((currentWater / waterAmount) * waterGlasses);

  return (
    <div className="flex gap-6 max-w-[1400px] mx-auto min-h-screen">
      <style>{`
        @keyframes bottleGlow0 { 0%,100% { filter: drop-shadow(0 0 4px rgba(47,232,255,0.5)); } 50% { filter: drop-shadow(0 0 14px rgba(47,232,255,1)); } }
        @keyframes bottleGlow1 { 0%,100% { filter: drop-shadow(0 0 4px rgba(47,232,255,0.5)); } 50% { filter: drop-shadow(0 0 14px rgba(47,232,255,1)); } }
        @keyframes bottleGlow2 { 0%,100% { filter: drop-shadow(0 0 4px rgba(47,232,255,0.5)); } 50% { filter: drop-shadow(0 0 14px rgba(47,232,255,1)); } }
        @keyframes bottleGlow3 { 0%,100% { filter: drop-shadow(0 0 4px rgba(47,232,255,0.5)); } 50% { filter: drop-shadow(0 0 14px rgba(47,232,255,1)); } }
      `}</style>
      <motion.div className="flex-1 space-y-6" style={{ minWidth: 0 }} variants={stagger} initial="hidden" animate="show">

        <motion.div variants={fadeUp} className="border border-primary/10 relative overflow-hidden gsap-shimmer" data-gsap="card" style={{ background: 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 50%, #0d2040 100%)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)', padding: '24px' }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4" style={{ borderColor: '#6C63FF', boxShadow: '0 0 20px rgba(108,99,255,0.4)' }}>
                <img src={profile?.profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'} alt={userName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#4ECDC4', border: '2px solid #25253D' }}>
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: '#2FE8FF' }}>{greeting}, {userName}! 👋</h1>
              <p style={{ color: '#2FE8FF', opacity: 0.7 }}>Your AI plans are ready.</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#2FE8FF' }}>Your Daily Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border relative overflow-hidden" data-reveal="up" data-reveal-delay="0.1"
              style={{ background: 'linear-gradient(145deg, #000d1a 0%, #001428 40%, #001e3c 70%, #002050 100%)', borderColor: caloriesHovered ? 'rgba(78,205,196,0.4)' : 'rgba(108,99,255,0.2)', boxShadow: caloriesHovered ? '0 8px 40px rgba(78,205,196,0.15), 0 0 0 1px rgba(78,205,196,0.1)' : '0 4px 24px rgba(108,99,255,0.12)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)', padding: '20px', transition: 'border-color 0.4s ease, box-shadow 0.4s ease' }}
              onMouseEnter={() => setCaloriesHovered(true)} onMouseLeave={() => setCaloriesHovered(false)}>

              {/* Animated top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: caloriesHovered ? 'linear-gradient(90deg, transparent, #4ECDC4, #6C63FF, transparent)' : 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)', transition: 'background 0.4s ease' }} />

              {/* Corner ambient glow */}
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ECDC4', boxShadow: '0 0 8px #4ECDC4' }} />
                  <h3 style={{ color: '#2FE8FF', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.9rem', margin: 0, letterSpacing: '1px' }}>TODAY'S CALORIES</h3>
                </div>
                <div style={{ padding: '3px 10px', background: currentCalories > goalCalories ? 'rgba(255,152,0,0.12)' : 'rgba(78,205,196,0.1)', border: `1px solid ${currentCalories > goalCalories ? 'rgba(255,152,0,0.3)' : 'rgba(78,205,196,0.25)'}`, fontSize: '0.6rem', letterSpacing: '2px', color: currentCalories > goalCalories ? '#FF9800' : '#4ECDC4', fontWeight: 700 }}>
                  {currentCalories > goalCalories ? 'OVER' : 'ON TRACK'}
                </div>
              </div>

              {/* Main content: ring + stats side by side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                {/* Dual-ring chart */}
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                  <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                      <linearGradient id="calOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="50%" stopColor="#4ECDC4" />
                        <stop offset="100%" stopColor="#2FE8FF" />
                      </linearGradient>
                      <linearGradient id="calInner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="100%" stopColor="#FFB74D" />
                      </linearGradient>
                      <filter id="calGlow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* Outer track */}
                    <circle cx="65" cy="65" r="56" stroke="rgba(47,232,255,0.06)" strokeWidth="10" fill="none" />
                    {/* Outer progress — calories */}
                    <circle cx="65" cy="65" r="56" stroke="url(#calOuter)" strokeWidth="10" fill="none"
                      strokeDasharray={`${Math.min((currentCalories / goalCalories), 1) * 351.9} 351.9`}
                      strokeLinecap="round" filter="url(#calGlow)"
                      style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
                    {/* Inner track */}
                    <circle cx="65" cy="65" r="42" stroke="rgba(255,107,107,0.08)" strokeWidth="7" fill="none" />
                    {/* Inner progress — burned (mock 60% of goal) */}
                    <circle cx="65" cy="65" r="42" stroke="url(#calInner)" strokeWidth="7" fill="none"
                      strokeDasharray={`${Math.min(0.6, 1) * 263.9} 263.9`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
                  </svg>
                  {/* Center text */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="font-mono font-bold" ref={caloriesNumRef} style={{ color: '#2FE8FF', fontSize: '1.6rem', lineHeight: 1, textShadow: '0 0 20px rgba(47,232,255,0.5)' }}>{currentCalories}</div>
                    <div style={{ color: 'rgba(47,232,255,0.45)', fontSize: '0.6rem', letterSpacing: '1px', marginTop: '2px' }}>KCAL</div>
                  </div>
                </div>

                {/* Right stats */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Goal vs consumed */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ color: 'rgba(47,232,255,0.35)', fontSize: '0.55rem', letterSpacing: '2px', marginBottom: '2px' }}>GOAL</div>
                      <div style={{ color: '#2FE8FF', fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace' }}>{goalCalories}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'rgba(47,232,255,0.35)', fontSize: '0.55rem', letterSpacing: '2px', marginBottom: '2px' }}>REMAINING</div>
                      <div style={{ color: currentCalories > goalCalories ? '#FF9800' : '#4ECDC4', fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        {currentCalories > goalCalories ? `+${currentCalories - goalCalories}` : goalCalories - currentCalories}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ position: 'relative', height: '4px', background: 'rgba(47,232,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((currentCalories / goalCalories) * 100, 100)}%` }}
                      transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ height: '100%', background: currentCalories > goalCalories ? 'linear-gradient(90deg, #FF6B6B, #FF9800)' : 'linear-gradient(90deg, #6C63FF, #4ECDC4, #2FE8FF)', borderRadius: '2px', boxShadow: '0 0 8px rgba(78,205,196,0.6)' }}
                    />
                  </div>

                  {/* Macro mini bars */}
                  {[
                    { label: 'Protein', pct: 0.72, color: '#6C63FF' },
                    { label: 'Carbs', pct: 0.55, color: '#4ECDC4' },
                    { label: 'Fat', pct: 0.40, color: '#FFB74D' },
                  ].map(({ label, pct, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: 'rgba(47,232,255,0.4)', fontSize: '0.6rem', width: '38px', letterSpacing: '0.5px' }}>{label}</div>
                      <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct * 100}%` }}
                          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                          style={{ height: '100%', background: color, borderRadius: '2px', boxShadow: `0 0 6px ${color}80` }}
                        />
                      </div>
                      <div style={{ color, fontSize: '0.6rem', fontFamily: 'monospace', width: '24px', textAlign: 'right' }}>{Math.round(pct * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom legend */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(47,232,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #2FE8FF)' }} />
                  <span style={{ color: 'rgba(47,232,255,0.45)', fontSize: '0.6rem', letterSpacing: '1px' }}>CONSUMED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #FFB74D)' }} />
                  <span style={{ color: 'rgba(47,232,255,0.45)', fontSize: '0.6rem', letterSpacing: '1px' }}>BURNED</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="10" height="10" fill="#4ECDC4" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#4ECDC4', fontSize: '0.6rem', letterSpacing: '1px' }}>{Math.round((currentCalories / goalCalories) * 100)}% OF GOAL</span>
                </div>
              </div>
            </div>
            <div className="border relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #001428 0%, #001f3d 50%, #002d5c 100%)', borderColor: 'rgba(78,205,196,0.15)', boxShadow: '0 4px 20px rgba(78,205,196,0.08)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)', padding: '24px' }}
              onMouseEnter={() => setWaterHovered(true)} onMouseLeave={() => setWaterHovered(false)}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: waterHovered ? 'linear-gradient(90deg, transparent, #2FE8FF, transparent)' : 'transparent', transition: 'background 0.4s ease' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#2FE8FF' }}>Daily Water Intake</h3>
              <p className="text-xs mb-4" style={{ color: '#2FE8FF', opacity: 0.5 }}>Log in Progress page to update</p>

              {/* Bottles row */}
              <div className="flex items-end justify-center gap-2 mb-4" style={{ height: '100px' }}>
                {Array.from({ length: waterGlasses }).map((_, i) => {
                  const filled = i < filledGlasses;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      style={{ position: 'relative', width: '32px', height: '90px' }}
                    >
                      <div style={{
                        width: '32px', height: '90px',
                        filter: filled ? undefined : 'none',
                        animation: filled ? `bottleGlow${i} 2s ease-in-out infinite` : 'none',
                      }}>
                      <svg viewBox="0 0 32 90" width="32" height="90">
                        <defs>
                          <clipPath id={`bc${i}`}>
                            <path d="M4,18 Q4,14 8,14 L24,14 Q28,14 28,18 L28,82 Q28,86 24,86 L8,86 Q4,86 4,82 Z" />
                          </clipPath>
                          <linearGradient id={`wg${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2FE8FF" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#0077aa" stopOpacity="1" />
                          </linearGradient>
                          <linearGradient id={`bg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={filled ? 'rgba(47,232,255,0.15)' : 'rgba(255,255,255,0.04)'} />
                            <stop offset="100%" stopColor={filled ? 'rgba(0,120,180,0.1)' : 'rgba(255,255,255,0.02)'} />
                          </linearGradient>
                          <filter id={`glow${i}`}>
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                        </defs>

                        {/* Bottle cap */}
                        <rect x="11" y="2" width="10" height="8" rx="2"
                          fill={filled ? 'rgba(47,232,255,0.5)' : 'rgba(255,255,255,0.1)'}
                          stroke={filled ? '#2FE8FF' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
                        <rect x="13" y="10" width="6" height="5" rx="1"
                          fill={filled ? 'rgba(47,232,255,0.4)' : 'rgba(255,255,255,0.08)'} />

                        {/* Bottle body */}
                        <path d="M4,18 Q4,14 8,14 L24,14 Q28,14 28,18 L28,82 Q28,86 24,86 L8,86 Q4,86 4,82 Z"
                          fill={`url(#bg${i})`}
                          stroke={filled ? '#2FE8FF' : 'rgba(255,255,255,0.12)'}
                          strokeWidth="1.5"
                          filter={filled ? `url(#glow${i})` : undefined} />

                        {/* Water fill */}
                        {filled && (
                          <motion.rect
                            x="4" width="24" rx="0"
                            fill={`url(#wg${i})`}
                            clipPath={`url(#bc${i})`}
                            initial={{ height: 0, y: 86 }}
                            animate={{ height: 68, y: 18 }}
                            transition={{ duration: 1.4, delay: 0.5 + i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                          />
                        )}

                        {/* Animated wave */}
                        {filled && (
                          <motion.path
                            clipPath={`url(#bc${i})`}
                            fill="rgba(255,255,255,0.2)"
                            animate={{ d: [
                              'M4,20 Q10,16 16,20 Q22,24 28,20 L28,26 L4,26 Z',
                              'M4,22 Q10,18 16,22 Q22,26 28,22 L28,28 L4,28 Z',
                              'M4,20 Q10,16 16,20 Q22,24 28,20 L28,26 L4,26 Z',
                            ]}}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 + i * 0.1 }}
                          />
                        )}

                        {/* Bubbles */}
                        {filled && [6, 14, 22].map((bx, bi) => (
                          <motion.circle key={bi} cx={bx} cy={70} r="1.5"
                            fill="rgba(255,255,255,0.5)"
                            clipPath={`url(#bc${i})`}
                            animate={{ cy: [70, 22], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 2 + bi * 0.4, repeat: Infinity, delay: 1.5 + bi * 0.6 + i * 0.2, ease: 'easeOut' }}
                          />
                        ))}

                        {/* Shine */}
                        <rect x="7" y="22" width="3" height="18" rx="1.5"
                          fill="rgba(255,255,255,0.15)" clipPath={`url(#bc${i})`} />

                        {/* Label */}
                        <text x="16" y="96" textAnchor="middle" fontSize="8"
                          fill={filled ? '#2FE8FF' : 'rgba(255,255,255,0.3)'}>
                          {i + 1}L
                        </text>
                      </svg>
                      </div>

                      {/* Glow under filled bottle */}
                      {filled && (
                        <motion.div
                          style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '28px', height: '6px', borderRadius: '50%', background: 'rgba(47,232,255,0.4)', filter: 'blur(4px)' }}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>



              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold font-mono mb-1"
                  style={{ color: '#2FE8FF' }}
                  animate={{ textShadow: currentWater > 0 ? ['0 0 8px rgba(47,232,255,0)', '0 0 16px rgba(47,232,255,0.4)', '0 0 8px rgba(47,232,255,0)'] : 'none' }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentWater} <span style={{ fontSize: '1rem', color: '#2FE8FF', opacity: 0.5 }}>/ {waterAmount} L</span>
                </motion.div>
                <div className="text-xs" style={{ color: currentWater >= waterAmount ? '#2FE8FF' : '#A0A0B0' }}>
                  {currentWater >= waterAmount ? '🎉 Goal reached!' : `${(waterAmount - currentWater).toFixed(1)}L more to go`}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="border relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #001020 0%, #001a35 50%, #00264d 100%)', borderColor: 'rgba(78,205,196,0.15)', boxShadow: '0 4px 20px rgba(78,205,196,0.08)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)', padding: '24px' }}
          onMouseEnter={() => setWeightHovered(true)} onMouseLeave={() => setWeightHovered(false)}>
          {/* Animated top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #4ECDC4, transparent)', opacity: weightHovered ? 1 : 0.5, transition: 'opacity 0.4s ease' }} />
          {/* Corner glow */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,232,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {(() => {
            const weightLogs = progressStats?.data?.map(p => ({
              date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              weight: p.weight,
            })).filter(d => d.weight).reverse() || [];

            const latestWeight = todayProgress?.[0]?.weight ?? weightLogs[weightLogs.length - 1]?.weight ?? null;
            const weightChange = progressStats?.weightChange ?? 0;
            const isDown = weightChange <= 0;
            const hasData = weightLogs.length > 1;

            // Chart math
            const wVals = weightLogs.map(d => d.weight);
            const wMin = hasData ? Math.min(...wVals) - 0.5 : 0;
            const wMax = hasData ? Math.max(...wVals) + 0.5 : 1;
            const wRange = wMax - wMin || 1;
            const W = 600; const H = 200;
            const wPts = weightLogs.map((d, i) => ({
              x: (i / (weightLogs.length - 1)) * W,
              y: H - ((d.weight - wMin) / wRange) * (H - 24) - 12,
              weight: d.weight,
              date: d.date,
            }));

            // Smooth bezier curve
            const smoothPath = wPts.length > 1 ? wPts.map((p, i) => {
              if (i === 0) return `M${p.x},${p.y}`;
              const prev = wPts[i - 1];
              const cpx = (prev.x + p.x) / 2;
              return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
            }).join(' ') : '';

            const areaPath = smoothPath + (wPts.length > 1 ? ` L${wPts[wPts.length-1].x},${H} L0,${H} Z` : '');

            // Goal line (target weight — 5% below current max)
            const goalWeight = hasData ? (wMax - 0.5).toFixed(1) : null;
            const goalY = hasData ? H - ((parseFloat(goalWeight) - wMin) / wRange) * (H - 16) - 8 : null;

            // Stats
            const minW = hasData ? Math.min(...wVals).toFixed(1) : '--';
            const maxW = hasData ? Math.max(...wVals).toFixed(1) : '--';
            const avgW = hasData ? (wVals.reduce((a, b) => a + b, 0) / wVals.length).toFixed(1) : '--';

            return (
              <>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ECDC4', boxShadow: '0 0 8px #4ECDC4' }} />
                      <h3 style={{ color: '#2FE8FF', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '1px' }}>Weight Trend</h3>
                    </div>
                    <p style={{ color: 'rgba(47,232,255,0.4)', fontSize: '0.72rem', margin: 0, letterSpacing: '1px' }}>
                      LAST 30 DAYS · LIVE FROM PROGRESS
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#2FE8FF', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>
                      {latestWeight ? `${latestWeight}` : '--'}
                      <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(47,232,255,0.5)', marginLeft: '4px' }}>kg</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', marginTop: '4px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: isDown ? 'rgba(78,205,196,0.15)' : 'rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', color: isDown ? '#4ECDC4' : '#FF6B6B' }}>{isDown ? '↓' : '↑'}</span>
                      </div>
                      <span style={{ color: isDown ? '#4ECDC4' : '#FF6B6B', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                      </span>
                      <span style={{ color: 'rgba(47,232,255,0.3)', fontSize: '0.72rem' }}>30d</span>
                    </div>
                  </div>
                </div>

                {/* Mini stat pills */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { label: 'MIN', value: `${minW} kg`, color: '#4ECDC4' },
                    { label: 'AVG', value: `${avgW} kg`, color: '#2FE8FF' },
                    { label: 'MAX', value: `${maxW} kg`, color: '#A89FFF' },
                    { label: 'LOGS', value: weightLogs.length, color: '#FFB74D' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ flex: 1, padding: '6px 8px', background: 'rgba(47,232,255,0.04)', border: '1px solid rgba(47,232,255,0.1)', textAlign: 'center' }}>
                      <div style={{ color: 'rgba(47,232,255,0.35)', fontSize: '0.55rem', letterSpacing: '2px', marginBottom: '2px' }}>{label}</div>
                      <div style={{ color, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{ position: 'relative', height: '180px' }}>
                  {hasData ? (
                    <>
                      <svg width="100%" height="180" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="wtLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ECDC4" />
                            <stop offset="50%" stopColor="#2FE8FF" />
                            <stop offset="100%" stopColor="#6C63FF" />
                          </linearGradient>
                          <linearGradient id="wtAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.3" />
                            <stop offset="60%" stopColor="#2FE8FF" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#2FE8FF" stopOpacity="0" />
                          </linearGradient>
                          <filter id="wtGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                          <filter id="wtGlowStrong">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                          <clipPath id="wtClip">
                            <rect x="0" y="0" width={W} height={H} />
                          </clipPath>
                        </defs>

                        {/* Grid lines */}
                        {[0.25, 0.5, 0.75].map((pct, i) => (
                          <line key={i} x1="0" y1={H * pct} x2={W} y2={H * pct}
                            stroke="rgba(47,232,255,0.06)" strokeWidth="1" strokeDasharray="4,8" />
                        ))}

                        {/* Goal line */}
                        {goalY !== null && (
                          <>
                            <line x1="0" y1={goalY} x2={W} y2={goalY}
                              stroke="rgba(255,183,77,0.3)" strokeWidth="1" strokeDasharray="6,6" />
                            <rect x={W - 60} y={goalY - 10} width="58" height="14" rx="2"
                              fill="rgba(255,183,77,0.12)" />
                            <text x={W - 31} y={goalY + 1} textAnchor="middle" fontSize="8"
                              fill="rgba(255,183,77,0.7)" fontFamily="monospace">GOAL</text>
                          </>
                        )}

                        {/* Area fill */}
                        <path d={areaPath} fill="url(#wtAreaGrad)" clipPath="url(#wtClip)" />

                        {/* Glow line (thick, blurred) */}
                        <path d={smoothPath} fill="none" stroke="rgba(78,205,196,0.25)"
                          strokeWidth="8" strokeLinecap="round" filter="url(#wtGlow)" clipPath="url(#wtClip)" />

                        {/* Main animated line */}
                        <motion.path d={smoothPath} fill="none" stroke="url(#wtLineGrad)"
                          strokeWidth="2.5" strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 2.2, ease: 'easeInOut' }}
                          style={{ filter: 'drop-shadow(0 0 6px rgba(78,205,196,0.8))' }}
                          clipPath="url(#wtClip)" />

                        {/* Data points */}
                        {wPts.map((p, i) => {
                          const isLatest = i === wPts.length - 1;
                          const isLowest = p.weight === Math.min(...wVals);
                          return (
                            <g key={i}>
                              {/* Outer ring for special points */}
                              {(isLatest || isLowest) && (
                                <motion.circle cx={p.x} cy={p.y} r="10"
                                  fill="none" stroke={isLatest ? '#2FE8FF' : '#4ECDC4'}
                                  strokeWidth="1" strokeOpacity="0.3"
                                  animate={{ r: [8, 12, 8], opacity: [0.3, 0.6, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                              )}
                              {/* Point */}
                              <motion.circle cx={p.x} cy={p.y}
                                r={isLatest ? 5 : 3.5}
                                fill={isLatest ? '#2FE8FF' : isLowest ? '#4ECDC4' : 'rgba(47,232,255,0.6)'}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.5 + i * 0.08, duration: 0.3 }}
                                style={{ filter: `drop-shadow(0 0 ${isLatest ? 6 : 3}px ${isLatest ? '#2FE8FF' : '#4ECDC4'})` }} />
                            </g>
                          );
                        })}

                        {/* Latest point label */}
                        {wPts.length > 0 && (() => {
                          const last = wPts[wPts.length - 1];
                          const labelX = Math.min(last.x, W - 50);
                          return (
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                              <rect x={labelX - 24} y={last.y - 22} width="48" height="16" rx="3"
                                fill="rgba(47,232,255,0.12)" stroke="rgba(47,232,255,0.3)" strokeWidth="1" />
                              <text x={labelX} y={last.y - 11} textAnchor="middle" fontSize="9"
                                fill="#2FE8FF" fontFamily="monospace" fontWeight="bold">
                                {last.weight} kg
                              </text>
                            </motion.g>
                          );
                        })()}
                      </svg>

                      {/* X-axis labels */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '4px', borderTop: '1px solid rgba(47,232,255,0.06)' }}>
                        {weightLogs
                          .filter((_, i) => i % Math.max(1, Math.floor(weightLogs.length / 5)) === 0)
                          .map((d, i) => (
                            <span key={i} style={{ color: 'rgba(47,232,255,0.35)', fontSize: '0.65rem', fontFamily: 'monospace' }}>{d.date}</span>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" fill="none" stroke="#4ECDC4" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M3 3v18h18M7 16l4-4 4 4 4-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'rgba(47,232,255,0.5)', fontSize: '0.85rem', margin: '0 0 4px', fontWeight: 600 }}>No weight data yet</p>
                        <p style={{ color: 'rgba(47,232,255,0.3)', fontSize: '0.75rem', margin: 0 }}>Log your weight in Progress page</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </motion.div>

      </motion.div>

      <motion.div className="w-[320px] space-y-4 flex-shrink-0 hidden lg:block" variants={stagger} initial="hidden" animate="show">

        {/* Generate Workout Card */}
        <motion.div variants={fadeRight} className="gsap-shimmer"
          onMouseEnter={() => setWorkoutHovered(true)} onMouseLeave={() => setWorkoutHovered(false)}
          style={{
            position: 'relative', height: '432px', overflow: 'hidden', cursor: 'default',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
            border: '1px solid rgba(108,99,255,0.35)',
          }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img src="/workout.jpg" alt="Workout" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: workoutHovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease', display: 'block' }} />
          </div>
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%)' }} />
          {/* Top border glow */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: workoutHovered ? 'linear-gradient(90deg, transparent, #6C63FF, transparent)' : 'transparent', transition: 'background 0.4s ease' }} />
          {/* Icon top-right */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF', opacity: workoutHovered ? 1 : 0.5, transition: 'opacity 0.4s' }}>
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </div>
          {/* Body slides up on hover */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 20px', transform: workoutHovered ? 'translateY(0)' : 'translateY(52px)', transition: 'transform 0.4s ease' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#2FE8FF', marginBottom: '6px', fontWeight: 700 }}>AI Powered</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '1px', color: '#2FE8FF', marginBottom: '10px', textTransform: 'uppercase' }}>Workout Plan</div>
            <p style={{ fontSize: '0.8rem', color: '#2FE8FF', lineHeight: 1.6, opacity: workoutHovered ? 0.8 : 0, transition: 'opacity 0.3s ease 0.1s', margin: '0 0 14px' }}>AI-tailored plan based on your goals & fitness level. 45 min · 380 kcal · Medium</p>
            <motion.button onClick={() => navigate('/workout')} whileHover={{ scale: 1.03, background: 'rgba(108,99,255,0.12)' }} whileTap={{ scale: 0.97 }}
              ref={workoutBtnRef}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(47,232,255,0.6)', color: '#2FE8FF', position: 'relative', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)', opacity: workoutHovered ? 1 : 0, transition: 'opacity 0.3s ease 0.15s' }}>
              Start Workout
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Log Meal Card */}
        <motion.div variants={fadeRight}
          onMouseEnter={() => setMealHovered(true)} onMouseLeave={() => setMealHovered(false)}
          style={{
            position: 'relative', height: '432px', overflow: 'hidden', cursor: 'default',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
            border: '1px solid rgba(78,205,196,0.35)',
          }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img src="/diet plan.jeg" alt="Diet Plan" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: mealHovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease', display: 'block' }} />
          </div>
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%)' }} />
          {/* Top border glow */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: mealHovered ? 'linear-gradient(90deg, transparent, #4ECDC4, transparent)' : 'transparent', transition: 'background 0.4s ease' }} />
          {/* Icon top-right */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ECDC4', opacity: mealHovered ? 1 : 0.5, transition: 'opacity 0.4s' }}>
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          </div>
          {/* Body slides up on hover */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 20px', transform: mealHovered ? 'translateY(0)' : 'translateY(52px)', transition: 'transform 0.4s ease' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '6px', fontWeight: 700 }}>Track Now</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '1px', color: '#2FE8FF', marginBottom: '10px', textTransform: 'uppercase' }}>Log Today's Meal</div>
            <p style={{ fontSize: '0.8rem', color: '#2FE8FF', lineHeight: 1.6, opacity: mealHovered ? 0.8 : 0, transition: 'opacity 0.3s ease 0.1s', margin: '0 0 14px' }}>Consumed: {currentCalories} kcal · Goal: {goalCalories} kcal · Left: {Math.max(goalCalories - currentCalories, 0)} kcal</p>
            <motion.button onClick={() => navigate('/diet')} whileHover={{ scale: 1.03, background: 'rgba(78,205,196,0.1)' }} whileTap={{ scale: 0.97 }}
              ref={mealBtnRef}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(78,205,196,0.6)', color: '#4ECDC4', position: 'relative', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)', opacity: mealHovered ? 1 : 0, transition: 'opacity 0.3s ease 0.15s' }}>
              Log Meal
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </motion.button>
          </div>
        </motion.div>

        

      </motion.div>
    </div>
  );
}
