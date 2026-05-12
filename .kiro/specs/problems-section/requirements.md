# Requirements Document

## Introduction

The Problems Section is a visually stunning, professionally designed landing page section for the NutriAI fitness/nutrition web application. It highlights the core pain points users face when trying to manage their health without proper tools — and positions NutriAI as the definitive solution. The section must be engaging, emotionally resonant, and conversion-focused, matching the existing dark/gradient aesthetic of the landing page (`#0B0F14` background, `#24DCFF` cyan accent, `#6C63FF` purple, `#4ECDC4` teal, Montserrat headings, framer-motion animations).

The component will replace/enhance the existing basic Problems Section in `client/src/pages/LandingPageSimple.jsx` and will be extracted into a standalone `client/src/components/ProblemsSection.jsx` file.

## Glossary

- **ProblemsSection**: The React component that renders the full problems/pain-points section on the landing page.
- **ProblemCard**: An individual card component displaying a single user pain point with icon, statistic, and description.
- **SolutionBridge**: The call-to-action banner at the bottom of the section that transitions from problems to the NutriAI solution.
- **Card3DTilt**: The existing interactive 3D tilt card component used throughout the landing page.
- **AnimatedCounter**: A sub-component that animates numeric statistics when they scroll into view.
- **LandingPage**: The main landing page at `client/src/pages/LandingPageSimple.jsx`.
- **Framer_Motion**: The animation library (`framer-motion`) already installed and used in the project.
- **Tailwind_CSS**: The utility-first CSS framework configured in `client/tailwind.config.js`.
- **Accent_Cyan**: The primary accent color `#24DCFF` used throughout the design system.
- **Accent_Purple**: The secondary accent color `#6C63FF` used throughout the design system.
- **Accent_Teal**: The tertiary accent color `#4ECDC4` used throughout the design system.

---

## Requirements

### Requirement 1: Component Architecture

**User Story:** As a developer, I want the Problems Section extracted into a standalone reusable component, so that the landing page remains maintainable and the section can be updated independently.

#### Acceptance Criteria

1. THE ProblemsSection SHALL be implemented as a standalone React component in `client/src/components/ProblemsSection.jsx`.
2. THE LandingPage SHALL import and render the ProblemsSection component in place of the existing inline problems section markup.
3. THE ProblemsSection SHALL accept an `onCTAClick` prop (function) that is called when the primary call-to-action button is clicked.
4. WHEN the `onCTAClick` prop is not provided, THE ProblemsSection SHALL default to navigating to `/signup` using React Router's `useNavigate`.

---

### Requirement 2: Visual Design & Aesthetic Consistency

**User Story:** As a designer, I want the Problems Section to match the existing NutriAI dark/gradient aesthetic, so that the landing page feels cohesive and professional.

#### Acceptance Criteria

1. THE ProblemsSection SHALL use `#0d1117` as its background color, consistent with the existing section background.
2. THE ProblemsSection SHALL use `#E8F4F8` for primary text, `rgba(232,244,248,0.55)` for secondary text, and `rgba(232,244,248,0.4)` for muted text.
3. THE ProblemsSection SHALL use Accent_Cyan (`#24DCFF`), Accent_Purple (`#6C63FF`), and Accent_Teal (`#4ECDC4`) as the primary accent colors for icons, highlights, and statistics.
4. THE ProblemsSection SHALL use `Montserrat` font family for all headings and `Inter` for body text, consistent with the existing design system.
5. THE ProblemsSection SHALL include a decorative ambient background layer with subtle radial gradient glows positioned behind the content to add depth.
6. THE ProblemsSection SHALL include a top-to-bottom gradient fade at the section boundaries to blend seamlessly with adjacent sections.

---

### Requirement 3: Section Header

**User Story:** As a visitor, I want a compelling section header that immediately communicates the problem theme, so that I understand the section's purpose at a glance.

#### Acceptance Criteria

