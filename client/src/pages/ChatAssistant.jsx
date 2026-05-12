import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react';
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

const SUGGESTIONS = [
  'What foods are high in protein?',
  'How many calories should I eat daily?',
  'Best foods for weight loss?',
  'What is a balanced diet?',
  'Foods to avoid for better sleep?',
  'How to increase energy levels?',
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI health assistant. Ask me anything about nutrition, diet, fitness, or health!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMessage = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="max-w-4xl mx-auto" style={{ background: '#000d1a', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #001428, #002d5c)', border: `1px solid ${C20}`, clipPath: CLIP_SM }}
          >
            <Bot size={32} color={CYAN} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: CYAN }}>AI Health Assistant</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#4CAF50', boxShadow: '0 0 6px #4CAF50' }} />
              <p style={{ color: C55, fontSize: '0.85rem' }}>Online • 24/7 personalized health guidance</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: C08, border: `1px solid ${C15}`, clipPath: CLIP_BTN }}>
          <Sparkles size={14} color={CYAN} />
          <span className="text-sm font-semibold" style={{ color: CYAN }}>AI Powered</span>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div
        className="relative flex flex-col"
        style={{ background: CARD, clipPath: CLIP, border: `1px solid ${C15}`, height: '620px' }}
      >
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${C20} transparent` }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: C12, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
                  >
                    <Bot size={16} color={CYAN} />
                  </div>
                )}
                <div
                  className="max-w-[78%] px-4 py-3"
                  style={msg.role === 'user'
                    ? { background: C12, border: `1px solid ${C20}`, clipPath: CLIP_BTN, color: CYAN }
                    : { background: C05, border: `1px solid ${C10}`, clipPath: CLIP_SM, color: C55 }
                  }
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: C12, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
                  >
                    <User size={16} color={CYAN} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: C12, border: `1px solid ${C20}`, clipPath: CLIP_BTN }}
              >
                <Bot size={16} color={CYAN} />
              </div>
              <div className="px-4 py-3" style={{ background: C05, border: `1px solid ${C10}`, clipPath: CLIP_SM }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 150, 300].map(delay => (
                    <motion.div
                      key={delay}
                      className="w-2 h-2 rounded-full"
                      style={{ background: CYAN }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: delay / 1000 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (only show when few messages) */}
        {messages.length <= 2 && !loading && (
          <div className="px-6 pb-3">
            <p className="text-xs mb-2" style={{ color: C35, letterSpacing: '1px', textTransform: 'uppercase' }}>Quick questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs px-3 py-1.5 transition cursor-pointer"
                  style={{ background: C05, border: `1px solid ${C15}`, color: C55, clipPath: CLIP_BTN }}
                  onMouseEnter={e => { e.currentTarget.style.background = C08; e.currentTarget.style.color = CYAN; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C05; e.currentTarget.style.color = C55; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4" style={{ borderTop: `1px solid ${C10}` }}>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about health, nutrition, fitness..."
                disabled={loading}
                className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                style={{ background: C05, border: `1px solid ${input ? C20 : C10}`, color: CYAN, clipPath: CLIP_BTN }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 transition disabled:opacity-40 cursor-pointer flex items-center gap-2"
              style={{ background: 'transparent', border: `1px solid ${C50}`, color: CYAN, clipPath: CLIP_BTN }}
              onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = C08; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {loading ? <Zap size={18} color={CYAN} /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>

      {/* Info cards below */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { icon: '🥗', title: 'Nutrition', desc: 'Get personalized diet advice' },
          { icon: '💪', title: 'Fitness', desc: 'Workout tips & guidance' },
          { icon: '🧠', title: 'Wellness', desc: 'Mental & physical health' },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="p-4 text-center"
            style={{ background: CARD2, clipPath: CLIP_SM, border: `1px solid ${C10}` }}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-semibold text-sm mb-1" style={{ color: CYAN, fontFamily: 'Montserrat, sans-serif' }}>{title}</p>
            <p className="text-xs" style={{ color: C35 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
