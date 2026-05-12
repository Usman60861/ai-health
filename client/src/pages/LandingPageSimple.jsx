import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, UserPlus, Brain, TrendingUp, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Zap, Target, Activity, Apple, Dumbbell, Heart, ChevronRight, Star, CheckCircle } from 'lucide-react';

// ── Stat Counter ─────────────────────────────────────────────────────────────
function StatCounter({ value, label, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        textAlign: 'center', padding: '32px 24px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: `3px solid ${color}`,
        borderRadius: '4px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ color, fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#fff', lineHeight: 1, letterSpacing: '2px' }}>{value}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: 600 }}>{label}</div>
    </motion.div>
  );
}

// ── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 28px',
        background: hovered ? `rgba(${color === '#39D353' ? '57,211,83' : color === '#FF6B35' ? '255,107,53' : color === '#00D4FF' ? '0,212,255' : '168,85,247'},0.06)` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? color + '50' : 'rgba(255,255,255,0.07)'}`,
        borderTop: `3px solid ${hovered ? color : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px', color,
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({ step, icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', padding: '40px 32px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? color + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '4px', transition: 'all 0.3s ease', cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Ghost step number */}
      <div style={{
        position: 'absolute', top: '-10px', right: '20px',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: '7rem',
        color: 'transparent', WebkitTextStroke: `1px ${color}18`,
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>{step}</div>

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: hovered ? `linear-gradient(90deg, ${color}, transparent)` : 'transparent',
        transition: 'background 0.3s ease',
      }} />

      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', color, fontSize: '1.4rem',
      }}>{icon}</div>

      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color, marginBottom: '8px', fontWeight: 700 }}>Step {step}</div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '1px', color: '#fff', marginBottom: '12px', textTransform: 'uppercase' }}>{title}</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ name, role, text, result, avatar, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={{
        padding: '32px', background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px',
        position: 'relative',
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FF6B35" color="#FF6B35" />)}
      </div>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '24px' }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #39D353, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: '#0a0a0a' }}>{avatar}</div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', letterSpacing: '0.5px' }}>{name}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 300 }}>{role}</div>
          </div>
        </div>
        <div style={{ padding: '4px 12px', background: 'rgba(57,211,83,0.1)', border: '1px solid rgba(57,211,83,0.3)', borderRadius: '20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', letterSpacing: '1px', color: '#39D353', fontWeight: 700 }}>{result}</div>
      </div>
    </motion.div>
  );
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
function Card3DTilt({ children, color, style = {} }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    card.style.boxShadow = 'none';
  }, [color]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.boxShadow = 'none';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: '16px',
        backgroundColor: '#0d1520',
        border: '1px solid rgba(78,205,196,0.35)',
        boxShadow: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        overflow: 'hidden',
        cursor: 'default',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}


