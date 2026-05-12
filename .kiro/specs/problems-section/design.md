# Design Document — Problems Section

## Overview

A world-class, pro-level Problems Section for the NutriAI landing page. The visual quality targets Stripe / Linear / Vercel-tier design: deep glass-morphism cards, ambient floating orbs, animated statistics, 3D tilt interactions, and a polished Solution Bridge CTA. All visuals are pure CSS/inline-style — no external images.

---

## Component Architecture

```
client/src/components/ProblemsSection.jsx
├── ProblemsSection (default export, React.memo)
│   ├── <AmbientOrbs />          — floating blurred background orbs
│   ├── Section Header           — badge + h2 + subtitle
│   ├── <ProblemCard /> × 6      — 3D tilt cards with animated stats
│   │   └── <AnimatedCounter />  — smooth 60fps numeric animation
│   └── <SolutionBridge />       — CTA banner
```

**Integration:** `LandingPageSimple.jsx` imports `ProblemsSection` and replaces the existing inline `{/* ── PROBLEM SECTION ── */}` block.

---

## Data Model

```js
const PROBLEMS = [
  {
    icon: <UserX size={24} />,
    title: 'No Personalized Plan',
    desc: "Generic diet and workout plans don't work. Everyone's body is different and needs a unique approach tailored to their goals.",
    statValue: 73,        // pure integer → AnimatedCounter
    statSuffix: '%',
    statLabel: 'quit generic plans in 2 weeks',
    color: '#24DCFF',
    delay: 0,
  },
  {
    icon: <TrendingDown size={24} />,
    title: 'No Progress Tracking',
    desc: "Without tracking, you can't see what's working. Most people give up because they see no visible results over time.",
    statValue: 80,
    statSuffix: '%',
    statLabel: 'fail without tracking',
    color: '#6C63FF',
    delay: 0.1,
  },
  {
    icon: <Utensils size={24} />,
    title: 'Poor Nutrition Choices',
    desc: 'Counting calories manually is tedious and inaccurate. Most people have no idea what to eat or when to eat it.',
    statValue: 65,
    statSuffix: '%',
    statLabel: 'struggle with daily nutrition',
    color: '#4ECDC4',
    delay: 0.2,
  },
  {
    icon: <Clock size={24} />,
    title: 'No Time or Motivation',
    desc: 'Busy schedules make it hard to plan meals and workouts consistently. Motivation fades without a smart adaptive system.',
    statValue: 60,
    statSuffix: '%',
    statLabel: 'cite time as main barrier',
    color: '#FFB74D',
    delay: 0.3,
  },
  {
    icon: <BadgeDollarSign size={24} />,
    title: 'Expensive Coaches',
    desc: 'Personal trainers and nutritionists cost hundreds per month — completely out of reach for the average person.',
    statValue: null,      // non-numeric → static display
    statDisplay: '$300+',
    statLabel: 'avg monthly coach cost',
    color: '#24DCFF',
    delay: 0.4,
  },
  {
    icon: <ShieldAlert size={24} />,
    title: 'Conflicting Information',
    desc: "The internet is full of contradictory advice. It's impossible to know what actually works for your specific body.",
    statValue: null,
    statDisplay: '9 in 10',
    statLabel: 'feel overwhelmed by info',
    color: '#6C63FF',
    delay: 0.5,
  },
];
```

---

## Visual Design Specification

### Color Tokens
| Token | Value |
|---|---|
| Background | `#0d1117` |
| Primary Text | `#E8F4F8` |
| Secondary Text | `rgba(232,244,248,0.55)` |
| Muted Text | `rgba(232,244,248,0.4)` |
| Accent Cyan | `#24DCFF` |
| Accent Purple | `#6C63FF` |
| Accent Teal | `#4ECDC4` |
| Accent Amber | `#FFB74D` |

### Typography
| Element | Font | Weight | Size |
|---|---|---|---|
| Section H2 | Montserrat | 700 | `clamp(32px, 4vw, 52px)` |
| Card H3 | Montserrat | 700 | `17px` |
| Stat value | Montserrat | 800 | `20px` |
| Body / desc | Inter | 400 | `13px` |
| Badge label | Inter | 500 | `12px` |
| Stat label | Inter | 400 | `11px` |

---

## Section Layout

```
<section aria-label="Problems">
  position: relative
  background: #0d1117
  padding: 120px 0
  overflow: hidden

  ├── Top gradient line (1px, full width)
  ├── AmbientOrbs (position: absolute, z-index: 0)
  ├── Container (max-width: 1200px, padding: 0 48px, z-index: 1)
  │   ├── Section Header
  │   ├── Cards Grid (3-col → 2-col → 1-col)
  │   └── SolutionBridge
  └── Bottom fade (80px gradient to #0B0F14)
```

### Top Gradient Line
```js
{
  position: 'absolute', top: 0, left: 0, right: 0,
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, #24DCFF 50%, transparent 100%)',
  zIndex: 2,
}
```

