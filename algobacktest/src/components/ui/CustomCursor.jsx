import React, { useEffect, useRef } from 'react';

/**
 * High-performance Custom Cursor.
 * Uses requestAnimationFrame (RAF) for zero-latency movement.
 * Removes CSS transition lag for the primary "dot" while keeping smooth trail for the "ring".
 */
const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const dotPosRef = useRef({ x: 0, y: 0 });
    const ringPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            mouseRef.current = { x, y };
            
            // Update primary dot INSTANTLY in the event handler (bypass RAF for zero delay)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
            }
        };

        const onHover = (e) => {
            const target = e.target;
            const isClickable = target && (
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.closest('.card') || 
                target.closest('.btn') ||
                target.style.cursor === 'pointer'
            );

            if (isClickable && ringRef.current) {
                ringRef.current.style.width = '60px';
                ringRef.current.style.height = '60px';
                ringRef.current.style.backgroundColor = 'rgba(6, 182, 212, 0.15)';
                ringRef.current.style.borderColor = 'var(--primary)';
            } else if (ringRef.current) {
                ringRef.current.style.width = '40px';
                ringRef.current.style.height = '40px';
                ringRef.current.style.backgroundColor = 'transparent';
                ringRef.current.style.borderColor = 'var(--primary-dim)';
            }
        };

        const animate = () => {
            const { x, y } = mouseRef.current;
            
            // Update Ring (Smoothed / Trailing) in RAF loop
            const lerpAmount = 0.15;
            ringPosRef.current.x += (x - ringPosRef.current.x) * lerpAmount;
            ringPosRef.current.y += (y - ringPosRef.current.y) * lerpAmount;
            
            if (ringRef.current) {
                const ringSize = parseInt(ringRef.current.style.width) || 40;
                ringRef.current.style.transform = `translate3d(${ringPosRef.current.x - ringSize/2}px, ${ringPosRef.current.y - ringSize/2}px, 0)`;
            }

            requestAnimationFrame(animate);
        };

        const rafId = requestAnimationFrame(animate);
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseover', onHover);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onHover);
        };
    }, []);

    return (
        <>
            {/* Outer Ring - Smooth Trailing */}
            <div 
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '40px',
                    height: '40px',
                    border: '2px solid var(--primary-dim)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    // Note: NO transform transition here, we handle smoothness in the RAF loop
                    transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
                    willChange: 'transform'
                }}
            />
            {/* Inner Dot - Zero Latency */}
            <div 
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    willChange: 'transform'
                }}
            />
        </>
    );
};

export default CustomCursor;
