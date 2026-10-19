import React, { useEffect, useRef, useState } from 'react';

/**
 * High-Performance, Zero-Lag Atelier Custom Cursor.
 * - Hardware-accelerated direct DOM transform updates (zero React re-renders during mousemove).
 * - Instant 0ms precision pointer dot + snappy GPU-lerped context ring.
 * - NO backdrop-blur filters (the #1 cause of cursor lag in Chromium).
 * - Smooth CSS transitions on state changes (hover, view, pointer).
 * - Automatically disabled on touch-only devices.
 * - pointer-events: none guaranteed.
 */
export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<{
    variant: 'default' | 'pointer' | 'view' | 'taste' | 'branch' | 'explore' | 'drag' | 'play' | 'text';
    label: string | null;
  }>({
    variant: 'default',
    label: null,
  });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);
  const lastTarget = useRef<Element | null>(null);

  useEffect(() => {
    // Only disable on pure touch-only screens without a fine mouse/trackpad pointer
    const isTouchOnly =
      'ontouchstart' in window &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches;

    if (isTouchOnly) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    // Snappy, 120Hz/60Hz zero-lag animation loop for the trailing ring
    const animate = () => {
      // Snappy lerp factor: 0.38 for instant responsiveness without sluggish drag
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * 0.38;
      ringPos.current.y += dy * 0.38;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    // Instant 0ms latency update for the pointer dot on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Optimized hover target detection (throttled by target comparison)
    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element) || el === lastTarget.current) return;
      lastTarget.current = el;

      const interactive = el.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor], video'
      ) as HTMLElement | null;

      if (!interactive) {
        setCursorState((prev) =>
          prev.variant === 'default' && prev.label === null
            ? prev
            : { variant: 'default', label: null }
        );
        return;
      }

      const tag = interactive.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        setCursorState({ variant: 'text', label: null });
        return;
      }

      const explicit = interactive.getAttribute('data-cursor');
      const explicitLabel = interactive.getAttribute('data-cursor-label');

      if (explicit === 'view') {
        setCursorState({ variant: 'view', label: explicitLabel || 'VIEW' });
      } else if (explicit === 'taste') {
        setCursorState({ variant: 'taste', label: explicitLabel || 'TASTE' });
      } else if (explicit === 'branch') {
        setCursorState({ variant: 'branch', label: explicitLabel || 'VISIT' });
      } else if (explicit === 'explore') {
        setCursorState({ variant: 'explore', label: explicitLabel || 'EXPLORE' });
      } else if (explicit === 'play' || tag === 'video') {
        setCursorState({ variant: 'play', label: explicitLabel || 'PLAY' });
      } else if (explicit === 'drag') {
        setCursorState({ variant: 'drag', label: explicitLabel || 'DRAG' });
      } else if (
        interactive.getAttribute('aria-disabled') === 'true' ||
        (interactive as HTMLButtonElement).disabled
      ) {
        setCursorState({ variant: 'default', label: null });
      } else {
        setCursorState({ variant: 'pointer', label: explicitLabel || null });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isVisible]);

  if (!enabled) return null;

  const { variant, label } = cursorState;
  const isText = variant === 'text';
  const isLabelActive = Boolean(label) && variant !== 'default' && variant !== 'pointer' && variant !== 'text';
  const isPointer = variant === 'pointer';

  // Compute ring styling based on active state (runs on GPU-accelerated CSS)
  let ringWidth = 14;
  let ringHeight = 14;
  let ringBg = 'transparent';
  let ringBorder = '1.5px solid rgba(232, 144, 168, 0.7)';
  let ringShadow = 'none';

  if (isText) {
    ringWidth = 3;
    ringHeight = 22;
    ringBg = '#E890A8';
    ringBorder = 'none';
  } else if (isLabelActive) {
    ringWidth = 78;
    ringHeight = 78;
    ringBg = 'rgba(232, 144, 168, 0.96)';
    ringBorder = '2px solid rgba(106, 172, 233, 0.9)';
    ringShadow = '0 6px 20px rgba(232, 144, 168, 0.35)';
  } else if (isPointer) {
    ringWidth = 40;
    ringHeight = 40;
    ringBg = 'rgba(232, 144, 168, 0.12)';
    ringBorder = '1.5px solid rgba(106, 172, 233, 0.8)';
    ringShadow = '0 2px 10px rgba(106, 172, 233, 0.2)';
  }

  return (
    <>
      {/* 1. Context Ring: GPU-Accelerated Snappy Follower */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform flex items-center justify-center text-center select-none"
        style={{
          width: ringWidth,
          height: ringHeight,
          borderRadius: isText ? '2px' : '9999px',
          backgroundColor: ringBg,
          border: ringBorder,
          boxShadow: ringShadow,
          opacity: isVisible ? 1 : 0,
          transition:
            'width 0.18s cubic-bezier(0.16, 1, 0.3, 1), height 0.18s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.18s ease, border-color 0.18s ease, opacity 0.15s ease',
        }}
      >
        {isLabelActive && label && (
          <span className="text-[10px] font-mono tracking-widest uppercase text-white font-bold px-1 animate-in fade-in zoom-in-90 duration-150">
            {label}
          </span>
        )}
      </div>

      {/* 2. Precision Center Dot: 0ms Latency (Locks to hardware cursor position instantly) */}
      {!isText && !isLabelActive && (
        <div
          ref={dotRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.12s ease',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#E890A8] shadow-xs -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </>
  );
};

export default CustomCursor;
