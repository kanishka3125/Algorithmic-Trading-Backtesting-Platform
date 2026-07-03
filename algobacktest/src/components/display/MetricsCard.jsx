import React, { useEffect, useRef, useState } from 'react';

// ─── useCountUp hook ──────────────────────────────────────────────────────────
// Animates a number from 0 to `target` over `duration` ms with easeOut.
// `target` must be a finite number; returns the animated display string.
const useCountUp = (formattedValue, duration = 1100) => {
  const [display, setDisplay] = useState(formattedValue);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    // Extract the raw numeric value and surrounding format context
    // Handles: "+14.20%", "-3.50%", "1.25", "42"
    const match = formattedValue?.toString().match(/([+-]?)([0-9,.]+)(\D*)/);
    if (!match) { setDisplay(formattedValue); return; }

    const sign = match[1];
    const rawNum = parseFloat(match[2].replace(/,/g, ''));
    const suffix = match[3];

    if (!isFinite(rawNum) || rawNum === 0) { setDisplay(formattedValue); return; }

    cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = rawNum * eased;

      // Re-assemble in original format
      const decimals = (match[2].includes('.') ? match[2].split('.')[1].length : 0);
      const formatted = current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setDisplay(`${sign}${formatted}${suffix}`);

      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setDisplay(formattedValue); // land exactly on target
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedValue]);

  return display;
};

// ─── Component ────────────────────────────────────────────────────────────────
const MetricsCard = ({ label, value, type = 'neutral', subLabel, index = 0 }) => {
  let valueColorClass = 'text-primary';
  if (type === 'profit') valueColorClass = 'text-profit';
  else if (type === 'loss') valueColorClass = 'text-loss';

  const animatedValue = useCountUp(String(value), 1100 + index * 80);

  // Flash highlight on value settle
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFlash(true), 1100 + index * 80);
    const t2 = setTimeout(() => setFlash(false), 1500 + index * 80);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [value, index]);

  return (
    <div
      className="card card-hover flex-col justify-between animate-in btn-active"
      style={{
        height: '110px',
        animationDelay: `${index * 80}ms`,
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle shimmer when value settles */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: flash
          ? `radial-gradient(ellipse at 50% 100%, ${type === 'profit' ? 'rgba(34,197,94,0.08)' : type === 'loss' ? 'rgba(239,68,68,0.08)' : 'rgba(6,182,212,0.06)'} 0%, transparent 70%)`
          : 'transparent',
        transition: 'background 0.4s ease',
        borderRadius: 'inherit',
      }} />

      <div className="flex justify-between items-center w-full">
        <h4 className="label text-muted" style={{ margin: 0 }}>{label}</h4>

        {type === 'profit' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-profit">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        )}
        {type === 'loss' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-loss">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
          </svg>
        )}
        {type === 'neutral' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
            <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
        )}
      </div>

      <div>
        <div
          className={`metric-value ${valueColorClass}`}
          style={{ transition: 'color 0.3s ease' }}
        >
          {animatedValue}
        </div>
        {subLabel && (
          <div className="text-secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
