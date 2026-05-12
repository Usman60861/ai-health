import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAP(setup, deps = []) {
  useEffect(() => {
    const ctx = gsap.context(setup);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useCountUp(ref, target, duration = 1.5, deps = []) {
  useEffect(() => {
    if (!ref.current || !target) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val).toLocaleString();
      },
    });
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);
}

export function useMagnetic(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);
}

export function useScrollReveal(selector, options = {}) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const tweens = Array.from(els).map((el, i) =>
      gsap.fromTo(el,
        { opacity: 0, y: options.y ?? 40 },
        {
          opacity: 1, y: 0,
          duration: options.duration ?? 0.7,
          ease: 'power3.out',
          delay: i * (options.stagger ?? 0.08),
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    );
    return () => {
      tweens.forEach(t => t.kill());
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);
}
