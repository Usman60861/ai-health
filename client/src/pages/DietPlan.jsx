import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Minus, Search, AlertTriangle, CheckCircle, Sunrise, Sun, Moon as MoonIcon, Apple, ChevronRight, Flame, Salad, UtensilsCrossed, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CYAN = '#2FE8FF';
const CYAN_55 = 'rgba(47,232,255,0.55)';
const CYAN_50 = 'rgba(47,232,255,0.5)';
const CYAN_60 = 'rgba(47,232,255,0.6)';
const CYAN_45 = 'rgba(47,232,255,0.45)';
const CYAN_35 = 'rgba(47,232,255,0.35)';
const CYAN_20 = 'rgba(47,232,255,0.2)';
const CYAN_15 = 'rgba(47,232,255,0.15)';
const CYAN_12 = 'rgba(47,232,255,0.12)';
const CYAN_10 = 'rgba(47,232,255,0.1)';
const CYAN_08 = 'rgba(47,232,255,0.08)';
const CYAN_05 = 'rgba(47,232,255,0.05)';
const CYAN_04 = 'rgba(47,232,255,0.04)';
const CARD_BG = 'linear-gradient(160deg, #001428 0%, #001f3d 50%, #002d5c 100%)';
const CARD_BG_ALT = 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 50%, #0d2040 100%)';
const CLIP_CARD = 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)';
const CLIP_CARD_SM = 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)';
const CLIP_BTN = 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)';

