import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, User, Ruler, Heart, Utensils, Target, Home, Edit3 } from 'lucide-react';
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
const CARD = 'linear-gradient(160deg, #001428 0%, #001f3d 50%, #002d5c 100%)';
const CARD2 = 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 50%, #0d2040 100%)';
const CLIP = 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)';
const CLIP_SM = 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)';
const CLIP_BTN = 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)';

const inputStyle = {
  background: C05,
  border: `1px solid ${C20}`,
  color: CYAN,
  clipPath: CLIP_BTN,
  width: '100%',
  padding: '12px 16px',
  outline: 'none',
  fontSize: '1rem',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
};

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/user/profile')).data
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male', height: '', weight: '',
    activityLevel: 'moderate', medicalConditions: '', allergies: '',
    dietaryPreference: 'veg', fitnessGoals: '', lifestyle: ''
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        age: user.profile.age || '',
        gender: user.profile.gender || 'male',
        height: user.profile.height || '',
        weight: user.profile.weight || '',
        activityLevel: user.profile.activityLevel || 'moderate',
        medicalConditions: user.profile.medicalConditions?.join(', ') || '',
        allergies: user.profile.allergies?.join(', ') || '',
        dietaryPreference: user.profile.dietaryPreference || 'veg',
        fitnessGoals: user.profile.fitnessGoals?.join(', ') || '',
        lifestyle: user.profile.lifestyle || ''
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/user/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  });

  const steps = [
    { id: 1, title: 'Personal Info', description: "Basic details about you", icon: User },
    { id: 2, title: 'Physical Details', description: 'Your measurements & activity', icon: Ruler },
    { id: 3, title: 'Health Info', description: 'Medical conditions & allergies', icon: Heart },
    { id: 4, title: 'Diet Preferences', description: 'Your food preferences', icon: Utensils },
    { id: 5, title: 'Fitness Goals', description: 'What you want to achieve', icon: Target },
    { id: 6, title: 'Lifestyle', description: 'Your daily routine', icon: Home },
  ];

  const handleNext = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    updateMutation.mutate({
      ...formData,
      age: parseInt(formData.age) || 0,
      height: parseFloat(formData.height) || 0,
      weight: parseFloat(formData.weight) || 0,
      medicalConditions: formData.medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      fitnessGoals: formData.fitnessGoals.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const isStepValid = (step) => {
    const optional = ['medicalConditions', 'allergies', 'lifestyle'];
    return (steps[step - 1]?.fields || []).every(f => optional.includes(f) || (formData[f] && formData[f].toString().trim() !== ''));
  };

  const hasProfile = user?.profile && Object.keys(user.profile).length > 1;
  const bmi = user?.profile?.height && user?.profile?.weight
    ? (user.profile.weight / Math.pow(user.profile.height / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto" style={{ background: '#000d1a', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>Your Profile</h1>
          <p style={{ color: C55 }}>Complete your profile for personalized AI recommendations</p>
        </div>
        {hasProfile && (
          <button
            onClick={() => { setIsEditing(true); setCurrentStep(1); }}
            className="flex items-center gap-2 px-5 py-2.5 font-semibold transition cursor-pointer"
            style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
            onMouseEnter={e => e.currentTarget.style.background = C08}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </motion.div>

      {/* Hero Profile Card */}
      {hasProfile && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative overflow-hidden"
          style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C20}` }}
        >
          {/* Top glow line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />

          {/* Decorative background glow */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, rgba(47,232,255,0.06) 0%, transparent 70%)`, pointerEvents: 'none' }} />

          <div className="flex items-center gap-8 p-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 overflow-hidden" style={{ border: `2px solid ${C20}`, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <img
                    src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'}
                    alt={user.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full" style={{ background: '#4CAF50', border: `2px solid #001428` }} />
              </div>
            </div>

            {/* Name + tags */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>
                {user.profile.name || 'Your Name'}
              </h2>
              <p className="text-sm mb-3" style={{ color: C45 }}>
                @{user.profile.name?.toLowerCase().replace(/\s+/g, '') || 'username'}
              </p>
              <p className="text-sm mb-3" style={{ color: C55 }}>
                {[
                  user.profile.dietaryPreference && `${user.profile.dietaryPreference} diet`,
                  user.profile.activityLevel && `${user.profile.activityLevel} activity`,
                  user.profile.gender,
                ].filter(Boolean).join(' • ')}
              </p>
              {user.profile.fitnessGoals?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.profile.fitnessGoals.slice(0, 3).map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold"
                      style={{ background: C12, border: `1px solid ${C20}`, color: CYAN, clipPath: CLIP_BTN }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              {[
                { label: 'Age', value: user.profile.age ? `${user.profile.age} yrs` : '--' },
                { label: 'Weight', value: user.profile.weight ? `${user.profile.weight} kg` : '--' },
                { label: 'Height', value: user.profile.height ? `${user.profile.height} cm` : '--' },
                ...(bmi ? [{ label: 'BMI', value: bmi }] : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-6 px-4 py-2"
                  style={{ background: C08, border: `1px solid ${C15}`, clipPath: CLIP_BTN }}
                >
                  <span className="text-xs" style={{ color: C45 }}>{label}</span>
                  <span className="font-bold text-sm font-mono" style={{ color: CYAN }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info grid below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-8 pb-8">
            {[
              { label: 'Diet', value: user.profile.dietaryPreference || '--' },
              { label: 'Activity', value: user.profile.activityLevel || '--' },
              { label: 'Gender', value: user.profile.gender || '--' },
              { label: 'Goals', value: user.profile.fitnessGoals?.length ? `${user.profile.fitnessGoals.length} set` : '--' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 text-center" style={{ background: C05, border: `1px solid ${C10}` }}>
                <p className="text-xs mb-1" style={{ color: C35, letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</p>
                <p className="font-semibold capitalize" style={{ color: CYAN }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!hasProfile && !isEditing && (
        <div
          className="mb-8 p-12 text-center relative"
          style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
          <User size={64} style={{ color: C20, margin: '0 auto 16px' }} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>Welcome! Let's set up your profile</h2>
          <p className="mb-8" style={{ color: C55 }}>Complete your profile to get personalized AI recommendations for your health and fitness journey.</p>
          <button
            onClick={() => { setIsEditing(true); setCurrentStep(1); }}
            className="px-8 py-3 font-semibold transition cursor-pointer"
            style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
            onMouseEnter={e => e.currentTarget.style.background = C08}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Create Your Profile
          </button>
        </div>
      )}

      {/* Step indicator */}
      {isEditing && (
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
                  <div className="w-12 h-0.5 mx-1 transition-all" style={{ background: currentStep > step.id ? CYAN : C15 }} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>{steps[currentStep - 1]?.title}</h2>
            <p className="mt-1" style={{ color: C55 }}>{steps[currentStep - 1]?.description}</p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {isEditing && (
        <div className="p-6 relative" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
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
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Age</label>
                      <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="Age in years" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Gender</label>
                      <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} style={selectStyle}>
                        <option value="male" style={{ background: '#001428' }}>Male</option>
                        <option value="female" style={{ background: '#001428' }}>Female</option>
                        <option value="other" style={{ background: '#001428' }}>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Height (cm)</label>
                      <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="e.g., 170" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Weight (kg)</label>
                      <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 70" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-3 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Activity Level</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                        { value: 'light', label: 'Light', desc: 'Light exercise 1-3 days/week' },
                        { value: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
                        { value: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
                        { value: 'very_active', label: 'Very Active', desc: 'Very hard exercise, physical job' },
                      ].map(o => (
                        <button key={o.value} type="button" onClick={() => setFormData({ ...formData, activityLevel: o.value })}
                          className="p-4 transition-all text-left cursor-pointer"
                          style={{ background: formData.activityLevel === o.value ? C12 : C05, border: `1px solid ${formData.activityLevel === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}>
                          <div className="font-semibold mb-1" style={{ color: CYAN }}>{o.label}</div>
                          <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Medical Conditions</label>
                    <p className="text-sm mb-3" style={{ color: C35 }}>Any medical conditions we should know about? (Optional)</p>
                    <input type="text" value={formData.medicalConditions} onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })} placeholder="e.g., Diabetes, High Blood Pressure" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Allergies</label>
                    <p className="text-sm mb-3" style={{ color: C35 }}>Any food allergies or intolerances? (Optional)</p>
                    <input type="text" value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} placeholder="e.g., Nuts, Gluten, Lactose" style={inputStyle} />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <label className="block mb-3 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Dietary Preference</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { value: 'veg', label: 'Vegetarian', desc: 'No meat, fish, or poultry' },
                      { value: 'non-veg', label: 'Non-Vegetarian', desc: 'Includes all foods' },
                      { value: 'vegan', label: 'Vegan', desc: 'No animal products' },
                      { value: 'keto', label: 'Keto', desc: 'Low carb, high fat' },
                      { value: 'halal', label: 'Halal', desc: 'Islamic dietary laws' },
                    ].map(o => (
                      <button key={o.value} type="button" onClick={() => setFormData({ ...formData, dietaryPreference: o.value })}
                        className="p-4 transition-all text-left cursor-pointer"
                        style={{ background: formData.dietaryPreference === o.value ? C12 : C05, border: `1px solid ${formData.dietaryPreference === o.value ? CYAN : C20}`, clipPath: CLIP_SM }}>
                        <div className="font-semibold mb-1" style={{ color: CYAN }}>{o.label}</div>
                        <div className="text-sm" style={{ color: C45 }}>{o.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Fitness Goals</label>
                    <p className="text-sm mb-3" style={{ color: C35 }}>Separate multiple goals with commas</p>
                    <input type="text" value={formData.fitnessGoals} onChange={e => setFormData({ ...formData, fitnessGoals: e.target.value })} placeholder="e.g., Weight loss, Muscle gain, Better stamina" style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Weight Loss', 'Muscle Gain', 'Better Stamina', 'Healthy Lifestyle', 'Strength Training', 'Flexibility', 'Mental Health', 'Energy Boost'].map(g => (
                      <button key={g} type="button"
                        onClick={() => {
                          const cur = formData.fitnessGoals.split(',').map(x => x.trim()).filter(Boolean);
                          setFormData({ ...formData, fitnessGoals: cur.includes(g) ? cur.filter(x => x !== g).join(', ') : [...cur, g].join(', ') });
                        }}
                        className="p-2 transition-all text-sm cursor-pointer"
                        style={{ background: formData.fitnessGoals.includes(g) ? C12 : C05, border: `1px solid ${formData.fitnessGoals.includes(g) ? CYAN : C20}`, color: formData.fitnessGoals.includes(g) ? CYAN : C45, clipPath: CLIP_BTN }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <label className="block mb-2 text-sm" style={{ color: C55, letterSpacing: '1px', textTransform: 'uppercase' }}>Lifestyle & Food Habits</label>
                  <p className="text-sm mb-3" style={{ color: C35 }}>Tell us about your daily routine, eating habits, or any other preferences</p>
                  <textarea
                    value={formData.lifestyle}
                    onChange={e => setFormData({ ...formData, lifestyle: e.target.value })}
                    rows={6}
                    placeholder="e.g., I work from home, prefer home-cooked meals, eat 3 times a day..."
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: `1px solid ${C15}` }}>
            <div className="flex gap-3">
              <button type="button" onClick={handlePrevious} disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                style={{ background: 'transparent', border: `1px solid ${C20}`, color: C55, clipPath: CLIP_BTN }}>
                <ChevronLeft size={20} /> Previous
              </button>
              <button type="button" onClick={() => setIsEditing(false)}
                className="px-6 py-3 transition cursor-pointer"
                style={{ background: 'transparent', border: '1px solid rgba(255,100,100,0.3)', color: 'rgba(255,100,100,0.7)', clipPath: CLIP_BTN }}>
                Cancel
              </button>
            </div>
            <span className="text-sm" style={{ color: C35 }}>Step {currentStep} of {steps.length}</span>
            {currentStep < steps.length ? (
              <button type="button" onClick={handleNext} disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                onMouseEnter={e => e.currentTarget.style.background = C08}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-50 cursor-pointer"
                style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                onMouseEnter={e => e.currentTarget.style.background = C08}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {updateMutation.isPending ? 'Saving...' : 'Save Profile'} <Check size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}