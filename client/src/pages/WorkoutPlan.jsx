import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ChevronLeft, ChevronRight, Check, Target, Clock, MapPin, AlertTriangle, ChevronRight as ChevronRightIcon, Flame, Moon, Activity, Footprints, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const CYAN = '#2FE8FF';
const C55 = 'rgba(47,232,255,0.55)';
const C50 = 'rgba(47,232,255,0.5)';
const C45 = 'rgba(47,232,255,0.45)';
const C35 = 'rgba(47,232,255,0.35)';
const C20 = 'rgba(47,232,255,0.2)';
const C15 = 'rgba(47,232,255,0.15)';
const C12 = 'rgba(47,232,255,0.12)';
const C10 = 'rgba(47,232,255,0.1)';
const C08 = 'rgba(47,232,255,0.08)';
const C05 = 'rgba(47,232,255,0.05)';
const C04 = 'rgba(47,232,255,0.04)';
const CARD = 'linear-gradient(160deg, #001428 0%, #001f3d 50%, #002d5c 100%)';
const CARD2 = 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 50%, #0d2040 100%)';
const CLIP = 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)';
const CLIP_SM = 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)';
const CLIP_BTN = 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)';

export default function WorkoutPlan() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedDay, setExpandedDay] = useState(null);
  const [formData, setFormData] = useState({
    level: 'beginner', location: 'home', workoutType: 'full_body',
    duration: '30', frequency: '3', equipment: [],
    limitations: '', goals: '', timePreference: 'morning'
  });

  const { data: workoutPlan, isLoading } = useQuery({
    queryKey: ['currentWorkout'],
    queryFn: async () => (await api.get('/workout/current')).data
  });

  const generateMutation = useMutation({
    mutationFn: (data) => api.post('/workout/generate', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentWorkout']);
      toast.success('Workout plan generated!');
      setShowForm(false);
    }
  });

  const steps = [
    { id: 1, title: 'Fitness Level', description: "What's your current fitness experience?", icon: Target },
    { id: 2, title: 'Workout Location', description: 'Where will you be exercising?', icon: MapPin },
    { id: 3, title: 'Workout Preferences', description: 'What type of workouts do you prefer?', icon: Dumbbell },
    { id: 4, title: 'Schedule & Duration', description: 'How often and how long can you workout?', icon: Clock },
    { id: 5, title: 'Equipment & Goals', description: 'What equipment do you have and what are your goals?', icon: Target },
    { id: 6, title: 'Limitations & Preferences', description: 'Any physical limitations or time preferences?', icon: AlertTriangle }
  ];

  const handleNext = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleGenerate = () => {
    generateMutation.mutate({
      ...formData,
      duration: parseInt(formData.duration),
      frequency: parseInt(formData.frequency),
      limitations: formData.limitations.split(',').map(s => s.trim()).filter(Boolean),
      goals: formData.goals.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1: return formData.level;
      case 2: return formData.location;
      case 3: return formData.workoutType;
      case 4: return formData.duration && formData.frequency;
      case 5: return formData.goals;
      default: return true;
    }
  };

  const getDayIcon = (focus = '') => {
    const f = focus.toLowerCase();
    if (f.includes('rest')) return { icon: <Moon size={18} color={CYAN} />, color: CYAN };
    if (f.includes('cardio')) return { icon: <Activity size={18} color={CYAN} />, color: CYAN };
    if (f.includes('upper')) return { icon: <Dumbbell size={18} color={CYAN} />, color: CYAN };
    if (f.includes('lower')) return { icon: <Footprints size={18} color={CYAN} />, color: CYAN };
    if (f.includes('full')) return { icon: <Flame size={18} color={CYAN} />, color: CYAN };
    return { icon: <Dumbbell size={18} color={CYAN} />, color: CYAN };
  };

  const DayCard = ({ day, index }) => {
    const isExpanded = expandedDay === index;
    const isRest = day.focus?.toLowerCase().includes('rest') || day.day?.toLowerCase().includes('sunday');
    const [hovered, setHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative mb-4"
      >
        <div className="flex gap-4">
          <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
            <div
              className="w-10 h-10 flex items-center justify-center font-bold text-sm"
              style={{ background: C12, border: `1px solid ${C20}`, clipPath: CLIP_SM, color: CYAN }}
            >
              {index + 1}
            </div>
            <div className="w-0.5 flex-1 mt-1" style={{ background: C10, minHeight: '16px' }} />
          </div>

          <div
            className="flex-1 p-4 cursor-pointer transition-all duration-300"
            style={{
              background: CARD,
              clipPath: CLIP,
              border: `1px solid ${hovered ? C50 : C15}`,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => !isRest && setExpandedDay(isExpanded ? null : index)}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
              opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
            }} />

            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>{day.day}</h3>
                <p className="text-sm" style={{ color: C45 }}>{day.focus} • {day.duration}</p>
              </div>
              {!isRest && (
                <ChevronRightIcon size={20} style={{
                  color: hovered ? C50 : C35,
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s, color 0.3s',
                }} />
              )}
            </div>

            {isRest ? (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-48 h-24 overflow-hidden shadow-lg" style={{ clipPath: CLIP_SM }}>
                  <img src="/sunday.png" alt="Rest Day" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 mb-2"
                    style={{ background: C08, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
                  >
                    <Moon size={18} color={CYAN} />
                    <span className="font-semibold text-sm" style={{ color: CYAN }}>Rest & Recovery Day</span>
                  </div>
                  <p className="text-xs" style={{ color: C35 }}>Let your muscles recover and grow stronger</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-48 h-24 overflow-hidden shadow-lg" style={{ clipPath: CLIP_SM }}>
                    <img
                      src={(() => {
                        if (day.focus?.toLowerCase().includes('upper')) return '/part 1 body.png';
                        const d = day.day?.toLowerCase();
                        if (d?.includes('monday')) return '/part 1 body.png';
                        if (d?.includes('tuesday')) return '/tuesday.png';
                        if (d?.includes('wednesday')) return '/wednesday.png';
                        if (d?.includes('thursday')) return '/thursday.png';
                        if (d?.includes('friday')) return '/friday.png';
                        if (d?.includes('saturday')) return '/saturday.png';
                        if (d?.includes('sunday')) return '/sunday.png';
                        return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=96&h=96&fit=crop';
                      })()}
                      alt={day.focus}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 mb-2"
                      style={{ background: C08, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
                    >
                      {getDayIcon(day.focus).icon}
                      <span className="font-semibold text-sm" style={{ color: CYAN }}>{day.focus}</span>
                    </div>
                    <p className="text-xs" style={{ color: C35 }}>{day.exercises?.length || 0} exercises • {day.duration}</p>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-3"
                  style={{ background: C05, border: `1px solid ${C10}` }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs" style={{ color: C50 }}>Exercises</p>
                      <p className="font-bold text-lg" style={{ color: CYAN }}>{day.exercises?.length || 0}</p>
                    </div>
                    <div className="w-px h-10" style={{ background: C15 }} />
                    <div>
                      <p className="text-xs" style={{ color: C50 }}>Duration</p>
                      <p className="font-semibold" style={{ color: CYAN }}>{day.duration}</p>
                    </div>
                    <div className="w-px h-10" style={{ background: C15 }} />
                    <div>
                      <p className="text-xs" style={{ color: C50 }}>Focus</p>
                      <p className="font-semibold capitalize" style={{ color: CYAN }}>{day.focus?.split(' ')[0]}</p>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-3 mt-3"
                    style={{ borderTop: `1px solid ${C15}` }}
                  >
                    <h5 className="text-sm font-semibold mb-3" style={{ color: C55 }}>
                      Complete {day.day} Exercises
                      <span className="text-xs ml-2" style={{ color: C35 }}>({day.exercises?.length} exercises)</span>
                    </h5>
                    {day.exercises?.map((ex, j) => (
                      <div
                        key={j}
                        className="flex items-start justify-between p-3 transition-all duration-200"
                        style={{ background: C04, border: `1px solid ${C10}` }}
                        onMouseEnter={e => e.currentTarget.style.background = C08}
                        onMouseLeave={e => e.currentTarget.style.background = C04}
                      >
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: CYAN }}>{ex.name}</p>
                          <p className="text-xs mb-1" style={{ color: C45 }}>Rest: {ex.restTime}</p>
                          <p className="text-xs" style={{ color: C35 }}>{ex.instructions}</p>
                        </div>
                        <span
                          className="text-xs font-semibold ml-3 flex-shrink-0 px-2 py-1"
                          style={{ background: C08, color: CYAN, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
                        >
                          {ex.sets} × {ex.reps}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ background: '#000d1a', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #001428, #002d5c)', border: `1px solid ${C20}`, clipPath: CLIP_SM }}
          >
            <Dumbbell size={32} color={CYAN} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>AI Workout Plan</h1>
            <p style={{ color: C55 }}>Personalized exercise routine based on your goals 💪</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 font-semibold transition cursor-pointer"
          style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN, fontFamily: 'Montserrat, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.background = C08}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Dumbbell size={20} />
          Generate Workout Plan
        </button>
      </motion.div>

      {/* Generate Form */}
      {showForm && (
        <div className="mb-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      clipPath: CLIP_SM,
                      background: currentStep > step.id ? '#4ECDC4' : currentStep === step.id ? C12 : C05,
                      border: `1px solid ${currentStep > step.id ? '#4ECDC4' : currentStep === step.id ? CYAN : C20}`,
                      color: currentStep > step.id ? '#001935' : currentStep === step.id ? CYAN : C35,
                    }}
                  >
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 mx-2 transition-all" style={{ background: currentStep > step.id ? CYAN : C15 }} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>{steps[currentStep - 1]?.title}</h2>
              <p className="mt-1" style={{ color: C55 }}>{steps[currentStep - 1]?.description}</p>
            </div>
          </div>

          <div className="p-6" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <div>
                    <label className="block mb-4 text-lg" style={{ color: CYAN }}>What's your fitness level?</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'beginner', label: 'Beginner', desc: 'New to exercise or returning after a break' },
                        { value: 'intermediate', label: 'Intermediate', desc: 'Regular exercise for 6+ months' },
                        { value: 'advanced', label: 'Advanced', desc: 'Experienced with consistent training' }
                      ].map(o => (
                        <button
                          key={o.value} type="button"
                          onClick={() => setFormData({ ...formData, level: o.value })}
                          className="p-6 transition-all text-left cursor-pointer"
                          style={{ background: formData.level === o.value ? C12 : C05, border: `1px solid ${formData.level === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}
                        >
                          <div className="font-semibold text-lg mb-2" style={{ color: CYAN }}>{o.label}</div>
                          <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <label className="block mb-4 text-lg" style={{ color: CYAN }}>Where will you workout?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: 'home', label: 'Home', desc: 'Workout from the comfort of your home' },
                        { value: 'gym', label: 'Gym', desc: 'Access to full gym equipment' },
                        { value: 'outdoor', label: 'Outdoor', desc: 'Parks, trails, and outdoor spaces' },
                        { value: 'hybrid', label: 'Hybrid', desc: 'Mix of home, gym, and outdoor' }
                      ].map(o => (
                        <button
                          key={o.value} type="button"
                          onClick={() => setFormData({ ...formData, location: o.value })}
                          className="p-6 transition-all text-left cursor-pointer"
                          style={{ background: formData.location === o.value ? C12 : C05, border: `1px solid ${formData.location === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}
                        >
                          <div className="font-semibold text-lg mb-2" style={{ color: CYAN }}>{o.label}</div>
                          <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <label className="block mb-4 text-lg" style={{ color: CYAN }}>What type of workouts do you prefer?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: 'full_body', label: 'Full Body', desc: 'Work all muscle groups in each session' },
                        { value: 'upper_lower', label: 'Upper/Lower Split', desc: 'Alternate between upper and lower body' },
                        { value: 'cardio_focus', label: 'Cardio Focus', desc: 'Emphasis on cardiovascular fitness' },
                        { value: 'strength_focus', label: 'Strength Focus', desc: 'Build muscle and strength' },
                        { value: 'hiit', label: 'HIIT', desc: 'High-intensity interval training' },
                        { value: 'flexibility', label: 'Flexibility/Yoga', desc: 'Stretching, yoga, and mobility' }
                      ].map(o => (
                        <button
                          key={o.value} type="button"
                          onClick={() => setFormData({ ...formData, workoutType: o.value })}
                          className="p-4 transition-all text-left cursor-pointer"
                          style={{ background: formData.workoutType === o.value ? C12 : C05, border: `1px solid ${formData.workoutType === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}
                        >
                          <div className="font-semibold mb-1" style={{ color: CYAN }}>{o.label}</div>
                          <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-4 text-lg" style={{ color: CYAN }}>Workout Duration</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['15', '30', '45', '60', '90'].map(d => (
                            <button
                              key={d} type="button"
                              onClick={() => setFormData({ ...formData, duration: d })}
                              className="p-3 transition-all text-center cursor-pointer"
                              style={{ background: formData.duration === d ? C12 : C05, border: `1px solid ${formData.duration === d ? CYAN : C20}`, color: formData.duration === d ? CYAN : C45, clipPath: CLIP_BTN }}
                            >
                              {d} min
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-4 text-lg" style={{ color: CYAN }}>Frequency per Week</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['2', '3', '4', '5', '6', '7'].map(f => (
                            <button
                              key={f} type="button"
                              onClick={() => setFormData({ ...formData, frequency: f })}
                              className="p-3 transition-all text-center cursor-pointer"
                              style={{ background: formData.frequency === f ? C12 : C05, border: `1px solid ${formData.frequency === f ? CYAN : C20}`, color: formData.frequency === f ? CYAN : C45, clipPath: CLIP_BTN }}
                            >
                              {f}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-4 text-lg" style={{ color: CYAN }}>Preferred Time</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'morning', label: 'Morning', desc: '6 AM - 10 AM' },
                          { value: 'afternoon', label: 'Afternoon', desc: '12 PM - 4 PM' },
                          { value: 'evening', label: 'Evening', desc: '5 PM - 9 PM' }
                        ].map(o => (
                          <button
                            key={o.value} type="button"
                            onClick={() => setFormData({ ...formData, timePreference: o.value })}
                            className="p-4 transition-all text-center cursor-pointer"
                            style={{ background: formData.timePreference === o.value ? C12 : C05, border: `1px solid ${formData.timePreference === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}
                          >
                            <div className="font-semibold mb-1" style={{ color: CYAN }}>{o.label}</div>
                            <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-4 text-lg" style={{ color: CYAN }}>Available Equipment</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Kettlebells', 'Barbell', 'Treadmill', 'Yoga Mat', 'None'].map(eq => (
                          <button
                            key={eq} type="button"
                            onClick={() => {
                              const cur = formData.equipment || [];
                              if (eq === 'None') { setFormData({ ...formData, equipment: ['None'] }); return; }
                              const next = cur.includes(eq) ? cur.filter(e => e !== eq && e !== 'None') : [...cur.filter(e => e !== 'None'), eq];
                              setFormData({ ...formData, equipment: next });
                            }}
                            className="p-3 transition-all text-sm cursor-pointer"
                            style={{ background: formData.equipment?.includes(eq) ? C12 : C05, border: `1px solid ${formData.equipment?.includes(eq) ? CYAN : C20}`, color: formData.equipment?.includes(eq) ? CYAN : C45, clipPath: CLIP_BTN }}
                          >
                            {eq}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-lg" style={{ color: CYAN }}>Fitness Goals</label>
                      <input
                        type="text" value={formData.goals}
                        onChange={e => setFormData({ ...formData, goals: e.target.value })}
                        placeholder="e.g., Weight loss, Muscle gain, Better stamina"
                        className="w-full px-4 py-3 focus:outline-none mb-4"
                        style={{ background: C05, border: `1px solid ${C20}`, color: CYAN, clipPath: CLIP_BTN }}
                      />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 'Flexibility', 'Toning', 'Athletic Performance', 'General Fitness'].map(g => (
                          <button
                            key={g} type="button"
                            onClick={() => {
                              const cur = formData.goals.split(',').map(x => x.trim()).filter(Boolean);
                              setFormData({ ...formData, goals: cur.includes(g) ? cur.filter(x => x !== g).join(', ') : [...cur, g].join(', ') });
                            }}
                            className="p-2 transition-all text-sm cursor-pointer"
                            style={{ background: formData.goals.includes(g) ? C12 : C05, border: `1px solid ${formData.goals.includes(g) ? CYAN : C20}`, color: formData.goals.includes(g) ? CYAN : C45, clipPath: CLIP_BTN }}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 text-lg" style={{ color: CYAN }}>Physical Limitations</label>
                      <p className="text-sm mb-3" style={{ color: C45 }}>Any injuries or physical limitations? (Optional)</p>
                      <input
                        type="text" value={formData.limitations}
                        onChange={e => setFormData({ ...formData, limitations: e.target.value })}
                        placeholder="e.g., Back pain, Knee issues, Shoulder injury"
                        className="w-full px-4 py-3 focus:outline-none"
                        style={{ background: C05, border: `1px solid ${C20}`, color: CYAN, clipPath: CLIP_BTN }}
                      />
                    </div>
                    <div className="p-6" style={{ background: C08, border: `1px solid ${C20}`, clipPath: CLIP_SM }}>
                      <h3 className="font-semibold mb-2" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Ready to Generate!</h3>
                      <ul className="text-sm space-y-1" style={{ color: C55 }}>
                        <li>• {formData.level} level • {formData.duration} min • {formData.frequency}x/week</li>
                        <li>• {formData.location} workouts • {formData.workoutType.replace('_', ' ')}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: `1px solid ${C15}` }}>
              <button
                type="button" onClick={handlePrevious} disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                style={{ background: 'transparent', border: `1px solid ${C20}`, color: C55, clipPath: CLIP_BTN }}
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <span className="text-sm" style={{ color: C35 }}>Step {currentStep} of {steps.length}</span>
              {currentStep < steps.length ? (
                <button
                  type="button" onClick={handleNext} disabled={!isStepValid(currentStep)}
                  className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                  style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                  onMouseEnter={e => e.currentTarget.style.background = C08}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Next <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="button" onClick={handleGenerate} disabled={generateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                  style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                  onMouseEnter={e => e.currentTarget.style.background = C08}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {generateMutation.isPending ? 'Generating...' : 'Generate Plan'} <Dumbbell size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plan Display */}
      {isLoading ? (
        <div className="p-8 text-center" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
          <p style={{ color: CYAN }}>Loading...</p>
        </div>
      ) : workoutPlan ? (
        <>
          <div className="mb-6 p-6" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4" style={{ background: C05, border: `1px solid ${C10}` }}>
                <p className="text-sm mb-1" style={{ color: C50 }}>Level</p>
                <p className="text-2xl font-bold capitalize" style={{ color: CYAN }}>{workoutPlan.level}</p>
              </div>
              <div className="text-center p-4" style={{ background: C05, border: `1px solid ${C10}` }}>
                <p className="text-sm mb-1" style={{ color: C50 }}>Location</p>
                <p className="text-2xl font-bold capitalize" style={{ color: CYAN }}>{workoutPlan.location}</p>
              </div>
              <div className="text-center p-4" style={{ background: C05, border: `1px solid ${C10}` }}>
                <p className="text-sm mb-1" style={{ color: C50 }}>Status</p>
                <p className="text-2xl font-bold capitalize" style={{ color: CYAN }}>{workoutPlan.status}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              {workoutPlan.weeklySchedule?.map((day, i) => (
                <DayCard key={i} day={day} index={i} />
              ))}
            </div>

            <div className="w-72 flex-shrink-0 space-y-4">
              <div className="p-5" style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}` }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Weekly Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Days', value: workoutPlan.weeklySchedule?.length || 0 },
                    { label: 'Workout Days', value: workoutPlan.weeklySchedule?.filter(d => !d.focus?.toLowerCase().includes('rest') && !d.day?.toLowerCase().includes('sunday')).length || 0 },
                    { label: 'Rest Days', value: workoutPlan.weeklySchedule?.filter(d => d.focus?.toLowerCase().includes('rest') || d.day?.toLowerCase().includes('sunday')).length || 0 },
                    { label: 'Level', value: workoutPlan.level },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C10}` }}>
                      <span className="text-xs" style={{ color: C45 }}>{label}</span>
                      <span className="text-sm font-bold capitalize font-mono" style={{ color: CYAN }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5" style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}` }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Week Schedule</h3>
                <div className="space-y-2">
                  {workoutPlan.weeklySchedule?.map((day, i) => {
                    const isRest = day.focus?.toLowerCase().includes('rest') || day.day?.toLowerCase().includes('sunday');
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: isRest ? C08 : C12, border: `1px solid ${isRest ? C15 : C20}`, color: isRest ? C35 : CYAN, clipPath: CLIP_BTN }}
                        >
                          {day.day?.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ color: isRest ? C35 : C55 }}>{day.focus}</p>
                        </div>
                        <span className="text-xs flex-shrink-0" style={{ color: C35 }}>{day.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5" style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}` }}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Plan Details</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Location', value: workoutPlan.location, icon: <MapPin size={12} color={CYAN} /> },
                    { label: 'Type', value: workoutPlan.workoutType?.replace('_', ' '), icon: <Dumbbell size={12} color={CYAN} /> },
                    { label: 'Status', value: workoutPlan.status, icon: <CheckCircle size={12} color={CYAN} /> },
                  ].filter(r => r.value).map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C10}` }}>
                      <span className="text-xs flex items-center gap-1" style={{ color: C45 }}>
                        <span>{icon}</span>{label}
                      </span>
                      <span className="text-xs font-medium capitalize" style={{ color: CYAN }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
          <Dumbbell size={48} style={{ color: C35, margin: '0 auto 16px' }} />
          <p className="text-xl mb-2" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>No workout plan yet</p>
          <p className="mb-6" style={{ color: C55 }}>Generate your personalized AI workout plan to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 font-semibold transition cursor-pointer"
            style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
            onMouseEnter={e => e.currentTarget.style.background = C08}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Generate Workout Plan
          </button>
        </div>
      )}
    </div>
  );
}
