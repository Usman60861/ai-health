import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailsRef = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trailDots, setTrailDots] = useState(
    Array.from({ length: 8 }, (_, i) => ({ x: -100, y: -100, id: i }))
  );
  const trailPositions = useRef(Array.from({ length: 8 }, () => ({ x: -100, y: -100 })));

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, [style*="cursor: pointer"]')
      .forEach(el => el.style.cursor = 'none');

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], [style*="cursor"]');
      if (el) setIsHovering(true);
    };
    const onMouseOut = (e) => {
      const el = e.target.closest('a, button, [role="button"], [style*="cursor"]');
      if (el) setIsHovering(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Animation loop
    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) { rafRef.current = requestAnimationFrame(animate); return; }

      // Dot follows mouse instantly
      dot.style.transform = `translate(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px)`;

      // Ring follows with lag (lerp)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      const ringSize = isHovering ? 48 : 32;
      ring.style.transform = `translate(${ringPos.current.x - ringSize / 2}px, ${ringPos.current.y - ringSize / 2}px)`;

      // Trail positions cascade
      trailPositions.current[0].x += (mousePos.current.x - trailPositions.current[0].x) * 0.25;
      trailPositions.current[0].y += (mousePos.current.y - trailPositions.current[0].y) * 0.25;
      for (let i = 1; i < trailPositions.current.length; i++) {
        trailPositions.current[i].x += (trailPositions.current[i - 1].x - trailPositions.current[i].x) * 0.25;
        trailPositions.current[i].y += (trailPositions.current[i - 1].y - trailPositions.current[i].y) * 0.25;
      }

      // Update trail DOM elements
      trailsRef.current.forEach((el, i) => {
        if (!el) return;
        const size = 6 - i * 0.5;
        const opacity = (1 - i / trailsRef.current.length) * 0.35;
        el.style.transform = `translate(${trailPositions.current[i].x - size / 2}px, ${trailPositions.current[i].y - size / 2}px)`;
        el.style.opacity = opacity;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {trailDots.map((_, i) => (
        <div
          key={i}
          ref={el => trailsRef.current[i] = el}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: i % 2 === 0 ? '#24DCFF' : '#4ECDC4',
            pointerEvents: 'none',
            zIndex: 99997,
            willChange: 'transform',
            transition: 'opacity 0.1s',
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? '#24DCFF' : 'rgba(78,205,196,0.7)'}`,
          boxShadow: isHovering
            ? '0 0 12px rgba(36,220,255,0.6), inset 0 0 8px rgba(36,220,255,0.1)'
            : '0 0 8px rgba(78,205,196,0.4)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          background: isHovering ? 'rgba(36,220,255,0.05)' : 'transparent',
        }}
      />

      {/* Center dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: isClicking ? '3px' : '8px',
          height: isClicking ? '3px' : '8px',
          borderRadius: '50%',
          background: isHovering ? '#24DCFF' : '#4ECDC4',
          boxShadow: isHovering
            ? '0 0 10px #24DCFF, 0 0 20px rgba(36,220,255,0.5)'
            : '0 0 8px #4ECDC4, 0 0 16px rgba(78,205,196,0.4)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'width 0.1s ease, height 0.1s ease, background 0.2s ease, box-shadow 0.2s ease',
        }}
      />
    </>
  );
}
