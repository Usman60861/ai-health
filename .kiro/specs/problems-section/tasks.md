# Implementation Tasks — Problems Section

## Tasks

- [-] 1. Create ProblemsSection component file with base structure
  - [ ] 1.1 Create `client/src/components/ProblemsSection.jsx` with imports (`React`, `useState`, `useRef`, `useEffect`, `motion` from framer-motion, `useNavigate` from react-router-dom, lucide-react icons: `UserX`, `TrendingDown`, `Utensils`, `Clock`, `BadgeDollarSign`, `ShieldAlert`, `ArrowRight`)
  - [ ] 1.2 Copy the `Card3DTilt` component verbatim from `LandingPageSimple.jsx` into `ProblemsSection.jsx` as a local function (it is not exported from LandingPageSimple)
  - [ ] 1.3 Define the `PROBLEMS` data array with all 6 entries (title, desc, icon, statValue, statSuffix, statDisplay, statLabel, color, delay)
  - [ ] 1.4 Inject CSS keyframes (`@keyframes pulse`) and responsive grid styles (`.problems-grid`) via a `<style>` tag inside the component

- [ ] 2. Implement AnimatedCounter sub-component
  - [ ] 2.1 Implement `AnimatedCounter({ target, suffix, color })` using `IntersectionObserver` + `requestAnimationFrame` with cubic ease-out curve `1 - Math.pow(1 - t, 3)` over 1500ms
  - [ ] 2.2 Add `hasAnimated` ref guard so the counter only fires once per mount
  - [ ] 2.3 Add cleanup in `useEffect` return: `observer.disconnect()` and `cancelAnimationFrame(rafRef.current)`

- [ ] 3. Implement AmbientOrbs sub-component
  - [ ] 3.1 Render 3 `motion.div` orbs with `position: absolute`, `borderRadius: 50%`, `filter: blur(120px)`, `willChange: transform`
  - [ ] 3.2 Orb 1: 600×600px, top-left, `#24DCFF`, opacity 0.06, animate `y: [0,-30,0]` 8s infinite
  - [ ] 3.3 Orb 2: 500×500px, top-right, `#6C63FF`, opacity 0.07, animate `y: [0,20,0]` 10s infinite delay 2s
  - [ ] 3.4 Orb 3: 400×400px, bottom-center, `#4ECDC4`, opacity 0.05, animate `y: [0,-20,0]` 12s infinite delay 4s

- [ ] 4. Implement ProblemCard sub-component
  - [ ] 4.1 Render `motion.div` wrapper with `initial={{ opacity:0, y:30 }}`, `whileInView={{ opacity:1, y:0 }}`, `transition={{ duration:0.6, delay:item.delay }}`, `viewport={{ once:true }}`
  - [ ] 4.2 Wrap content in `Card3DTilt` with the card's `color` and `padding: '32px 28px'`
  - [ ] 4.3 Render icon container: 56×56px, `borderRadius: 16px`, gradient bg, border, glow `boxShadow: 0 4px 24px {color}30`, icon wrapped in `<span aria-hidden="true">`
  - [ ] 4.4 Render `<h3>` for title (Montserrat 700, 17px, `#E8F4F8`)
  - [ ] 4.5 Render description `<p>` (Inter 13px, `rgba(232,244,248,0.45)`, lineHeight 1.75)
  - [ ] 4.6 Render statistic badge: if `item.statValue !== null` use `<AnimatedCounter>`, else render `item.statDisplay` as static text; badge uses `{color}10` bg and `{color}25` border

- [ ] 5. Implement SolutionBridge sub-component
  - [ ] 5.1 Render `motion.div` with `initial={{ opacity:0, y:20 }}`, `whileInView={{ opacity:1, y:0 }}`, `viewport={{ once:true }}`
  - [ ] 5.2 Apply banner styles: gradient bg `rgba(36,220,255,0.06) → rgba(108,99,255,0.06)`, border `1px solid rgba(36,220,255,0.12)`, `boxShadow: inset 0 1px 0 rgba(36,220,255,0.1), 0 0 60px rgba(36,220,255,0.04)`, `borderRadius: 24px`, `padding: 48px 56px`
  - [ ] 5.3 Add decorative right-side radial glow div (position absolute, `radial-gradient(circle, rgba(36,220,255,0.08), transparent)`)
  - [ ] 5.4 Render headline `<h3>` with "Instantly" highlighted in `#24DCFF` with `textShadow: 0 0 16px rgba(36,220,255,0.4)`
  - [ ] 5.5 Render description `<p>` referencing personalization, progress tracking, and cost
  - [ ] 5.6 Render CTA button with gradient `#24DCFF → #4ECDC4`, dark text `#0B0F14`, `boxShadow: 0 0 32px rgba(36,220,255,0.35)`, `aria-label="Get started with NutriAI and solve your health challenges"`, scale 1.05 + enhanced glow on hover, calls `onCTAClick` on click

- [ ] 6. Implement ProblemsSection root component
  - [ ] 6.1 Render `<section aria-label="Problems">` with `background: #0d1117`, `padding: 120px 0`, `position: relative`, `overflow: hidden`
  - [ ] 6.2 Add top gradient line (1px, `linear-gradient(90deg, transparent, #24DCFF, transparent)`)
  - [ ] 6.3 Render `<AmbientOrbs />` inside the section (z-index 0)
  - [ ] 6.4 Render section header: animated badge with pulsing dot, `<h2>` with "Fail" highlighted + glow, subtitle — all wrapped in `motion.div` with `whileInView` scroll animation
  - [ ] 6.5 Render `<div className="problems-grid">` containing 6 `<ProblemCard>` instances
  - [ ] 6.6 Render `<SolutionBridge onCTAClick={handleCTA} />`
  - [ ] 6.7 Add bottom fade div (80px, `linear-gradient(to bottom, transparent, #0B0F14)`)
  - [ ] 6.8 Wrap entire component in `React.memo`
  - [ ] 6.9 Implement `onCTAClick` prop fallback: `const handleCTA = onCTAClick ?? (() => navigate('/signup'))`

- [x] 7. Integrate ProblemsSection into LandingPage
  - [ ] 7.1 Add `import ProblemsSection from '../components/ProblemsSection'` to `LandingPageSimple.jsx`
  - [ ] 7.2 Replace the entire existing inline `{/* ── PROBLEM SECTION ── */}` `<section>` block with `<ProblemsSection onCTAClick={() => navigate('/signup')} />`
  - [ ] 7.3 Remove the now-unused icon imports from `LandingPageSimple.jsx` that were only used in the old problems section (`UserX`, `TrendingDown`, `Utensils`, `Clock`, `BadgeDollarSign`, `ShieldAlert`) if they are not used elsewhere