### Bottom Fade
```js
{
  position: 'absolute', bottom: 0, left: 0, right: 0,
  height: '80px',
  background: 'linear-gradient(to bottom, transparent, #0B0F14)',
  pointerEvents: 'none', zIndex: 2,
}
```

---

## AmbientOrbs Component

Three large blurred radial orbs that float with framer-motion infinite animation. Positioned absolutely behind all content.

```js
const orbs = [
  {
    size: 600, top: '-10%', left: '-8%',
    color: '#24DCFF', opacity: 0.06,
    animate: { y: [0, -30, 0] }, duration: 8, delay: 0,
  },
  {
    size: 500, top: '5%', right: '-6%',
    color: '#6C63FF', opacity: 0.07,
    animate: { y: [0, 20, 0] }, duration: 10, delay: 2,
  },
  {
    size: 400, bottom: '10%', left: '35%',
    color: '#4ECDC4', opacity: 0.05,
    animate: { y: [0, -20, 0] }, duration: 12, delay: 4,
  },
];
```

Each orb:
```js
<motion.div
  style={{
    position: 'absolute',
    width: `${orb.size}px`, height: `${orb.size}px`,
    borderRadius: '50%',
    background: orb.color,
    opacity: orb.opacity,
    filter: 'blur(120px)',
    pointerEvents: 'none',
    willChange: 'transform',
    // positional props (top/left/right/bottom)
  }}
  animate={orb.animate}
  transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
/>
```

---

## Section Header

```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
  style={{ textAlign: 'center', marginBottom: '80px' }}
>
  {/* Badge */}
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '7px 18px', borderRadius: '999px',
    background: 'rgba(36,220,255,0.08)', border: '1px solid rgba(36,220,255,0.2)',
    color: '#24DCFF', fontSize: '12px', fontWeight: 500,
    marginBottom: '24px',
  }}>
    {/* Pulsing dot — CSS animation: pulse 2s infinite */}
    <span style={{
      width: '6px', height: '6px', borderRadius: '50%',
      background: '#24DCFF', display: 'inline-block',
      animation: 'pulse 2s ease-in-out infinite',
    }} />
    The Real Problem
  </div>

  {/* H2 */}
  <h2 style={{
    fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
    fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.1,
    color: '#E8F4F8', margin: '0 0 20px',
  }}>
    Why Most People{' '}
    <span style={{
      color: '#24DCFF',
      textShadow: '0 0 20px rgba(36,220,255,0.5)',
    }}>Fail</span>
    {' '}at Their<br />Health Goals
  </h2>

  {/* Subtitle */}
  <p style={{
    fontSize: '15px', lineHeight: 1.75,
    color: 'rgba(232,244,248,0.5)',
    maxWidth: '520px', margin: '0 auto',
  }}>
    Without the right guidance and tools, staying consistent with fitness
    and nutrition is nearly impossible for most people.
  </p>
</motion.div>
```

**CSS keyframe** (inject via `<style>` tag inside the component or global CSS):
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.85); }
}
```

---

## Card3DTilt (copied into ProblemsSection.jsx)

The `Card3DTilt` component from `LandingPageSimple.jsx` is not exported, so it must be copied verbatim into `ProblemsSection.jsx` as a local function. No changes needed.

---

## ProblemCard Component

```jsx
function ProblemCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: item.delay }}
      viewport={{ once: true }}
      style={{ willChange: 'transform' }}
    >
      <Card3DTilt color={item.color} style={{ padding: '32px 28px', height: '100%' }}>

        {/* Icon container */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: `linear-gradient(135deg, ${item.color}25, ${item.color}08)`,
          border: `1px solid ${item.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: item.color, marginBottom: '20px',
          boxShadow: `0 4px 24px ${item.color}30`,
        }}>
          <span aria-hidden="true">{item.icon}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: '17px', color: '#E8F4F8', margin: '0 0 10px',
        }}>
          {item.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13px', lineHeight: 1.75,
          color: 'rgba(232,244,248,0.45)',
          margin: '0 0 24px',
        }}>
          {item.desc}
        </p>

        {/* Statistic badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '8px 14px', borderRadius: '10px',
          background: `${item.color}10`, border: `1px solid ${item.color}25`,
        }}>
          <span style={{
            fontSize: '20px', fontWeight: 800,
            fontFamily: 'Montserrat, sans-serif',
            color: item.color, letterSpacing: '-0.5px',
          }}>
            {item.statValue !== null
              ? <AnimatedCounter target={item.statValue} suffix={item.statSuffix} color={item.color} />
              : item.statDisplay
            }
          </span>
          <span style={{
            fontSize: '11px', color: 'rgba(232,244,248,0.4)',
            lineHeight: 1.4, maxWidth: '90px',
          }}>
            {item.statLabel}
          </span>
        </div>

      </Card3DTilt>
    </motion.div>
  );
}
```

---

## AnimatedCounter Component

Uses `IntersectionObserver` + `requestAnimationFrame` for smooth 60fps animation. Cubic ease-out curve.

```jsx
function AnimatedCounter({ target, suffix = '', color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out: 1 - (1 - t)^3
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}
```

---

## Cards Grid Layout

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',  // desktop ≥1024px
  // tablet ≥640px: repeat(2, 1fr)  — handled via CSS media query or inline style
  // mobile <640px: 1fr
  gap: '24px',
  marginBottom: '64px',
}}>
  {PROBLEMS.map((item, i) => (
    <ProblemCard key={i} item={item} index={i} />
  ))}
