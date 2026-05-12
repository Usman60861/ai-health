import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserX, TrendingDown, Utensils, Clock, BadgeDollarSign, ShieldAlert, ArrowRight } from 'lucide-react';

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ target, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const dur = 2000;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ── Feature Card — matches the CSS you provided ───────────────────────────────
function FeatureCard({ item, index, FIRE, ASH, CHROME }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#222226' : ASH,
        padding: '50px 40px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        borderTop: hovered ? `2px solid ${FIRE}` : '2px solid transparent',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Subtle fire overlay on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,69,32,0.05), transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s',
        pointerEvents: 'none',
      }} />

      {/* Ghost number — top right */}
      <div style={{
        position: 'absolute', top: '40px', right: '40px',
        fontFamily: "'Bebas Neue', 'Montserrat', sans-serif",
        fontSize: '4rem', color: hovered ? '#2A2A2A' : '#222',
        lineHeight: 1, transition: 'color 0.4s',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div style={{
        width: '60px', height: '60px',
        marginBottom: '28px', position: 'relative',
        color: hovered ? FIRE : '#888',
        transition: 'color 0.3s',
      }}>
        {item.icon}
      </div>

      {/* Section tag */}
      <div style={{
        fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
        fontSize: '0.75rem', letterSpacing: '5px',
        textTransform: 'uppercase',
        color: FIRE,
        marginBottom: '12px', fontWeight: 700,
      }}>
        {item.tag}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
        fontSize: '1.4rem', fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase',
        marginBottom: '16px', color: '#FFFFFF',
      }}>
        {item.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.9rem', fontWeight: 300,
        color: CHROME, lineHeight: 1.8, marginBottom: '24px',
      }}>
        {item.desc}
      </p>

      {/* Stat */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 14px',
        background: '#000d1a',
        border: `1px solid ${hovered ? FIRE : '#0a2a40'}`,
        transition: 'border-color 0.3s',
      }}>
        <span style={{
          fontSize: '1.2rem', fontWeight: 900,
          color: hovered ? FIRE : '#fff',
          fontFamily: "'Bebas Neue', 'Montserrat', sans-serif",
          letterSpacing: '1px',
          transition: 'color 0.3s',
        }}>
          {item.stat !== null
            ? <Counter target={item.stat} suffix={item.suffix} />
            : item.display}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 300 }}>
          {item.label}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ProblemsSection({ onCTAClick }) {
  const navigate = useNavigate();
  const handleCTA = onCTAClick ?? (() => navigate('/signup'));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const FIRE = '#2FE8FF';
  const ASH = '#18181C';
  const CHROME = '#7AAFCC';

  const problems = [
    {
      icon: <UserX size={36} />,
      tag: '#1 Root Cause',
      title: 'No Personalized Plan',
      desc: "Generic plans don't know your body, schedule, or goals. What works for someone else may not work for you.",
      stat: 73, suffix: '%', label: 'quit in 2 weeks',
    },
    {
      icon: <TrendingDown size={36} />,
      tag: '#2 Progress Killer',
      title: 'No Progress Tracking',
      desc: "Without data, you're flying blind. Most people give up because they see no visible results.",
      stat: 80, suffix: '%', label: 'fail without tracking',
    },
    {
      icon: <ShieldAlert size={36} />,
      tag: '#3 Info Overload',
      title: 'Confusing Health Advice',
      desc: "Keto, fasting, HIIT — every influencer says something different. You don't know who to trust.",
      stat: null, display: '9/10', label: 'feel overwhelmed',
    },
    {
      icon: <Clock size={36} />,
      tag: '#4 Time Barrier',
      title: 'No Time or Motivation',
      desc: "Meal prep, gym schedules, calorie counting — it's a part-time job most people can't keep up with.",
      stat: 60, suffix: '%', label: 'cite time as barrier',
    },
    {
      icon: <BadgeDollarSign size={36} />,
      tag: '#5 Cost Barrier',
      title: 'Coaches Are Expensive',
      desc: 'Personal trainers and nutritionists cost $300–$500/month — completely out of reach for most people.',
      stat: null, display: '$300+', label: 'per month avg',
    },
    {
      icon: <Utensils size={36} />,
      tag: '#6 Diet Confusion',
      title: 'Wrong Diet Choices',
      desc: 'Counting calories manually is tedious and inaccurate. Most people have no idea what to eat or when.',
      stat: 65, suffix: '%', label: 'struggle with nutrition',
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0a0a0d',
        padding: '140px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* "PROBLEMS" ghost watermark */}
      <div style={{
        position: 'absolute',
        top: '60px', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Bebas Neue', 'Montserrat', sans-serif",
        fontSize: 'clamp(80px, 12vw, 160px)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '1px #002a4a',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0,
        letterSpacing: '8px',
        userSelect: 'none',
      }}>
        PROBLEMS
      </div>

      {/* Subtle fire glow top */}
      <motion.div
        style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', height: '2px',
          background: `linear-gradient(90deg, transparent, ${FIRE}, transparent)`,
          pointerEvents: 'none', zIndex: 0,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
            fontSize: '0.75rem', letterSpacing: '5px',
            textTransform: 'uppercase', color: FIRE,
            marginBottom: '16px', fontWeight: 700,
          }}>
            The Real Problem
          </div>

          <h2 style={{
            fontFamily: "'Bebas Neue', 'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            lineHeight: 1, letterSpacing: '2px',
            color: '#FFFFFF', margin: '0 0 20px',
            textTransform: 'uppercase',
          }}>
            Why Most People{' '}
            <span style={{ color: FIRE }}>Fail</span>
            {' '}at Their Health Goals
          </h2>

          <p style={{
            fontSize: '0.95rem', color: CHROME,
            maxWidth: '480px', margin: '0 auto',
            lineHeight: 1.8, fontWeight: 300,
          }}>
            Without the right system, staying consistent is nearly impossible.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          position: 'relative', zIndex: 1,
          marginBottom: '2px',
        }}>
          {problems.map((item, i) => (
            <FeatureCard
              key={i}
              item={item}
              index={i}
              FIRE={FIRE}
              ASH={ASH}
              CHROME={CHROME}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