// ── Program Card (How It Works) ──────────────────────────────────────────────
function ProgramCard({ card, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: '480px',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
        cursor: 'default',
      }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: card.bg,
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.5s ease',
      }} />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%)',
      }} />

      {/* Cyan top border glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: hovered ? `linear-gradient(90deg, transparent, ${card.accent}, transparent)` : 'transparent',
        transition: 'background 0.4s ease',
      }} />

      {/* 3D Icon — top right */}
      <div style={{
        position: 'absolute', top: '28px', right: '28px',
        width: '60px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: card.accent,
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s',
      }}>
        {card.icon}
      </div>

      {/* Step number — large ghost */}
      <div style={{
        position: 'absolute', top: '20px', left: '28px',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '5rem', color: 'transparent',
        WebkitTextStroke: `1px ${card.accent}30`,
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>
        {card.step}
      </div>

      {/* Body — slides up on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '36px 28px',
        transform: hovered ? 'translateY(0)' : 'translateY(60px)',
        transition: 'transform 0.4s ease',
      }}>
        {/* Level tag */}
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '0.7rem', letterSpacing: '4px',
          textTransform: 'uppercase', color: card.accent,
          marginBottom: '8px', fontWeight: 700,
        }}>
          {card.level}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem', letterSpacing: '2px',
          color: '#FFFFFF', marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          {card.name}
        </div>

        {/* Desc — fades in on hover */}
        <p style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: '0.85rem', fontWeight: 300,
          color: '#7AAFCC', lineHeight: 1.7,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease 0.1s',
          margin: 0,
        }}>
          {card.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingPageSimple() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  return (
    <div style={{ background: '#0a0a0a', position: 'relative', fontFamily: "'Barlow', sans-serif" }}>

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #39D353; border-radius: 2px; }
        @keyframes pulse-green { 0%,100% { box-shadow: 0 0 0 0 rgba(57,211,83,0.4); } 50% { box-shadow: 0 0 0 12px rgba(57,211,83,0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes heartbeat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.15); } 28% { transform: scale(1); } 42% { transform: scale(1.1); } 70% { transform: scale(1); } }
      `}</style>

      {/* ── AMBIENT GLOWS ── */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(57,211,83,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '30%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '30%', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(57,211,83,0.15)',
      }}>
        <nav style={{
          maxWidth: '1300px', margin: '0 auto', padding: '0 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '68px',
        }}>
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #39D353, #00D4FF)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'heartbeat 2s ease-in-out infinite' }}>
              <Heart size={16} fill="#0a0a0a" color="#0a0a0a" />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#fff', letterSpacing: '3px' }}>
              NUTRI<span style={{ color: '#39D353' }}>AI</span>
            </span>
          </motion.div>

          {/* Nav links */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {['Features', 'How It Works', 'Results', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#39D353'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >{item}</a>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '4px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >Log In</button>
            <button onClick={() => navigate('/signup')} style={{ padding: '9px 24px', background: '#39D353', border: 'none', color: '#0a0a0a', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '4px', transition: 'all 0.2s', animation: 'pulse-green 2.5s infinite' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4de866'}
              onMouseLeave={e => e.currentTarget.style.background = '#39D353'}
            >Start Free</button>
          </motion.div>
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <section id="hero" ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#0a0a0a' }}>

        {/* Background video */}
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.25 }}>
          <source src="/animation.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.4) 100%)' }} />

        {/* Green bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', zIndex: 2, background: 'linear-gradient(to top, #0a0a0a, transparent)', pointerEvents: 'none' }} />

        {/* Floating particles */}
        {Array.from({ length: 40 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const color = i % 3 === 0 ? '#39D353' : i % 3 === 1 ? '#FF6B35' : '#00D4FF';
          return (
            <motion.div key={i} style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: color, boxShadow: `0 0 ${size * 4}px ${color}`, pointerEvents: 'none', zIndex: 3 }}
              animate={{ y: [0, -(40 + Math.random() * 60), 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1300px', margin: '0 auto', padding: '0 48px', width: '100%', display: 'flex', alignItems: 'center', gap: '80px' }}>

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }} style={{ flex: 1, maxWidth: '620px' }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(57,211,83,0.08)', border: '1px solid rgba(57,211,83,0.25)', borderRadius: '20px', marginBottom: '28px' }}>
              <motion.span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39D353', display: 'inline-block' }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#39D353' }}>AI-Powered Health Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 7vw, 88px)', lineHeight: 0.92, letterSpacing: '2px', color: '#fff', margin: '0 0 24px', textTransform: 'uppercase' }}>
              Your Body.<br />
              Your Goals.<br />
              <span style={{ color: '#39D353', WebkitTextStroke: '0px', textShadow: '0 0 40px rgba(57,211,83,0.4)' }}>AI-Powered</span><br />
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>Results.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }}
              style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', margin: '0 0 36px', maxWidth: '460px', fontWeight: 300 }}>
              Get a personalized diet plan, custom workout routine, and 24/7 AI health coach — all built around your unique body, goals, and lifestyle.
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <motion.button onClick={() => navigate('/signup')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 36px', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', background: '#39D353', color: '#0a0a0a', borderRadius: '4px' }}>
                Start For Free <ArrowRight size={16} />
              </motion.button>
              <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 36px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <Play size={16} /> See Demo
              </motion.button>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex' }}>
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: `hsl(${i * 40 + 120}, 60%, 50%)`, border: '2px solid #0a0a0a', marginLeft: i > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.7rem', color: '#0a0a0a' }}>{l}</div>
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>50,000+ active users</span>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#FF6B35" color="#FF6B35" />)}
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginLeft: '6px', fontWeight: 300 }}>4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — floating stats cards */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.4 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '340px' }}>

            {/* Calories card */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ padding: '24px', background: 'rgba(57,211,83,0.06)', border: '1px solid rgba(57,211,83,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(57,211,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39D353' }}><Apple size={20} /></div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Today's Calories</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#39D353', lineHeight: 1 }}>1,840 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>/ 2,100</span></div>
                </div>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #39D353, #00D4FF)', borderRadius: '3px' }} />
              </div>
            </motion.div>

            {/* Workout card */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ padding: '24px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35' }}><Dumbbell size={20} /></div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Today's Workout</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: '#FF6B35', lineHeight: 1 }}>Upper Body · 45 min</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Push-ups', 'Pull-ups', 'Bench Press'].map((ex, i) => (
                  <div key={i} style={{ padding: '4px 10px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: '20px', fontSize: '0.65rem', color: '#FF6B35', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.5px', fontWeight: 600 }}>{ex}</div>
                ))}
              </div>
            </motion.div>

            {/* Weight trend card */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{ padding: '24px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00D4FF' }}><TrendingUp size={20} /></div>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Weight Progress</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#00D4FF', lineHeight: 1 }}>-4.2 kg</div>
                  </div>
                </div>
                <div style={{ padding: '4px 10px', background: 'rgba(57,211,83,0.1)', border: '1px solid rgba(57,211,83,0.25)', borderRadius: '20px', fontSize: '0.7rem', color: '#39D353', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>↓ On Track</div>
              </div>
              {/* Mini sparkline */}
              <svg width="100%" height="36" viewBox="0 0 200 36">
                <defs><linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00D4FF" /><stop offset="100%" stopColor="#39D353" /></linearGradient></defs>
                <polyline points="0,30 30,26 60,28 90,20 120,18 150,12 180,8 200,6" fill="none" stroke="url(#sparkGrad)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="200" cy="6" r="3" fill="#39D353" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>
        {/* Top border — solid teal with glow */}
        <div style={{ height: '0px' }} />

      {/* wrapper: 16:9 aspect ratio to match video exactly */}
      <div id="hero" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', minHeight: '600px' }}>

        {/* Video — fills the full hero perfectly */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            zIndex: 0,
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
          }}
        >
          <source src="/animation.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
          background: 'linear-gradient(100deg, rgba(11,15,20,0.97) 0%, rgba(11,15,20,0.9) 28%, rgba(11,15,20,0.55) 52%, rgba(11,15,20,0.15) 78%, rgba(11,15,20,0.05) 100%)',
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', zIndex: 2,
          background: 'linear-gradient(to top, #0B0F14, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Particles */}
        {Array.from({ length: 60 }).map((_, i) => {
          const size  = Math.random() * 3 + 1;
          const left  = Math.random() * 100;
          const top   = Math.random() * 100;
          const color = i % 3 === 0 ? '#24DCFF' : i % 3 === 1 ? '#6C63FF' : '#4ECDC4';
          return (
            <motion.div key={i} style={{
              position: 'absolute', left: `${left}%`, top: `${top}%`,
              width: `${size}px`, height: `${size}px`, borderRadius: '50%',
              background: color, boxShadow: `0 0 ${size * 5}px ${color}`,
              pointerEvents: 'none', zIndex: 3,
            }}
              animate={{ y: [0, -(50 + Math.random() * 80), 0], opacity: [0, 0.9, 0], scale: [0.5, 1.4, 0.5] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Text overlay — vertically centered */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10, display: 'flex', alignItems: 'center', paddingTop: '80px',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ marginLeft: '3vw', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '7px 18px', fontSize: '11px', fontWeight: 700,
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '4px', textTransform: 'uppercase',
                background: 'rgba(47,232,255,0.06)', border: '1px solid rgba(47,232,255,0.3)',
                color: '#2FE8FF', width: 'fit-content',
              }}>
              <motion.span
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2FE8FF', display: 'inline-block' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              AI-Powered Health Platform
            </motion.div>

            {/* Heading */}
            <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 0.95, letterSpacing: '3px', color: '#E8F4F8', margin: 0, textTransform: 'uppercase' }}>
              Transform<br />Your Health<br />with <span style={{ color: '#2FE8FF' }}>AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }}
              style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(232,244,248,0.6)', margin: 0, maxWidth: '400px' }}>
              FitPulse combines artificial intelligence with personalized nutrition
              and fitness insights to help you achieve your health goals faster and smarter.
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

              {/* Primary CTA */}
              <motion.button
                onClick={() => navigate('/signup')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '15px 36px', border: 'none', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: '1rem', letterSpacing: '3px',
                  textTransform: 'uppercase',
                  background: '#2FE8FF', color: '#001935',
                  position: 'relative', overflow: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  style={{
                    position: 'absolute', top: 0, left: '-100%',
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    pointerEvents: 'none',
                  }}
                  whileHover={{ left: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                Get Started <ArrowRight size={16} />
              </motion.button>

              {/* Secondary */}
              <motion.button
                onClick={() => navigate('/login')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '15px 36px', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: '1rem', letterSpacing: '3px',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  border: '1px solid rgba(47,232,255,0.4)',
                  color: '#2FE8FF',
                  position: 'relative', overflow: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}
                whileHover={{ scale: 1.03, borderColor: '#2FE8FF', background: 'rgba(47,232,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
              >
                <Play size={16} /> Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
        {/* Bottom border */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #4ECDC4, transparent)' }} />
      </div>

      <ProblemsSection onCTAClick={() => navigate('/signup')} />

      {/* ── SOLUTION SECTION ── */}
      <section style={{
        background: '#001935',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top cyan line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #2FE8FF, transparent)',
        }} />

        {/* Ghost watermark */}
        <div style={{
          position: 'absolute', top: '40px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(60px, 10vw, 130px)',
          fontWeight: 900, color: 'transparent',
          WebkitTextStroke: '1px #002a4a',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 0, letterSpacing: '8px', userSelect: 'none',
        }}>THE SOLUTION</div>

        {/* Cyan glow blob */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(47,232,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          maxWidth: '1300px', margin: '0 auto',
          padding: '100px 60px',
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: '60px', flexWrap: 'wrap',
        }}>

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ flex: 1, minWidth: '300px' }}
          >
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.75rem', letterSpacing: '5px',
              textTransform: 'uppercase', color: '#2FE8FF',
              marginBottom: '16px', fontWeight: 700,
            }}>
              The Solution
            </div>

            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 0.95, letterSpacing: '2px',
              color: '#FFFFFF', margin: '0 0 24px',
              textTransform: 'uppercase',
            }}>
              FitPulse Solves<br />
              All of This —{' '}
              <span style={{ color: '#2FE8FF' }}>Instantly</span>
            </h2>

            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.95rem', fontWeight: 300,
              color: '#7AAFCC', lineHeight: 1.8,
              maxWidth: '480px', marginBottom: '40px',
            }}>
              Get a fully personalized plan in seconds, automatic progress tracking, and expert-level guidance — all for a fraction of a personal coach's cost.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { num: '3×', label: 'Better Results' },
                { num: '2min', label: 'Setup Time' },
                { num: '90%', label: 'Cost Savings' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2.5rem', color: '#2FE8FF',
                    letterSpacing: '2px', lineHeight: 1,
                  }}>{s.num}</div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '0.7rem', letterSpacing: '3px',
                    textTransform: 'uppercase', color: '#7AAFCC',
                    fontWeight: 600, marginTop: '4px',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <motion.button
                onClick={() => navigate('/signup')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '16px 40px', border: 'none', cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: '1rem',
                  letterSpacing: '3px', textTransform: 'uppercase',
                  background: '#2FE8FF', color: '#001935',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Fix It Now <ArrowRight size={16} />
              </motion.button>
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.8rem', color: '#3a5a70', fontWeight: 300,
              }}>No credit card required</span>
            </div>
          </motion.div>

          {/* Right — feature list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ flex: 1, minWidth: '280px', maxWidth: '480px' }}
          >
            {[
              { title: 'Personalized AI Plan', desc: 'Built around your body, goals, and schedule in seconds.' },
              { title: 'Real-Time Tracking', desc: 'See your progress with live analytics and visual charts.' },
              { title: 'Expert Guidance', desc: 'AI-powered advice that rivals a $300/month personal coach.' },
              { title: 'Food & Workout Database', desc: 'Thousands of foods and exercises at your fingertips.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                style={{
                  display: 'flex', gap: '20px', alignItems: 'flex-start',
                  padding: '24px 0',
                  borderBottom: i < 3 ? '1px solid #002a4a' : 'none',
                }}
              >
                {/* Number */}
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.8rem', color: '#2FE8FF',
                  lineHeight: 1, flexShrink: 0, width: '36px',
                  opacity: 0.7,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem', fontWeight: 700,
                    letterSpacing: '1px', textTransform: 'uppercase',
                    color: '#FFFFFF', marginBottom: '6px',
                  }}>{item.title}</div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.85rem', fontWeight: 300,
                    color: '#7AAFCC', lineHeight: 1.7,
                  }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: '#000d1a', padding: '140px 60px', position: 'relative', overflow: 'hidden' }}>

        {/* Ghost watermark */}
        <div style={{
          position: 'absolute', top: '60px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(80px, 12vw, 160px)',
          fontWeight: 900, color: 'transparent',
          WebkitTextStroke: '1px #002a4a',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 0, letterSpacing: '8px', userSelect: 'none',
        }}>HOW IT WORKS</div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.75rem', letterSpacing: '5px',
              textTransform: 'uppercase', color: '#2FE8FF',
              marginBottom: '16px', fontWeight: 700,
            }}>
              3 Simple Steps
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: 400, fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: 1, letterSpacing: '2px',
              color: '#FFFFFF', margin: '0 0 16px', textTransform: 'uppercase',
            }}>
              How It <span style={{ color: '#2FE8FF' }}>Works</span>
            </h2>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.95rem', fontWeight: 300,
              color: '#7AAFCC', maxWidth: '440px',
              margin: '0 auto', lineHeight: 1.8,
            }}>
              From signup to results in minutes. Our AI handles everything.
            </p>
          </motion.div>

          {/* Program Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '20px',
          }}>
            {[
              {
                step: '01',
                level: 'Step One',
                name: 'Create Your Profile',
                desc: 'Enter your body metrics, fitness goals, dietary preferences, and activity level. Takes 2 minutes.',
                bg: 'linear-gradient(160deg, #001935 0%, #002a4a 50%, #003d6b 100%)',
                accent: '#2FE8FF',
                icon: <UserPlus size={28} />,
              },
              {
                step: '02',
                level: 'Step Two',
                name: 'AI Builds Your Plan',
                desc: 'Our AI instantly generates a fully personalized diet plan and workout routine tailored just for you.',
                bg: 'linear-gradient(160deg, #001428 0%, #001f3d 50%, #002d5c 100%)',
                accent: '#2FE8FF',
                icon: <Brain size={28} />,
              },
              {
                step: '03',
                level: 'Step Three',
                name: 'Track & Improve',
                desc: 'Log meals, complete workouts, and watch your progress with real-time analytics and insights.',
                bg: 'linear-gradient(160deg, #001020 0%, #001a35 50%, #00264d 100%)',
                accent: '#2FE8FF',
                icon: <TrendingUp size={28} />,
              },
            ].map((card, i) => (
              <ProgramCard key={i} card={card} index={i} />
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '64px' }}>
            <motion.button
              onClick={() => navigate('/signup')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 48px', border: 'none', cursor: 'pointer',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: '1rem',
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#2FE8FF', color: '#001935',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Journey Today <ArrowRight size={18} />
            </motion.button>
          </motion.div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" style={{ background: '#000d1a', position: 'relative', overflow: 'hidden' }}>

        {/* Top cyan line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #2FE8FF, transparent)',
        }} />

        {/* Ghost FITPULSE watermark */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(60px, 10vw, 130px)',
          fontWeight: 900, color: 'transparent',
          WebkitTextStroke: '1px #002a4a',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 0, letterSpacing: '8px', userSelect: 'none',
        }}>FITPULSE</div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '80px 60px 0', position: 'relative', zIndex: 1 }}>

          {/* Top Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', paddingBottom: '60px', borderBottom: '1px solid #002a4a' }}>

            {/* Brand */}
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '36px', color: '#E8F4F8', marginBottom: '16px', letterSpacing: '4px' }}>
                FIT<span style={{ color: '#2FE8FF' }}>PULSE</span>
              </div>
              <p style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.9rem', fontWeight: 300,
                lineHeight: 1.8, color: '#7AAFCC',
                maxWidth: '280px', margin: '0 0 28px',
              }}>
                AI-powered nutrition and fitness platform helping you achieve your health goals faster and smarter.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
                {[
                  { icon: <Instagram size={16} />, href: '#' },
                  { icon: <Twitter size={16} />, href: '#' },
                  { icon: <Youtube size={16} />, href: '#' },
                ].map((s, i) => (
                  <a key={i} href={s.href} style={{
                    width: '38px', height: '38px',
                    background: '#001935',
                    border: '1px solid #002a4a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#7AAFCC', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(47,232,255,0.1)'; e.currentTarget.style.color = '#2FE8FF'; e.currentTarget.style.borderColor = 'rgba(47,232,255,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#001935'; e.currentTarget.style.color = '#7AAFCC'; e.currentTarget.style.borderColor = '#002a4a'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.7rem', letterSpacing: '4px',
                  textTransform: 'uppercase', color: '#2FE8FF',
                  marginBottom: '12px', fontWeight: 700,
                }}>Stay Updated</div>
                <div style={{ display: 'flex', gap: '0' }}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    style={{
                      flex: 1, padding: '11px 16px', fontSize: '13px',
                      background: '#001935', border: '1px solid #002a4a',
                      borderRight: 'none',
                      color: '#E8F4F8', outline: 'none',
                      fontFamily: "'Barlow', sans-serif",
                    }}
                  />
                  <button style={{
                    padding: '11px 16px', border: 'none', cursor: 'pointer',
                    background: '#2FE8FF', color: '#001935',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.7rem', letterSpacing: '4px',
                textTransform: 'uppercase', color: '#2FE8FF',
                marginBottom: '24px', fontWeight: 700,
              }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['AI Diet Plans', 'Workout Plans', 'Food Database', 'Progress Tracking', 'Chat Assistant', 'Pricing'].map(item => (
                  <a key={item} href="#" style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.9rem', fontWeight: 300,
                    color: '#7AAFCC', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2FE8FF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7AAFCC'}
                  >{item}</a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.7rem', letterSpacing: '4px',
                textTransform: 'uppercase', color: '#2FE8FF',
                marginBottom: '24px', fontWeight: 700,
              }}>Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['About Us', 'Blog', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'].map(item => (
                  <a key={item} href="#" style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.9rem', fontWeight: 300,
                    color: '#7AAFCC', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2FE8FF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7AAFCC'}
                  >{item}</a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.7rem', letterSpacing: '4px',
                textTransform: 'uppercase', color: '#2FE8FF',
                marginBottom: '24px', fontWeight: 700,
              }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: <Mail size={14} />, text: 'support@fitpulse.com' },
                  { icon: <Phone size={14} />, text: '+1 (800) 123-4567' },
                  { icon: <MapPin size={14} />, text: 'San Francisco, CA' },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontFamily: "'Barlow', sans-serif",
                    color: '#7AAFCC', fontSize: '0.9rem', fontWeight: 300,
                  }}>
                    <span style={{ color: '#2FE8FF', flexShrink: 0 }}>{c.icon}</span>
                    {c.text}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { num: '50K+', label: 'Active Users' },
                  { num: '4.9★', label: 'App Rating' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.4rem', color: '#2FE8FF',
                      letterSpacing: '1px', lineHeight: 1,
                    }}>{s.num}</div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '0.7rem', letterSpacing: '3px',
                      textTransform: 'uppercase', color: '#3a5a70',
                      fontWeight: 600,
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{
            padding: '24px 0 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 1,
          }}>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.8rem', fontWeight: 300,
              color: '#3a5a70', margin: 0,
            }}>
              © 2026 FitPulse. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '28px' }}>
              {['Privacy', 'Terms', 'Cookies'].map(item => (
                <a key={item} href="#" style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.75rem', letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#3a5a70', textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2FE8FF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3a5a70'}
                >{item}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