</div>
```

**Responsive grid** — inject via `<style>` tag:
```css
.problems-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;
}
@media (max-width: 1023px) {
  .problems-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .problems-grid { grid-template-columns: 1fr; }
}
```

---

## SolutionBridge Component

```jsx
function SolutionBridge({ onCTAClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true }}
      style={{
        padding: '48px 56px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(36,220,255,0.06) 0%, rgba(108,99,255,0.06) 100%)',
        border: '1px solid rgba(36,220,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(36,220,255,0.1), 0 0 60px rgba(36,220,255,0.04)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '40px',
        flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative right glow */}
      <div style={{
        position: 'absolute', right: '-60px', top: '50%',
        transform: 'translateY(-50%)',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(36,220,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: '280px' }}>
        <h3 style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#E8F4F8',
          margin: '0 0 12px',
        }}>
          NutriAI Solves All of This —{' '}
          <span style={{
            color: '#24DCFF',
            textShadow: '0 0 16px rgba(36,220,255,0.4)',
          }}>Instantly</span>
        </h3>
        <p style={{
          fontSize: '14px', lineHeight: 1.75,
          color: 'rgba(232,244,248,0.55)',
          margin: 0, maxWidth: '520px',
        }}>
          Get a fully personalized plan in seconds, automatic progress tracking,
          and expert-level guidance — all for a fraction of a personal coach's cost.
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onCTAClick}
        aria-label="Get started with NutriAI and solve your health challenges"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
          padding: '15px 32px', borderRadius: '12px',
          fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none',
          background: 'linear-gradient(135deg, #24DCFF, #4ECDC4)',
          color: '#0B0F14',
          boxShadow: '0 0 32px rgba(36,220,255,0.35)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative', zIndex: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 48px rgba(36,220,255,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 32px rgba(36,220,255,0.35)';
        }}
      >
        Fix It Now <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}
```

---

## ProblemsSection Root Component

```jsx
const ProblemsSection = React.memo(function ProblemsSection({ onCTAClick }) {
  const navigate = useNavigate();
  const handleCTA = onCTAClick ?? (() => navigate('/signup'));

  return (
    <>
      {/* Inject CSS keyframes + responsive grid */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        .problems-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 64px;
        }
        @media (max-width: 1023px) {
          .problems-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .problems-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section aria-label="Problems" style={{
        background: '#0d1117',
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top gradient line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #24DCFF 50%, transparent 100%)',
          zIndex: 2,
        }} />

        {/* Ambient orbs */}
        <AmbientOrbs />

        {/* Content */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 48px', position: 'relative', zIndex: 1,
        }}>
          {/* Header */}
          {/* ... (see Section Header spec above) */}

          {/* Cards grid */}
          <div className="problems-grid">
            {PROBLEMS.map((item, i) => (
              <ProblemCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Solution Bridge */}
          <SolutionBridge onCTAClick={handleCTA} />
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #0B0F14)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      </section>
    </>
  );
});

export default ProblemsSection;
```

---

## LandingPage Integration

In `client/src/pages/LandingPageSimple.jsx`:

1. Add import at top:
```js
import ProblemsSection from '../components/ProblemsSection';
```

2. Replace the entire `{/* ── PROBLEM SECTION ── */}` block (from `<section style={{ background: '#0d1117'...` to its closing `</section>`) with:
```jsx
<ProblemsSection onCTAClick={() => navigate('/signup')} />
```

---

## Correctness Properties

1. **P1 — Render completeness**: ProblemsSection renders exactly 6 ProblemCard elements.
2. **P2 — Counter bounds**: AnimatedCounter never displays a value outside `[0, target]` at any animation frame.
3. **P3 — Counter cleanup**: AnimatedCounter cancels its `requestAnimationFrame` on unmount (no memory leaks).
4. **P4 — Static stat display**: Cards with `statValue === null` render `statDisplay` string directly, never invoke AnimatedCounter.
5. **P5 — CTA fallback**: When `onCTAClick` prop is undefined, clicking the CTA button navigates to `/signup`.
6. **P6 — Animation once**: All `whileInView` animations use `viewport={{ once: true }}` — they do not re-trigger on scroll-up.
7. **P7 — Accessibility**: Section element has `aria-label="Problems"`, all icons have `aria-hidden="true"`, CTA button has descriptive `aria-label`.
