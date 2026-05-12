import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPProvider() {
  const location = useLocation();

  useEffect(() => {
    // Kill previous triggers
    ScrollTrigger.getAll().forEach(st => st.kill());

    const timer = setTimeout(() => {

      // ── 1. Page entrance: stagger all direct children of main ──────
      const mainChildren = document.querySelectorAll('main > div > *');
      if (mainChildren.length) {
        gsap.fromTo(mainChildren,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          }
        );
      }

      // ── 2. Scroll reveal for [data-reveal] ─────────────────────────
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        const from = {
          up:    { opacity: 0, y: 50 },
          down:  { opacity: 0, y: -50 },
          left:  { opacity: 0, x: -60 },
          right: { opacity: 0, x: 60 },
          fade:  { opacity: 0, scale: 0.95 },
        }[dir] || { opacity: 0, y: 40 };

        gsap.fromTo(el, from, {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          delay: parseFloat(el.dataset.revealDelay || 0),
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── 3. Counter for [data-count] ────────────────────────────────
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        if (isNaN(target)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          delay: 0.3,
          onUpdate: () => {
            el.textContent = Number.isInteger(target)
              ? Math.round(obj.val).toLocaleString()
              : obj.val.toFixed(1);
          },
        });
      });

      // ── 4. Magnetic for [data-magnetic] ───────────────────────────
      document.querySelectorAll('[data-magnetic]').forEach(el => {
        const strength = parseFloat(el.dataset.magnetic || 0.35);
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
        };
        const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        el._gsapCleanup = () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      });

      // ── 5. Floating glow blobs on dashboard ───────────────────────
      document.querySelectorAll('[data-float]').forEach((el, i) => {
        gsap.to(el, {
          y: -20,
          duration: 2.5 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });

    }, 80);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll('[data-magnetic]').forEach(el => el._gsapCleanup?.());
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [location.pathname]);

  return null;
}
