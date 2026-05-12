import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronRight, Flame, Zap } from 'lucide-react';
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

export default function FoodDatabase() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFood, setExpandedFood] = useState(null);

  const { data: searchFoods } = useQuery({
    queryKey: ['foods', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await api.get(`/food/search?q=${searchQuery}`);
      return data;
    },
    enabled: !!searchQuery
  });

  const { data: allFoods = [] } = useQuery({
    queryKey: ['foods', 'all'],
    queryFn: async () => (await api.get('/food/search?q=')).data
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleAiRecommendation = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const { data } = await api.post('/food/recommend', { query: aiQuery });
      setAiResponse(data.recommendation);
    } catch {
      setAiResponse('Failed to get recommendation');
    } finally {
      setAiLoading(false);
    }
  };

  const categories = [
    { id: 'all',           name: 'All Foods',       icon: '🍽️', color: '#6C63FF' },
    { id: 'popular',       name: 'Popular',         icon: '⭐', color: '#FFB74D' },
    { id: 'low-budget',    name: 'Budget',          icon: '💰', color: '#4ECDC4' },
    { id: 'medium-budget', name: 'Mid-Range',       icon: '🥗', color: '#A89FFF' },
    { id: 'high-budget',   name: 'Premium',         icon: '💎', color: '#FF8A80' },
  ];

  const getCurrentFoods = () => {
    if (searchQuery && searchFoods) return searchFoods;
    if (selectedCategory === 'all') return allFoods;
    if (selectedCategory === 'popular') return allFoods.filter(f => f.tags?.includes('popular'));
    if (selectedCategory === 'low-budget') return allFoods.filter(f => f.budget === 'low');
    if (selectedCategory === 'medium-budget') return allFoods.filter(f => f.budget === 'medium');
    if (selectedCategory === 'high-budget') return allFoods.filter(f => f.budget === 'high');
    return allFoods;
  };

  const getBudgetStyle = (budget) => {
    if (budget === 'low')    return { bg: 'rgba(78,205,196,0.15)',  color: '#4ECDC4',  border: 'rgba(78,205,196,0.25)',  label: 'Budget', icon: '💰' };
    if (budget === 'medium') return { bg: 'rgba(168,159,255,0.15)', color: '#A89FFF',  border: 'rgba(168,159,255,0.25)', label: 'Mid',    icon: '🥗' };
    if (budget === 'high')   return { bg: 'rgba(255,138,128,0.15)', color: '#FF8A80',  border: 'rgba(255,138,128,0.25)', label: 'Premium',icon: '💎' };
    return { bg: 'rgba(255,255,255,0.06)', color: '#A0A0B0', border: 'rgba(255,255,255,0.1)', label: '', icon: '🍽️' };
  };

  const currentFoods = getCurrentFoods();

  const FoodCard = ({ food, index }) => {
    const isExpanded = expandedFood === food._id;
    const bs = getBudgetStyle(food.budget);
    const cal = food.nutrition?.calories || 0;
    const pro = food.nutrition?.protein || 0;
    const carb = food.nutrition?.carbs || 0;
    const fat = food.nutrition?.fats || 0;
    const [hov, setHov] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <div
          className="overflow-hidden cursor-pointer transition-all duration-300"
          style={{
            background: CARD,
            clipPath: CLIP,
            border: `1px solid ${isExpanded ? C50 : hov ? C20 : C15}`,
            transition: 'border-color 0.3s',
          }}
          onClick={() => setExpandedFood(isExpanded ? null : food._id)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          {/* Top glow line */}
          <div style={{ height: '2px', background: isExpanded ? `linear-gradient(90deg, transparent, ${CYAN}, transparent)` : hov ? `linear-gradient(90deg, transparent, ${C20}, transparent)` : 'transparent', transition: 'background 0.3s' }} />

          <div className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: C08, border: `1px solid ${C15}`, clipPath: CLIP_BTN }}
              >
                {food.icon || '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold truncate" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>{food.name}</h3>
                  {food.budget && (
                    <span className="px-2 py-0.5 text-xs font-semibold flex-shrink-0"
                      style={{ background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`, clipPath: CLIP_BTN }}>
                      {bs.label}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: C35 }}>{food.servingSize}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Flame size={13} color={CYAN} />
                  <span className="text-lg font-bold font-mono" style={{ color: CYAN }}>{cal}</span>
                </div>
                <p className="text-xs" style={{ color: C35 }}>kcal</p>
              </div>
              <ChevronRight size={15} style={{ color: C35, flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>

            <div className="mt-2 flex gap-4 text-xs">
              <span style={{ color: '#4ECDC4' }}>P <span className="font-semibold">{pro}g</span></span>
              <span style={{ color: '#A89FFF' }}>C <span className="font-semibold">{carb}g</span></span>
              <span style={{ color: '#FFB74D' }}>F <span className="font-semibold">{fat}g</span></span>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 space-y-3"
                  style={{ borderTop: `1px solid ${C10}` }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Protein', value: `${pro}g`, color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)' },
                      { label: 'Carbs', value: `${carb}g`, color: '#A89FFF', bg: 'rgba(168,159,255,0.08)' },
                      { label: 'Fats', value: `${fat}g`, color: '#FFB74D', bg: 'rgba(255,183,77,0.08)' },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} className="text-center p-2" style={{ background: bg, border: `1px solid ${C10}` }}>
                        <p className="text-xs font-bold" style={{ color }}>{value}</p>
                        <p className="text-xs" style={{ color: C35 }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  {food.priceRange && (
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: C05, border: `1px solid ${C10}` }}>
                      <span className="text-sm">💵</span>
                      <span className="text-xs" style={{ color: C45 }}>
                        {food.priceRange.min}–{food.priceRange.max} {food.priceRange.currency} per serving
                      </span>
                    </div>
                  )}
                  {food.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {food.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs"
                          style={{ background: C08, color: C55, border: `1px solid ${C15}`, clipPath: CLIP_BTN }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ background: '#000d1a', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #001428, #002d5c)', border: `1px solid ${C20}`, clipPath: CLIP_SM }}>
            🥗
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>Food Database</h1>
            <p style={{ color: C55 }}>Explore nutrition & get AI recommendations</p>
          </div>
        </div>
        <div className="text-right p-4" style={{ background: CARD, clipPath: CLIP_SM, border: `1px solid ${C15}` }}>
          <div className="text-2xl font-bold font-mono" style={{ color: CYAN }}>{allFoods.length}</div>
          <div className="text-xs" style={{ color: C35 }}>Total Foods</div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, i) => (
          <motion.button key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); setSearchInput(''); }}
            className="flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all cursor-pointer"
            style={selectedCategory === cat.id
              ? { background: C12, color: CYAN, border: `1px solid ${C50}`, clipPath: CLIP_BTN }
              : { background: C05, color: C45, border: `1px solid ${C15}`, clipPath: CLIP_BTN }}
            onMouseEnter={e => { if (selectedCategory !== cat.id) { e.currentTarget.style.background = C08; e.currentTarget.style.color = CYAN; } }}
            onMouseLeave={e => { if (selectedCategory !== cat.id) { e.currentTarget.style.background = C05; e.currentTarget.style.color = C45; } }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            {selectedCategory === cat.id && (
              <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: C20, color: CYAN, clipPath: CLIP_BTN }}>
                {getCurrentFoods().length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left - Food List */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-5">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C35 }} />
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search foods by name..."
                  className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
                  style={{ background: C05, border: `1px solid ${C20}`, color: CYAN, clipPath: CLIP_BTN }} />
              </div>
              <button type="submit"
                className="px-5 py-3 transition cursor-pointer flex items-center gap-2"
                style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                onMouseEnter={e => e.currentTarget.style.background = C08}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Search size={18} />
              </button>
            </div>
          </form>

          <p className="text-xs mb-4 flex items-center gap-2" style={{ color: C35 }}>
            <Zap size={12} color={CYAN} />
            {currentFoods.length} food{currentFoods.length !== 1 ? 's' : ''} {searchQuery ? `for "${searchQuery}"` : `in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>

          {currentFoods.length > 0
            ? <div className="grid grid-cols-2 gap-3">
                {currentFoods.map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
              </div>
            : (
              <div className="text-center py-20 relative" style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
                <span className="text-5xl block mb-3">🔍</span>
                <p className="font-semibold mb-1" style={{ color: CYAN }}>No foods found</p>
                <p className="text-sm" style={{ color: C35 }}>Try a different search or category</p>
              </div>
            )
          }
        </div>

        {/* Right - Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">

          {/* AI Assistant */}
          <div className="relative overflow-hidden" style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: C12, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}>
                  <Sparkles size={18} color={CYAN} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>AI Food Assistant</h3>
                  <p className="text-xs" style={{ color: C35 }}>Powered by AI</p>
                </div>
              </div>
              <form onSubmit={handleAiRecommendation}>
                <textarea value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                  placeholder="Ask: 'Low-carb options' or 'High protein foods'..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm focus:outline-none mb-3 resize-none"
                  style={{ background: C05, border: `1px solid ${C20}`, color: CYAN, clipPath: CLIP_SM }} />
                <button type="submit" disabled={aiLoading}
                  className="w-full py-2.5 text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
                  onMouseEnter={e => e.currentTarget.style.background = C08}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {aiLoading ? (
                    <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${C20}`, borderTopColor: CYAN }} /> Getting...</>
                  ) : (
                    <><Sparkles size={14} /> Get Recommendations</>
                  )}
                </button>
              </form>
              {aiResponse ? (
                <div className="mt-3 p-3 text-xs leading-relaxed" style={{ background: C05, color: C55, border: `1px solid ${C15}` }}>
                  {aiResponse}
                </div>
              ) : (
                <div className="mt-3 p-3" style={{ background: C05, border: `1px solid ${C10}` }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: CYAN }}>Try asking:</p>
                  {['Low calorie foods', 'Compare eggs vs chicken', 'High fiber options', 'Best breakfast foods'].map(q => (
                    <button key={q} onClick={() => setAiQuery(q)}
                      className="block text-xs text-left w-full py-0.5 transition cursor-pointer"
                      style={{ color: C35 }}
                      onMouseEnter={e => e.currentTarget.style.color = CYAN}
                      onMouseLeave={e => e.currentTarget.style.color = C35}>
                      • {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Macro Legend */}
          <div className="p-5 relative" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
            <h3 className="font-semibold mb-4 text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Macro Colors</h3>
            <div className="flex h-2 overflow-hidden mb-3 gap-0.5">
              <div className="flex-1" style={{ background: '#4ECDC4' }} />
              <div className="flex-1" style={{ background: '#A89FFF' }} />
              <div className="flex-1" style={{ background: '#FFB74D' }} />
            </div>
            {[{ label: 'Protein', color: '#4ECDC4' }, { label: 'Carbs', color: '#A89FFF' }, { label: 'Fats', color: '#FFB74D' }].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs" style={{ color: C45 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Budget Guide */}
          <div className="p-5 relative" style={{ background: CARD2, clipPath: CLIP, border: `1px solid ${C15}` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
            <h3 className="font-semibold mb-4 text-sm" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Budget Guide</h3>
            {[
              { icon: '💰', label: 'Budget', sub: 'Under 50 PKR', color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)' },
              { icon: '🥗', label: 'Mid-Range', sub: '50–150 PKR', color: '#A89FFF', bg: 'rgba(168,159,255,0.08)' },
              { icon: '💎', label: 'Premium', sub: 'Above 150 PKR', color: '#FF8A80', bg: 'rgba(255,138,128,0.08)' },
            ].map(({ icon, label, sub, color, bg }) => (
              <div key={label} className="flex items-center gap-3 p-2.5 mb-2" style={{ background: bg, border: `1px solid ${C10}` }}>
                <span className="text-lg">{icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color }}>{label}</p>
                  <p className="text-xs" style={{ color: C35 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