1. THE ProblemsSection SHALL render a section header containing: a pill-shaped badge label, a primary headline, and a supporting subtitle.
2. THE ProblemsSection SHALL animate the header using Framer_Motion with `opacity: 0 → 1` and `y: 30 → 0` on scroll into view (`whileInView`, `once: true`).
3. THE ProblemsSection SHALL display the badge with Accent_Cyan color, a pulsing dot indicator, and the text "The Real Problem".
4. THE ProblemsSection SHALL display the headline as: "Why Most People **Fail** at Their Health Goals" with the word "Fail" highlighted in Accent_Cyan.
5. THE ProblemsSection SHALL display a subtitle of no more than 120 characters explaining the consequence of lacking proper guidance.

---

### Requirement 4: Problem Cards Grid

**User Story:** As a visitor, I want to see the specific problems I face displayed as visually distinct cards, so that I feel understood and motivated to find a solution.

#### Acceptance Criteria

1. THE ProblemsSection SHALL render exactly 6 ProblemCards in a responsive grid layout.
2. THE ProblemsSection SHALL display ProblemCards in a 3-column grid on desktop (≥1024px), 2-column grid on tablet (≥640px), and 1-column grid on mobile (<640px).
3. EACH ProblemCard SHALL display: a colored icon container, a problem title, a description (2–3 sentences), and a statistic badge.
4. EACH ProblemCard SHALL use the Card3DTilt interactive 3D hover effect with the card's assigned accent color.
5. THE ProblemsSection SHALL assign the following 6 problems with their respective accent colors:
   - "No Personalized Plan" — Accent_Cyan
   - "No Progress Tracking" — Accent_Purple
   - "Poor Nutrition Choices" — Accent_Teal
   - "No Time or Motivation" — `#FFB74D` (amber)
   - "Expensive Coaches" — Accent_Cyan
   - "Conflicting Information" — Accent_Purple
6. EACH ProblemCard SHALL animate into view using Framer_Motion with staggered delays (0ms, 100ms, 200ms, 300ms, 400ms, 500ms respectively).
7. WHEN a ProblemCard enters the viewport, THE ProblemsSection SHALL animate it with `opacity: 0 → 1` and `y: 30 → 0` over 600ms.

---

### Requirement 5: Animated Statistics

**User Story:** As a visitor, I want to see compelling statistics on each problem card, so that the pain points feel credible and data-driven.

#### Acceptance Criteria

1. EACH ProblemCard SHALL display a statistic badge containing a bold numeric/text value and a short label.
2. THE ProblemsSection SHALL display the following statistics per card:
   - "No Personalized Plan": `73%` — "quit generic plans in 2 weeks"
   - "No Progress Tracking": `80%` — "fail without tracking"
   - "Poor Nutrition Choices": `65%` — "struggle with daily nutrition"
   - "No Time or Motivation": `60%` — "cite time as main barrier"
   - "Expensive Coaches": `$300+` — "avg monthly coach cost"
   - "Conflicting Information": `9 in 10` — "feel overwhelmed by info"
3. WHEN a ProblemCard's statistic contains a pure integer (e.g., 73, 80, 65, 60), THE AnimatedCounter SHALL animate the number from 0 to its target value over 1500ms using an ease-out curve when the card enters the viewport.
4. WHEN a statistic value is non-numeric (e.g., `$300+`, `9 in 10`), THE ProblemsSection SHALL display it as static styled text without animation.
5. THE statistic badge SHALL use the card's accent color for the numeric value and a semi-transparent background derived from the same accent color.

---

### Requirement 6: Enhanced Visual Effects

**User Story:** As a visitor, I want the section to feel premium and dynamic, so that I perceive NutriAI as a high-quality, trustworthy product.

#### Acceptance Criteria