export default function DietPlan() {
  const queryClient = useQueryClient();
  const [showFoodBrowser, setShowFoodBrowser] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [showBudgetSelection, setShowBudgetSelection] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [expandedMeal, setExpandedMeal] = useState(null);
  
  const { data: dietPlan, isLoading } = useQuery({
    queryKey: ['currentDiet'],
    queryFn: async () => (await api.get('/diet/current')).data
  });

  // Get foods for browser
  const { data: foods } = useQuery({
    queryKey: ['foods', foodSearch],
    queryFn: async () => {
      if (!foodSearch) return [];
      const { data } = await api.get(`/food/search?q=${foodSearch}`);
      return data;
    },
    enabled: !!foodSearch
  });

  const generateMutation = useMutation({
    mutationFn: (budgetPreference) => api.post('/diet/generate', { budgetPreference }),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentDiet']);
      toast.success('Diet plan generated!');
      setShowBudgetSelection(false);
    },
    onError: () => toast.error('Failed to generate plan')
  });

  const handleGenerateClick = () => {
    setShowBudgetSelection(true);
  };

  const handleBudgetSelection = (budget) => {
    setSelectedBudget(budget);
    generateMutation.mutate(budget);
  };

  // Calculate total calories
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
    return total;
  };

  // Check if adding food exceeds goal
  const checkCalorieLimit = (newFoodCalories) => {
    const currentTotal = getTotalCalories();
    const goalCalories = dietPlan?.dailyCalories || 2000;
    return currentTotal + newFoodCalories > goalCalories;
  };

  // Add food to meal
  const addFoodToMeal = async (food, mealType, replaceIndex = null) => {
    try {
      const foodCalories = food.nutrition?.calories || 0;
      
      // Check calorie limit
      if (checkCalorieLimit(foodCalories) && replaceIndex === null) {
        const shouldProceed = window.confirm(
          `⚠️ Adding ${food.name} (${foodCalories} cal) will exceed your daily goal of ${dietPlan?.dailyCalories || 2000} calories. Do you want to continue?`
        );
        if (!shouldProceed) return;
      }

      // Get AI recommendation
      const aiResponse = await getAIRecommendation(food, mealType);
      
      const response = await api.post('/diet/modify-meal', {
        mealType,
        action: replaceIndex !== null ? 'replace' : 'add',
        food: {
          food: food.name,
          quantity: food.servingSize,
          calories: food.nutrition?.calories || 0,
          protein: food.nutrition?.protein || 0,
          carbs: food.nutrition?.carbs || 0,
          fats: food.nutrition?.fats || 0
        },
        replaceIndex
      });

      queryClient.invalidateQueries(['currentDiet']);
      
      // Show AI recommendation
      if (aiResponse) {
        toast.success(`${food.name} added! AI says: ${aiResponse.substring(0, 100)}...`);
        setAiRecommendation(aiResponse);
      } else {
        toast.success(`${food.name} added to ${mealType}!`);
      }
      
      setShowFoodBrowser(false);
    } catch (error) {
      toast.error('Failed to add food');
    }
  };

  // Remove food from meal
  const removeFoodFromMeal = async (mealType, itemIndex) => {
    try {
      await api.post('/diet/modify-meal', {
        mealType,
        action: 'remove',
        itemIndex
      });
      
      queryClient.invalidateQueries(['currentDiet']);
      toast.success('Food removed!');
    } catch (error) {
      toast.error('Failed to remove food');
    }
  };

  // Get AI recommendation for food
  const getAIRecommendation = async (food, mealType) => {
    try {
      const query = `Is ${food.name} (${food.nutrition?.calories} calories) good for ${mealType}? Consider nutrition and health benefits.`;
      const { data } = await api.post('/food/recommend', { query });
      return data.recommendation;
    } catch (error) {
      return null;
    }
  };

  // Open food browser
  const openFoodBrowser = (mealType) => {
    setSelectedMeal(mealType);
    setShowFoodBrowser(true);
    setFoodSearch('');
  };

  // Get meal icon and color
  // Circular icons: #4ECDC4 (Log Today's Meal color from Dashboard)
  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return { icon: Sunrise, color: CYAN, bg: CYAN, label: 'Breakfast' };
      case 'lunch': return { icon: Sun, color: CYAN, bg: CYAN, label: 'Lunch' };
      case 'dinner': return { icon: MoonIcon, color: CYAN, bg: CYAN, label: 'Dinner' };
      default: return { icon: Apple, color: CYAN, bg: CYAN, label: 'Snacks' };
    }
  };

  const MealCard = ({ meal, title, mealType, time }) => {
    const { icon: Icon, label } = getMealIcon(mealType);
    const isExpanded = expandedMeal === mealType;
    const [hovered, setHovered] = useState(false);

    // Calculate total nutrition for the meal
    const totalCalories = meal?.items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
    const totalProtein = meal?.items?.reduce((sum, item) => sum + (item.protein || 0), 0) || 0;
    const totalCarbs = meal?.items?.reduce((sum, item) => sum + (item.carbs || 0), 0) || 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative mb-6"
      >
        {/* Timeline connector line */}
        <div
          className="absolute left-6 top-14 w-0.5"
          style={{ height: 'calc(100% + 24px)', background: CYAN_10 }}
        />

        <div className="flex gap-4">
          {/* Icon Circle */}
          <div className="relative z-10 flex-shrink-0">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{
                borderRadius: '50%',
                background: CYAN_12,
                border: `1px solid rgba(47,232,255,0.3)`,
              }}
            >
              <Icon size={20} color={CYAN} />
            </div>
          </div>

          {/* Card Content */}
          <div
            className="flex-1 p-4 cursor-pointer group transition-all duration-300"
            style={{
              background: CARD_BG,
              clipPath: CLIP_CARD,
              border: `1px solid ${hovered ? 'rgba(47,232,255,0.5)' : CYAN_15}`,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setExpandedMeal(isExpanded ? null : mealType)}
          >
            {/* Top hover glow line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #2FE8FF, transparent)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}
                >
                  {label}
                </h3>
                <p className="text-sm" style={{ color: CYAN_45 }}>{time}</p>
              </div>
              <ChevronRight
                size={20}
                style={{
                  color: hovered ? CYAN_50 : CYAN_35,
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s, color 0.3s',
                }}
              />
            </div>

            {meal && meal.items && meal.items.length > 0 ? (
              <>
                {/* Image + Text Row */}
                <div
                  className="flex gap-4 mb-4 overflow-hidden"
                  style={{ background: CYAN_04, minHeight: '140px', clipPath: CLIP_CARD_SM }}
                >
                  {/* Left - Full Image */}
                  <div className="flex-shrink-0 w-48 h-36 overflow-hidden shadow-lg">
                    <img
                      src={
                        mealType === 'breakfast'
                          ? '/breakfast.jpg'
                          : mealType === 'lunch'
                          ? '/lunch.jpg'
                          : mealType === 'dinner'
                          ? '/dinner.jpg'
                          : 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200&h=150&fit=crop'
                      }
                      alt={label}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                  {/* Right - Text */}
                  <div className="flex flex-col justify-center py-2">
                    <p
                      className="text-lg font-semibold mb-1"
                      style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}
                    >
                      {mealType === 'breakfast' && 'Start your day right'}
                      {mealType === 'lunch' && 'Fuel your afternoon'}
                      {mealType === 'dinner' && 'End your day well'}
                      {mealType.includes('snack') && 'Quick energy boost'}
                    </p>
                    <p className="text-xs" style={{ color: CYAN_35 }}>
                      {meal.items.length} item{meal.items.length > 1 ? 's' : ''} in this meal
                    </p>
                  </div>
                </div>

                {/* Total Nutrition Info */}
                <div
                  className="flex items-center justify-between p-3"
                  style={{ background: CYAN_05, border: `1px solid ${CYAN_10}` }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs" style={{ color: CYAN_50 }}>Total Calories</p>
                      <p className="font-bold text-lg" style={{ color: CYAN }}>{totalCalories} kcal</p>
                    </div>
                    <div className="w-px h-10" style={{ background: CYAN_15 }} />
                    <div>
                      <p className="text-xs" style={{ color: CYAN_50 }}>Protein</p>
                      <p className="font-semibold" style={{ color: '#4ECDC4' }}>{totalProtein.toFixed(1)}g</p>
                    </div>
                    <div className="w-px h-10" style={{ background: CYAN_15 }} />
                    <div>
                      <p className="text-xs" style={{ color: CYAN_50 }}>Carbs</p>
                      <p className="font-semibold text-yellow-400">{totalCarbs.toFixed(1)}g</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFoodBrowser(mealType);
                    }}
                    className="p-2 transition-all duration-200 cursor-pointer"
                    style={{
                      background: 'transparent',
                      border: `1px solid ${CYAN_50}`,
                      color: CYAN,
                      clipPath: CLIP_BTN,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Expanded Menu Items */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-3"
                    style={{ borderTop: `1px solid ${CYAN_15}` }}
                  >
                    <h5
                      className="text-sm font-semibold mb-3 flex items-center gap-2"
                      style={{ color: CYAN_55 }}
                    >
                      <span>Complete {label} Menu</span>
                      <span className="text-xs" style={{ color: CYAN_35 }}>({meal.items.length} items)</span>
                    </h5>
                    {meal.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 group/item transition-all duration-200"
                        style={{ background: CYAN_04, border: `1px solid ${CYAN_08}` }}
                        onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
                        onMouseLeave={e => e.currentTarget.style.background = CYAN_04}
                      >
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: CYAN }}>{item.food}</p>
                          <p className="text-xs mb-1" style={{ color: CYAN_50 }}>{item.quantity}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-semibold" style={{ color: CYAN }}>{item.calories} kcal</span>
                            <span style={{ color: '#4ECDC4' }}>{item.protein}g protein</span>
                            <span className="text-yellow-400">{item.carbs}g carbs</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFoodFromMeal(mealType, i);
                          }}
                          className="p-2 text-red-400 hover:text-red-300 opacity-0 group-hover/item:opacity-100 transition rounded-lg hover:bg-red-500/10 cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm mb-3" style={{ color: CYAN_50 }}>No meal planned</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFoodBrowser(mealType);
                  }}
                  className="px-4 py-2 transition text-sm cursor-pointer"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${CYAN_50}`,
                    color: CYAN,
                    clipPath: CLIP_BTN,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Add Foods
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ background: '#000d1a', minHeight: '100vh', padding: '0' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #001428, #002d5c)',
              border: '1px solid rgba(47,232,255,0.3)',
              clipPath: CLIP_CARD_SM,
            }}
          >
            <Sparkles size={32} color={CYAN} />
          </div>
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}
            >
              AI Diet Plan
            </h1>
            <p style={{ color: CYAN_55 }}>Personalized nutrition plan based on your profile</p>
          </div>
        </div>
        <button
          onClick={handleGenerateClick}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 font-semibold transition disabled:opacity-50 cursor-pointer"
          style={{
            background: 'transparent',
            border: `1px solid ${CYAN_60}`,
            color: CYAN,
            clipPath: CLIP_BTN,
            fontFamily: 'Montserrat, sans-serif',
          }}
          onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Sparkles size={20} />
          {generateMutation.isPending ? 'Generating...' : 'Generate Diet Plan'}
        </button>
      </motion.div>

      {isLoading ? (
        <div
          className="p-8 text-center"
          style={{
            background: CARD_BG,
            clipPath: CLIP_CARD,
            border: `1px solid ${CYAN_15}`,
          }}
        >
          <p style={{ color: CYAN }}>Loading...</p>
        </div>
      ) : dietPlan ? (
        <>
          {/* Stats Cards */}
          <div
            className="mb-6 p-6"
            style={{
              background: CARD_BG_ALT,
              clipPath: CLIP_CARD,
              border: `1px solid ${CYAN_15}`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="text-center p-4"
                style={{ background: CYAN_05, border: `1px solid ${CYAN_10}` }}
              >
                <p className="text-sm mb-1" style={{ color: CYAN_50 }}>Daily Calories</p>
                <p className="text-3xl font-bold" style={{ color: CYAN }}>{dietPlan.dailyCalories}</p>
              </div>
              <div
                className="text-center p-4"
                style={{ background: CYAN_05, border: `1px solid ${CYAN_10}` }}
              >
                <p className="text-sm mb-1" style={{ color: CYAN_50 }}>Water Intake</p>
                <p className="text-3xl font-bold" style={{ color: CYAN }}>{dietPlan.waterIntake}</p>
              </div>
              <div
                className="text-center p-4"
                style={{ background: CYAN_05, border: `1px solid ${CYAN_10}` }}
              >
                <p className="text-sm mb-1" style={{ color: CYAN_50 }}>Status</p>
                <p className="text-3xl font-bold capitalize" style={{ color: CYAN }}>{dietPlan.status}</p>
              </div>
            </div>
          </div>

          {/* Calorie Status */}
          <div
            className="mb-6 p-6"
            style={{
              background: CARD_BG_ALT,
              clipPath: CLIP_CARD,
              border: `1px solid ${CYAN_15}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: CYAN_55 }}>Current vs Goal Calories</p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold" style={{ color: CYAN }}>{getTotalCalories()}</span>
                  <span style={{ color: CYAN_55 }}>/</span>
                  <span className="text-xl" style={{ color: CYAN }}>{dietPlan.dailyCalories}</span>
                  {getTotalCalories() > dietPlan.dailyCalories ? (
                    <AlertTriangle className="text-red-400" size={20} />
                  ) : (
                    <CheckCircle style={{ color: '#4ECDC4' }} size={20} />
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: CYAN_55 }}>Remaining</p>
                <p
                  className="text-xl font-bold"
                  style={{ color: dietPlan.dailyCalories - getTotalCalories() >= 0 ? '#4ECDC4' : '#f87171' }}
                >
                  {dietPlan.dailyCalories - getTotalCalories()} cal
                </p>
              </div>
            </div>
          </div>

          {/* Meals Timeline + Sidebar */}
          <div className="flex gap-6">
            {/* Left - Timeline */}
            <div className="flex-1 min-w-0">
              <MealCard meal={dietPlan.meals?.breakfast} title="Breakfast" mealType="breakfast" time="8:00 AM" />
              <MealCard meal={dietPlan.meals?.lunch} title="Lunch" mealType="lunch" time="1:00 PM" />
              <MealCard meal={dietPlan.meals?.dinner} title="Dinner" mealType="dinner" time="7:30 PM" />
              {dietPlan.meals?.snacks && dietPlan.meals.snacks.length > 0 && (
                <MealCard meal={dietPlan.meals.snacks[0]} title="Snacks" mealType="snack-0" time="4:30 PM" />
              )}
            </div>

            {/* Right - Sidebar */}
            <div className="w-72 flex-shrink-0 space-y-4">

              {/* Macro Breakdown */}
              {(() => {
                const meals = dietPlan.meals;
                let totalP = 0, totalC = 0, totalF = 0;
                ['breakfast','lunch','dinner'].forEach(m => {
                  meals?.[m]?.items?.forEach(item => {
                    totalP += item.protein || 0;
                    totalC += item.carbs || 0;
                    totalF += item.fats || 0;
                  });
                });
                meals?.snacks?.forEach(s => s.items?.forEach(item => {
                  totalP += item.protein || 0;
                  totalC += item.carbs || 0;
                  totalF += item.fats || 0;
                }));
                const total = totalP + totalC + totalF || 1;
                const pPct = Math.round((totalP / total) * 100);
                const cPct = Math.round((totalC / total) * 100);
                const fPct = Math.round((totalF / total) * 100);
                return (
                  <div
                    className="p-5"
                    style={{
                      background: CARD_BG,
                      clipPath: CLIP_CARD,
                      border: `1px solid ${CYAN_15}`,
                    }}
                  >
                    <h3
                      className="font-semibold mb-4 text-sm"
                      style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}
                    >
                      Macro Breakdown
                    </h3>
                    {/* Bar */}
                    <div className="flex h-3 overflow-hidden mb-4 gap-0.5" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
                      <div style={{ width: `${pPct}%`, background: '#4ECDC4' }} className="transition-all duration-700" />
                      <div style={{ width: `${cPct}%`, background: '#A89FFF' }} className="transition-all duration-700" />
                      <div style={{ width: `${fPct}%`, background: '#FFB74D' }} className="transition-all duration-700" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Protein', value: totalP.toFixed(1), pct: pPct, color: '#4ECDC4', unit: 'g' },
                        { label: 'Carbs',   value: totalC.toFixed(1), pct: cPct, color: '#A89FFF', unit: 'g' },
                        { label: 'Fats',    value: totalF.toFixed(1), pct: fPct, color: '#FFB74D', unit: 'g' },
                      ].map(({ label, value, pct, color, unit }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                              <span style={{ color: CYAN_55 }}>{label}</span>
                            </span>
                            <span className="font-semibold font-mono" style={{ color }}>
                              {value}{unit} <span style={{ color: CYAN_35 }}>({pct}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5" style={{ background: CYAN_08 }}>
                            <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Meal Timing */}
              <div
                className="p-5"
                style={{
                  background: CARD_BG,
                  clipPath: CLIP_CARD,
                  border: `1px solid ${CYAN_15}`,
                }}
              >
                <h3
                  className="font-semibold mb-4 text-sm"
                  style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}
                >
                  Meal Timing
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Breakfast', time: '8:00 AM',  icon: <Sunrise size={16} color={CYAN} />, color: CYAN },
                    { label: 'Lunch',     time: '1:00 PM',  icon: <Sun size={16} color={CYAN} />,     color: CYAN },
                    { label: 'Snacks',    time: '4:30 PM',  icon: <Apple size={16} color={CYAN} />,   color: CYAN },
                    { label: 'Dinner',    time: '7:30 PM',  icon: <MoonIcon size={16} color={CYAN} />,color: CYAN },
                  ].map(({ label, time, icon, color }, i, arr) => (
                    <div key={label} className="flex items-center gap-3 relative">
                      {/* connector */}
                      {i < arr.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-4" style={{ background: CYAN_10 }} />
                      )}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: CYAN_12, border: `1px solid rgba(47,232,255,0.3)` }}
                      >
                        {icon}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <span className="text-sm font-medium" style={{ color: CYAN_55 }}>{label}</span>
                        <span className="text-xs font-mono" style={{ color }}>{time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplements */}
              {dietPlan.supplements?.length > 0 && (
                <div
                  className="p-5"
                  style={{
                    background: CARD_BG,
                    clipPath: CLIP_CARD,
                    border: `1px solid ${CYAN_15}`,
                  }}
                >
                  <h3
                    className="font-semibold mb-3 text-sm"
                    style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}
                  >
                    Supplements
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.supplements.map((sup, i) => (
                      <li
                        key={i}
                        className="text-xs p-2"
                        style={{ background: CYAN_05, border: `1px solid ${CYAN_10}`, color: CYAN_55 }}
                      >
                        {sup}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Foods to Avoid */}
              {dietPlan.foodsToAvoid?.length > 0 && (
                <div
                  className="p-5"
                  style={{
                    background: CARD_BG,
                    clipPath: CLIP_CARD,
                    border: `1px solid ${CYAN_15}`,
                  }}
                >
                  <h3
                    className="font-semibold mb-3 text-sm"
                    style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}
                  >
                    Foods to Avoid
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.foodsToAvoid.map((food, i) => (
                      <li
                        key={i}
                        className="text-xs p-2"
                        style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF8A80' }}
                      >
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </>
      ) : (
        <div
          className="p-12 text-center"
          style={{
            background: CARD_BG_ALT,
            clipPath: CLIP_CARD,
            border: `1px solid ${CYAN_15}`,
          }}
        >
          <Sparkles size={48} style={{ color: CYAN_35, margin: '0 auto 16px' }} />
          <p className="text-xl mb-4" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>No diet plan yet</p>
          <p className="mb-6" style={{ color: CYAN_55 }}>Generate your personalized AI diet plan to get started</p>
          <button
            onClick={handleGenerateClick}
            className="px-6 py-3 font-semibold transition cursor-pointer"
            style={{
              background: 'transparent',
              border: `1px solid ${CYAN_60}`,
              color: CYAN,
              clipPath: CLIP_BTN,
              fontFamily: 'Montserrat, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Generate Diet Plan
          </button>
        </div>
      )}

      {/* Food Browser Modal */}
      {showFoodBrowser && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-4xl overflow-hidden p-6"
            style={{
              background: CARD_BG_ALT,
              clipPath: CLIP_CARD,
              border: `1px solid ${CYAN_20}`,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}
              >
                Add Food to {selectedMeal?.charAt(0).toUpperCase() + selectedMeal?.slice(1)}
              </h2>
              <button
                onClick={() => setShowFoodBrowser(false)}
                className="text-2xl cursor-pointer transition"
                style={{ color: CYAN_55, background: 'none', border: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = CYAN}
                onMouseLeave={e => e.currentTarget.style.color = CYAN_55}
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Search foods..."
                  className="flex-1 px-4 py-3 focus:outline-none"
                  style={{
                    background: CYAN_05,
                    border: `1px solid ${CYAN_20}`,
                    color: CYAN,
                    clipPath: CLIP_BTN,
                  }}
                />
                <button
                  className="px-4 py-3 cursor-pointer"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${CYAN_50}`,
                    color: CYAN,
                    clipPath: CLIP_BTN,
                  }}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Food Results */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {foods?.map((food) => (
                <div
                  key={food._id}
                  className="p-4 transition"
                  style={{ background: CYAN_04, border: `1px solid ${CYAN_10}` }}
                  onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
                  onMouseLeave={e => e.currentTarget.style.background = CYAN_04}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{food.icon || '🍽️'}</span>
                      <div>
                        <h3 className="font-semibold" style={{ color: CYAN }}>{food.name}</h3>
                        <p className="text-sm" style={{ color: CYAN_55 }}>{food.servingSize}</p>
                        <p className="text-xs" style={{ color: CYAN_45 }}>
                          {food.nutrition?.calories} cal • P:{food.nutrition?.protein}g • C:{food.nutrition?.carbs}g • F:{food.nutrition?.fats}g
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addFoodToMeal(food, selectedMeal)}
                      className="px-4 py-2 transition cursor-pointer"
                      style={{
                        background: 'transparent',
                        border: `1px solid ${CYAN_50}`,
                        color: CYAN,
                        clipPath: CLIP_BTN,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = CYAN_08}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
              {foodSearch && foods?.length === 0 && (
                <div className="text-center py-8">
                  <p style={{ color: CYAN_55 }}>No foods found</p>
                </div>
              )}
              {!foodSearch && (
                <div className="text-center py-8">
                  <p style={{ color: CYAN_55 }}>Start typing to search foods</p>
                </div>
              )}
            </div>

            {/* AI Recommendation */}
            {aiRecommendation && (
              <div
                className="mt-4 p-4"
                style={{ background: 'rgba(47,232,255,0.06)', border: `1px solid ${CYAN_20}` }}
              >
                <h4 className="font-semibold mb-2" style={{ color: '#4ECDC4' }}>AI Recommendation:</h4>
                <p className="text-sm" style={{ color: CYAN_55 }}>{aiRecommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Budget Selection Modal — Premium Design */}
      {showBudgetSelection && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}>
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'rgba(36,220,255,0.4)' : 'rgba(89,213,133,0.4)',
              pointerEvents: 'none',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}

          <div style={{
            width: '100%', maxWidth: '620px',
            background: '#1A1A2E',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(36,220,255,0.1)',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(36,220,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,213,133,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{ width: n <= 4 ? '24px' : '32px', height: '4px', borderRadius: '2px', background: n <= 4 ? 'rgba(36,220,255,0.3)' : '#4ECDC4' }} />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(232,244,248,0.4)', fontWeight: 500 }}>Step 5 of 5</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '28px', color: '#E0E0E0', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                Set Your Food Budget
              </h2>
              <p style={{ fontSize: '15px', color: '#A0A0B0', margin: 0, lineHeight: 1.6 }}>
                We'll create a diet plan that fits your lifestyle and budget.
              </p>
            </div>

            {/* Budget Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              {[
                {
                  key: 'low',
                  label: 'Low Budget',
                  range: 'Rs 200–300/day',
                  desc: 'Affordable local foods like eggs, daal, roti',
                  items: ['Eggs & Daal', 'Seasonal Veggies', 'Local Fruits', 'Roti & Rice'],
                  badge: 'Most Affordable',
                  color: '#59D585',
                  icon: '🥗',
                },
                {
                  key: 'medium',
                  label: 'Balanced Budget',
                  range: 'Rs 300–600/day',
                  desc: 'Mix of home meals and protein-rich foods',
                  items: ['Chicken & Yogurt', 'Fresh Vegetables', 'Quality Fruits', 'Dairy Products'],
                  badge: 'Best Value',
                  color: '#4ECDC4',
                  icon: '🍱',
                },
                {
                  key: 'high',
                  label: 'Premium Budget',
                  range: 'Rs 600+/day',
                  desc: 'High protein, variety, optimized nutrition',
                  items: ['Salmon & Avocado', 'Organic Foods', 'Nuts & Seeds', 'Superfoods'],
                  badge: 'Premium Quality',
                  color: '#A89FFF',
                  icon: '⭐',
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleBudgetSelection(opt.key)}
                  disabled={generateMutation.isPending}
                  style={{
                    padding: '20px 16px',
                    borderRadius: '16px',
                    background: selectedBudget === opt.key
                      ? '#25253D'
                      : '#25253D',
                    border: selectedBudget === opt.key
                      ? `1.5px solid ${opt.color}60`
                      : '1px solid rgba(108,99,255,0.1)',
                    boxShadow: selectedBudget === opt.key
                      ? `0 0 24px ${opt.color}20, 0 4px 20px rgba(108,99,255,0.15)`
                      : '0 4px 20px rgba(108,99,255,0.1)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    if (selectedBudget !== opt.key) {
                      e.currentTarget.style.borderColor = `${opt.color}40`;
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(108,99,255,0.2)`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedBudget !== opt.key) {
                      e.currentTarget.style.borderColor = 'rgba(108,99,255,0.1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,99,255,0.1)';
                    }
                  }}
                >
                  {/* Selected indicator */}
                  {selectedBudget === opt.key && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#0d1117', fontSize: '10px', fontWeight: 800 }}>✓</span>
                    </div>
                  )}

                  <div style={{ fontSize: '24px', marginBottom: '12px', color: '#4ECDC4', display: 'flex', alignItems: 'center' }}>
                    {opt.icon === 'salad' && <Salad size={28} color="#4ECDC4" />}
                    {opt.icon === 'utensils' && <UtensilsCrossed size={28} color="#4ECDC4" />}
                    {opt.icon === 'crown' && <Crown size={28} color="#4ECDC4" />}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: opt.color, marginBottom: '4px', letterSpacing: '0.02em' }}>{opt.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#E0E0E0', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>{opt.range}</div>
                  <div style={{ fontSize: '12px', color: '#808090', lineHeight: 1.5, marginBottom: '12px' }}>{opt.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {opt.items.map((item, i) => (
                      <div key={i} style={{ fontSize: '11px', color: 'rgba(232,244,248,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: opt.color, fontSize: '8px' }}>●</span> {item}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '14px', display: 'inline-block', padding: '3px 10px', borderRadius: '999px', background: `${opt.color}15`, border: `1px solid ${opt.color}30`, fontSize: '10px', fontWeight: 600, color: opt.color, letterSpacing: '0.05em' }}>
                    {opt.badge}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '12px', color: '#808090', marginBottom: '8px', fontWeight: 500 }}>Or enter your custom daily budget</div>
              <input
                type="number"
                placeholder="Enter amount in PKR"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  background: '#25253D', border: '1px solid rgba(108,99,255,0.1)',
                  color: '#E0E0E0', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(78,205,196,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Loading */}
            {generateMutation.isPending && (
              <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: '16px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#A0A0B0', fontSize: '14px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(78,205,196,0.3)', borderTopColor: '#4ECDC4', animation: 'spin 0.8s linear infinite' }} />
                  Generating your personalized diet plan...
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
              <button
                onClick={() => setShowBudgetSelection(false)}
                disabled={generateMutation.isPending}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                  cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#A0A0B0', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                ← Back
              </button>
              <button
                onClick={() => selectedBudget && handleBudgetSelection(selectedBudget)}
                disabled={generateMutation.isPending || !selectedBudget}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                  cursor: selectedBudget ? 'pointer' : 'not-allowed',
                  background: selectedBudget ? '#4ECDC4' : 'rgba(78,205,196,0.2)',
                  border: 'none', color: selectedBudget ? '#0d1117' : '#4ECDC4',
                  boxShadow: selectedBudget ? '0 0 24px rgba(78,205,196,0.35)' : 'none',
                  transition: 'all 0.2s',
                  opacity: generateMutation.isPending ? 0.6 : 1,
                }}
              >
                Continue →
              </button>
            </div>
          </div>

          <style>{`
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
            @keyframes spin { to{transform:rotate(360deg)} }
          `}</style>
        </div>
      )}
    </div>
  );
}