1. THE ProblemsSection SHALL render floating ambient orb elements (at least 3) positioned absolutely behind the card grid, using blurred radial gradients in Accent_Cyan, Accent_Purple, and Accent_Teal with low opacity (≤0.12) to create depth.
2. THE ProblemsSection SHALL apply a subtle animated pulse or float animation to the ambient orbs using Framer_Motion `animate` with `y` oscillation and infinite repeat.
3. EACH ProblemCard icon container SHALL display a colored glow (`box-shadow`) using the card's accent color at 25% opacity.
4. THE ProblemsSection SHALL render a decorative top-edge gradient line at the very top of the section using a horizontal linear gradient from transparent → Accent_Cyan → transparent.
5. WHERE the user's device supports `backdrop-filter`, THE ProblemCard SHALL apply `backdropFilter: 'blur(12px)'` for a glass-morphism effect.

---

### Requirement 7: Solution Bridge Banner

**User Story:** As a visitor, I want a clear transition from the problems to the solution, so that I feel compelled to take action and sign up.

#### Acceptance Criteria

1. THE ProblemsSection SHALL render a SolutionBridge banner below the ProblemCards grid.
2. THE SolutionBridge SHALL display: a headline, a supporting description, and a primary CTA button.
3. THE SolutionBridge SHALL use a gradient background: `linear-gradient(135deg, rgba(36,220,255,0.08), rgba(108,99,255,0.08))` with a `1px solid rgba(36,220,255,0.15)` border and `24px` border-radius.
4. THE SolutionBridge headline SHALL read: "NutriAI Solves All of This — **Instantly**" with "Instantly" highlighted in Accent_Cyan.
5. THE SolutionBridge description SHALL be no more than 160 characters and reference personalization, progress tracking, and cost.
6. THE SolutionBridge CTA button SHALL use a `linear-gradient(135deg, #24DCFF, #4ECDC4)` background, dark text (`#0B0F14`), and a cyan glow `box-shadow`.
7. WHEN the CTA button is hovered, THE SolutionBridge SHALL scale the button to `1.05` using a CSS transition of 200ms.
8. WHEN the CTA button is clicked, THE SolutionBridge SHALL invoke the `onCTAClick` prop (or navigate to `/signup` by default).
9. THE SolutionBridge SHALL animate into view using Framer_Motion with `opacity: 0 → 1` and `y: 20 → 0` on scroll into view.

---

### Requirement 8: Accessibility

**User Story:** As a user with accessibility needs, I want the Problems Section to be navigable and readable, so that I can access the content regardless of my abilities.

#### Acceptance Criteria

1. THE ProblemsSection SHALL wrap the section in a `<section>` HTML element with an `aria-label="Problems"` attribute.
2. EACH ProblemCard SHALL use an `<h3>` element for the problem title to maintain correct heading hierarchy (section uses `<h2>`).
3. THE ProblemsSection SHALL ensure all icon elements are wrapped with `aria-hidden="true"` since they are decorative.
4. THE SolutionBridge CTA button SHALL have a descriptive `aria-label` attribute: "Get started with NutriAI and solve your health challenges".
5. THE ProblemsSection SHALL maintain a color contrast ratio of at least 4.5:1 for all body text against its background.

---

### Requirement 9: Performance

**User Story:** As a developer, I want the Problems Section to load and animate efficiently, so that the landing page maintains a high Lighthouse performance score.

#### Acceptance Criteria

1. THE ProblemsSection SHALL use Framer_Motion's `viewport={{ once: true }}` on all scroll-triggered animations to prevent re-triggering.
2. THE ProblemsSection SHALL use `will-change: transform` only on elements that actively animate (the Card3DTilt cards and floating orbs).
3. THE ProblemsSection SHALL use `React.memo` to prevent unnecessary re-renders of the ProblemsSection component.
4. THE AnimatedCounter SHALL use `useEffect` with a cleanup function to cancel the animation interval when the component unmounts.
5. THE ProblemsSection SHALL lazy-load no external images — all visual elements SHALL be CSS/SVG-based to avoid additional network requests.
